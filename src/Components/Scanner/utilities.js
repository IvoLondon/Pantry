import * as Quagga from './quagga';

export const cameraState = {
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


export const inputMapper = {
    inputStream: {
        constraints: function(value) {
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
    numOfWorkers: function(value) {
        return parseInt(value);
    },
    decoder: {
        readers: function(value) {
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

export const checkCapabilities = () => {
    const track = Quagga.CameraAccess.getActiveTrack();
    let capabilities = {};
    if (typeof track.getCapabilities === 'function') {
        capabilities = track.getCapabilities();
    }
    applySettingsVisibility('torch', capabilities.torch);
};

const applySettingsVisibility = (setting, capability = false) => {
    // depending on type of capability
    if (typeof capability === 'boolean') {
        const node = document.querySelector('input[name="settings_' + setting + '"]');
        if (node) {
            node.parentNode.style.display = capability ? 'block' : 'none';
        }
        return;
    }
};
