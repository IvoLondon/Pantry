export const handleError = (err) => {
    console.log(err);
};

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
