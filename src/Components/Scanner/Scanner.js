import React, { Component } from 'react';
import * as Quagga from './quagga';
import { cameraState, inputMapper, checkCapabilities } from './utilities';

import './style.scss';

class Scanner extends Component {
    state = {
        ...cameraState
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps, prevState) {
        Object.entries(this.props).forEach(([key, val]) =>
          prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
          Object.entries(this.state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
          );
        }

        this.init();
    }

    init() {
        const App = this;
        debugger
        Quagga.init({ ...App.state }, function(err) {
            if (err) {
                return App.handleError(err);
            }
            debugger
            console.log(App.state);
            Quagga.registerResultCollector(resultCollector);
            App.initCameraSelection();
            checkCapabilities();
            Quagga.start();
        });


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

        Quagga.onProcessed(function(result) {
            const drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
                    result.boxes.filter(function(box) {
                        return box !== result.box;
                    }).forEach(function(box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });

        Quagga.onDetected(function(result) {
            // let code = result.codeResult.code;
            // if (App.lastResult !== code) {
            // }
            console.log(result);
        });
    }

    handleError = (err) => {
        console.log(err);
    }

    closeCamera = (e) => {
        e.preventDefault();
        Quagga.stop();
        this.props.toggleScanner();
    }

    changeState = (e) => {
        this.initCameraSelection();
        e.preventDefault();

        const $target = e.target,
            value = $target.getAttribute('type') === 'checkbox' ? $target.setAttribute('checked', 'true') : $target.value,
            name = $target.getAttribute('name'),
            state = this.convertNameToState(name);
        console.log(`Value of ${state} changed to ${value}`);
        this.setCameraState(state, value);
    };

    convertNameToState = (name) => {
        return name.replace('_', '.').split('-').reduce(function(result, value) {
            return result + value.charAt(0).toUpperCase() + value.substring(1);
        });
    };

    // setCameraState = (path, value) => {
    //     if (typeof this.accessByPath(inputMapper, path) === 'function') {
    //         value = this.accessByPath(inputMapper, path)(value);
    //     }
        
    //     if (path.startsWith('settings.')) {
    //         const setting = path.substring(9);
    //         return this.applySetting(setting, value);
    //     }


    //     this.accessByPath(inputMapper, path, value);
    //     console.log(JSON.stringify(this.state));
    //     console.log(value);
    //     this.setState({
    //         ...this.state,
    //         decoder: {
    //             readers: {
    //                 format: value
    //             }
    //         }
    //     });
    //     Quagga.stop();
    //     // this.init();
    // };

    setCameraState = (path, value) => {
        var self = this;
        // TODO: Update to use setState

        if (typeof self.accessByPath(inputMapper, path) === "function") {
            value = self.accessByPath(inputMapper, path)(value);
        }

        if (path.startsWith('settings.')) {
            var setting = path.substring(9);
            return self.applySetting(setting, value);
        }
        self.accessByPath(self.state, path, value);

        console.log(JSON.stringify(self.state));
        Quagga.stop();
        this.init();
    };

    accessByPath = (obj, path, val) => {
        const parts = path.split('.'),
            depth = parts.length,
            setter = (typeof val !== 'undefined');

        return parts.reduce(function(o, key, i) {
            if (setter && (i + 1) === depth) {
                if (typeof o[key] === 'object' && typeof val === 'object') {
                    Object.assign(o[key], val);
                } else {
                    o[key] = val;
                }
            }
            return key in o ? o[key] : {};
        }, obj);
    };

    applySetting = (setting, value) => {
        const track = Quagga.CameraAccess.getActiveTrack();
        if (track && typeof track.getCapabilities === 'function') {
            switch (setting) {
                case 'torch':
                    return track.applyConstraints({ advanced: [{ torch: !!value }] });
            }
        }
    };


    initCameraSelection = () => {
        const streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

        return Quagga.CameraAccess.enumerateVideoDevices()
            .then(function(devices) {
                function pruneText(text) {
                    return text.length > 30 ? text.substr(0, 30) : text;
                }
                const $deviceSelection = document.getElementById('deviceSelection');
                while ($deviceSelection.firstChild) {
                    $deviceSelection.removeChild($deviceSelection.firstChild);
                }
                devices.forEach(function(device) {
                    const $option = document.createElement('option');
                    $option.value = device.deviceId || device.id;
                    $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                    $option.selected = streamLabel === device.label;
                    $deviceSelection.appendChild($option);
                });
            });
    }

    render() {
        return (
            <section id="container" className="container">
                <div className="controls">
                    <fieldset className="reader-config-group">
                        <span>Barcode-Type</span>
                        <select onChange={this.changeState} name="decoder_readers">
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
                        <select onChange={this.changeState} name="input-stream_constraints" id="deviceSelection">
                        </select>
                        <div id="torch" style={{ display: 'none' }}>
                            <span>Torch</span>
                            <input onChange={this.changeState} type="checkbox" name="settings_torch" />
                        </div>
                    </fieldset>
                </div>
                <div id="interactive" className="viewport"></div>
                <fieldset className="input-group">
                    <button onClick={this.closeCamera} id="stop-button" className="stop">Stop</button>
                </fieldset>
            </section>
        );
    }
}

export default Scanner;
