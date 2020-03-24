import React, { Component } from 'react';
import * as Quagga from './quagga';

import './style.scss';

class Scanner extends Component {
    state = {

    }

    componentDidMount() {
        this.init();
    }

    init() {
        const scannerState = {
            inputStream: {
                type: 'LiveStream',
                constraints: {
                    width: { min: 640 },
                    height: { min: 480 },
                    facingMode: 'environment',
                    aspectRatio: { min: 1, max: 2 }
                }
            },
            locator: {
                patchSize: 'large',
                halfSample: true,
                debug: {
                    showCanvas: false,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: true,
                    showLabels: true,
                    showPatchLabels: true,
                    showRemainingPatchLabels: true,
                    boxFromPatches: {
                      showTransformed: true,
                      showTransformedBox: true,
                      showBB: true
                    }
                  }
            },
            numOfWorkers: 0,
            frequency: 1,
            decoder: {
                readers: [{
                    format: 'ean_reader',
                    config: {}
                }]
            },
            locate: true
        };

        Quagga.init({ ...scannerState }, function(err) {
            if (err) {
                return handleError(err);
            }
            Quagga.registerResultCollector(resultCollector);
            // App.attachListeners();
            // App.checkCapabilities();
            Quagga.start();
            
            checkCapabilities();
        });


        const handleError = (err) => {
            console.log(err);
        };
        const resultCollector = Quagga.ResultCollector.create({
            capture: true,
            capacity: 5,
            filter: function(codeResult) {
                // only store results which match this constraint
                // e.g.: codeResult
                // TODO: get objects
                return true;
            }
        });

        const checkCapabilities = () => {
            //TODO: TEST IF IT WORKS
            const track = Quagga.CameraAccess.getActiveTrack();
            let capabilities = {};
            if (typeof track.getCapabilities === 'function') {
                capabilities = track.getCapabilities();
            }
            applySettingsVisibility('torch', capabilities.torch);
        };
         Quagga.onProcessed(function(result) {
            const drawingCtx = Quagga.canvas.ctx.overlay;
            const drawingCanvas = Quagga.canvas.dom.overlay;
        
            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function(box) {
                        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                    });
                }
        
                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
                }
        
                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
                }
            }
        });


        const applySettingsVisibility = (setting, capability) => {
            // depending on type of capability
            if (typeof capability === 'boolean') {
                const node = document.querySelector('input[name="settings_' + setting + '"]');
                if (node) {
                    node.parentNode.style.display = capability ? 'block' : 'none';
                }
                return;
            }
            if (window.MediaSettingsRange && capability instanceof window.MediaSettingsRange) {
                const node = document.querySelector('select[name="settings_' + setting + '"]');
                if (node) {
                    // TODO: MAKE THIS WORK
                    //this.updateOptionsForMediaRange(node, capability);
                    node.parentNode.style.display = 'block';
                }
                return;
            }
        }
        
        Quagga.onDetected(function(result) {
            //let code = result.codeResult.code;
            // if (App.lastResult !== code) {
            // }
            console.log(result);
        });
    }

    render() {
        return (
            <section id="container" className="container">
                <div className="controls">
                    <fieldset className="reader-config-group">
                        <span>Barcode-Type</span>
                        <select name="decoder_readers">
                            <option value="code_128">Code 128</option>
                            <option value="code_39">Code 39</option>
                            <option value="code_39_vin">Code 39 VIN</option>
                            <option value="ean">EAN</option>
                            <option value="ean_extended">EAN-extended</option>
                            <option value="ean_8">EAN-8</option>
                            <option value="upc">UPC</option>
                            <option value="upc_e">UPC-E</option>
                            <option value="codabar">Codabar</option>
                            <option value="i2of5">Interleaved 2 of 5</option>
                            <option value="2of5">Standard 2 of 5</option>
                            <option value="code_93">Code 93</option>
                        </select>
                        <span>Camera</span>
                        <select name="input-stream_constraints" id="deviceSelection">
                        </select>
                        <span>Torch</span>
                        <input type="checkbox" name="settings_torch" />
                    </fieldset>
                </div>
                <div id="interactive" className="viewport"></div>
                <fieldset className="input-group">
                    <button onClick={this.props.toggleScanner} className="stop">Stop</button>
                </fieldset>
            </section>
        );
    }
}

export default Scanner;
