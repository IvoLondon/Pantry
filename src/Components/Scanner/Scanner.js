import React, { Component } from 'react';
import Quagga from 'quagga';

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
                patchSize: 'medium',
                halfSample: true
            },
            // numOfWorkers: 4,
            frequency: 1,
            decoder: {
                readers: [{
                    format: 'ean_8_reader',
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
        });

        const handleError = (err) => {
            console.log(err);
        };
        const resultCollector = Quagga.ResultCollector.create({
            capture: true,
            capacity: 20,
            blacklist: [{
                code: 'WIWV8ETQZ1', format: 'code_93'
            }, {
                code: 'EH3C-%GU23RK3', format: 'code_93'
            }, {
                code: 'O308SIHQOXN5SA/PJ', format: 'code_93'
            }, {
                code: 'DG7Q$TV8JQ/EN', format: 'code_93'
            }, {
                code: 'VOFD1DB5A.1F6QU', format: 'code_93'
            }, {
                code: '4SO64P4X8 U4YUU1T-', format: 'code_93'
            }],
            filter: function(codeResult) {
                // only store results which match this constraint
                // e.g.: codeResult
                return true;
            }
        });
    }

    render() {
        return (
            <section id="container" className="container">
                <h3>The user's camera</h3>
                <p>If your platform supports the <strong>getUserMedia</strong> API call, you can try the real-time locating and decoding features.
                    Simply allow the page to access your web-cam and point it to a barcode. You can switch between <strong>Code128</strong>
                    and <strong>EAN</strong> to test different scenarios.
                    It works best if your camera has built-in auto-focus.
                </p>
                <div className="controls">
                    <fieldset className="input-group">
                        <button className="stop">Stop</button>
                    </fieldset>
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

                        <span>Resolution (width)</span>
                        <select name="input-stream_constraints">
                            <option value="320x240">320px</option>
                            <option value="640x480">640px</option>
                            <option value="800x600">800px</option>
                            <option value="1280x720">1280px</option>
                            <option value="1600x960">1600px</option>
                            <option value="1920x1080">1920px</option>
                        </select>

                        <span>Patch-Size</span>
                        <select name="locator_patch-size">
                            <option value="x-small">x-small</option>
                            <option value="small">small</option>
                            <option value="medium">medium</option>
                            <option value="large">large</option>
                            <option value="x-large">x-large</option>
                        </select>

                        <span>Half-Sample</span>
                        <input type="checkbox" name="locator_half-sample" />

                        <span>Workers</span>
                        <select name="numOfWorkers">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="8">8</option>
                        </select>

                        <span>Camera</span>
                        <select name="input-stream_constraints" id="deviceSelection">
                        </select>

                        <span>Zoom</span>
                        <select name="settings_zoom"></select>

                        <span>Torch</span>
                        <input type="checkbox" name="settings_torch" />

                    </fieldset>
                </div>
                <div id="result_strip">
                    <ul className="thumbnails"></ul>
                    <ul className="collector"></ul>
                </div>
                <div id="interactive" className="viewport"></div>
            </section>
        );
    }
}

export default Scanner;
