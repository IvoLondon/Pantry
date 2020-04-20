export const handleError = (err) => {
    console.log(err);
};

export const initStoreCodes = [
    {
        code: 'ean_8',
        label: 'Sainsburys'
    },
    {
        code: 'ean',
        label: 'Aldi'
    }
    // <select onChange={this.changeState} name="decoder_readers">
    //     <option value="code_128">Code 128</option>
    //     <option value="code_39">Code 39</option>
    //     <option value="code_39_vin">Code 39 VIN</option>
    //     <option value="ean">EAN</option>
    //     <option value="ean_extended">EAN-extended</option>
    //     <option value="ean_8">EAN-8</option>
    //     <option value="upc">UPC</option>
    //     <option value="upc_e">UPC-E</option>
    //     <option value="codabar">Codabar</option>
    //     <option value="i2of5">Interleaved 2 of 5</option>
    //     <option value="2of5">Standard 2 of 5</option>
    //     <option value="code_93">Code 93</option>
    // </select>

];

export const initCameraState = {
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
            format: 'ean_8_reader',
            config: {}
        }]
    },
    locate: true
};


export const inputMapper = {
    inputStream: {
        constraints: function (value) {
            if (/^(\d+)x(\d+)$/.test(value)) {
                const values = value.split('x');
                return {
                    width: { min: parseInt(values[0]) },
                    height: { min: parseInt(values[1]) }
                };
            }
            return {
                deviceId: value
            };
        }
    },
    numOfWorkers: function (value) {
        return parseInt(value);
    },
    decoder: {
        readers: function (value) {
            debugger
            if (value === 'ean_extended') {
                return [{
                    format: 'ean_reader',
                    config: {
                        supplements: [
                            'ean_5_reader', 'ean_2_reader'
                        ]
                    }
                }];
            }
            return [{
                format: value + '_reader',
                config: {}
            }];
        }
    }
};
