import React, { Component } from 'react';
import * as Quagga from './quagga';
import {
    initStoreCodes,
    initCameraState,
    handleError,
    inputMapper
} from './utilities';
import {
    whatUpdated,
    updateWithoutMutation
} from './../../utilities';
import {
    Dialog,
    Box,
    Grid,
    MenuItem,
    IconButton,
    InputLabel,
    FormControl,
    Select
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';

import './style.scss';

class Scanner extends Component {
    lastCode;
    state = {
        storeCodes: [...initStoreCodes],
        selectedStore: initStoreCodes[0].code,
        camerasList: [],
        activeCamera: 0,
        cameraState: { ...initCameraState },
        torchExists: false,
        torchState: false
    }

    onEntered = () => {
        this.init();
    }

    onExit = () => {
        Quagga.stop();
    }

    componentDidUpdate(prevProps, prevState) {
        whatUpdated(prevProps, prevState, this.props, this.state);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount ');
        Quagga.stop();
    }

    init = () => {
        const App = this;
        Quagga.init({ ...App.state.cameraState }, function (err) {
            if (err) {
                return handleError(err);
            }
            setTimeout(() => {
                Quagga.start();
            }, 1000);
            App.initCameraSelection();
            App.checkCapabilities();
        });

        Quagga.onProcessed(function (result) {
            const drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
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

        const detectedHandler = (result) => {
            const code = result?.codeResult?.code;
            if (code !== App.lastCode) {
                App.lastCode = code;
                Quagga.stop();
                Quagga.offDetected(detectedHandler);
                if (result) App.props.onDetect(code);
            }
        };

        Quagga.onDetected(detectedHandler);
    };

    closeCamera = (e) => {
        e.preventDefault();
        this.props.hideScanner();
    };

    convertNameToState = (name) => {
        return name.replace('_', '.').split('-').reduce(function (result, value) {
            return result + value.charAt(0).toUpperCase() + value.substring(1);
        });
    };

    checkCapabilities = () => {
        const track = Quagga.CameraAccess.getActiveTrack();
        let capabilities = {};
        if (typeof track.getCapabilities === 'function') {
            capabilities = track.getCapabilities();
        }
        this.setState({
            torchExists: !!capabilities.torch
        });
    }

    setBarcode = (e) => {
        e.preventDefault();
        const $target = e.target,
            value = $target.value,
            name = 'decoder_readers',
            state = this.convertNameToState(name);
        console.log(`Value of ${state} changed to ${value}`);

        this.setState({
            selectedStore: e.target.value
        }, () => {
            this.setCameraState(state, [{format: value, config: {}}]);
        });
    }

    setCamera = (e) => {
        e.preventDefault();
        let activeCameraNum;
        const camerasList = this.state.camerasList,
            streamLabel = Quagga.CameraAccess.getActiveStreamLabel();
        for (const camera in camerasList) {
            if (camerasList[camera].label === streamLabel) {
                activeCameraNum = +camera + 1;
            }
        }
        if (activeCameraNum >= camerasList.length) activeCameraNum = 0;

        this.setState({
            activeCamera: activeCameraNum
        }, () => {
            const value = camerasList[activeCameraNum].deviceId || camerasList[activeCameraNum].id,
                name = 'input-stream_constraints',
                state = this.convertNameToState(name);
            this.setCameraState(state, value);
        });
    }

    setTorch = () => {
        const value = !this.state.torchState;
        if (this.state.torchExists) {
            this.setState({
                torchState: value
            });
            return this.applySetting('torch', value);
        } else {
            this.setState({
                torchState: false
            });
        }
    }

    setCameraState = (path, value) => {
        if (typeof this.accessByPath(inputMapper, path) === 'function') {
            value = this.accessByPath(inputMapper, path)(value);
        }

        const newState = this.accessByPath(this.state.cameraState, path, value);
        this.setState({
            ...this.state,
            cameraState: { ...newState }
        }, () => {
            console.log(this.state);
            Quagga.stop();
            this.init();
        });
    };

    // accessByPath = (obj, path, val) => {
    //     if (typeof val !== 'undefined') {
    //         return updateWithoutMutation(obj, path, val);
    //     }
    // };
    accessByPath = (obj, path, val) => {
        const parts = path.split('.'),
            setter = (typeof val !== 'undefined');
        // TODO: IMPROVE BIG TIME
        if (setter) {
            let newState;
            if (parts[0] === 'inputStream') {
                newState = {
                    ...this.state.cameraState,
                    inputStream: {
                        ...this.state.cameraState.inputStream,
                        constraints: {
                            ...this.state.cameraState.inputStream.constraints,
                            facingMode: this.state.activeCamera ? 'environment' : 'user',
                            devideId: val.deviceId
                        }
                    }
                };
            } else {
                if (typeof obj[parts[0]] === 'object' && typeof val === 'object') {
                    newState = { ...obj };
                    // TODO : Improve mutation
                    newState[parts[0]] = { ...obj[parts[0]] };
                    newState[parts[0]][parts[1]] = [...newState[parts[0]][parts[1]]];
                    newState[parts[0]][parts[1]][0] = val[0];
                } else {
                    throw new Error('Error with new value');
                }
            }
            return newState;
        }

        return parts.reduce(function (o, key, i) {
            return key in o ? o[key] : {};
        }, obj);
    };
    
    applySetting = (setting, value) => {
        const track = Quagga.CameraAccess.getActiveTrack();
        if (typeof track?.getCapabilities === 'function') {
            switch (setting) {
                case 'torch':
                    return track.applyConstraints({ advanced: [{ torch: !!value }] });
            }
        }
    };

    initCameraSelection = () => {
        const App = this;
        return Quagga.CameraAccess.enumerateVideoDevices()
            .then(function (devices) {
                App.setState({
                    ...App.state,
                    camerasList: devices
                });
            });
    }

    getStoreCodes = (stores) => {
        return stores.map(store => {
            return (
                <MenuItem key={store.code} value={store.code}>{store.label}</MenuItem>
            );
        });
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.showScanner}
                    onEntered={this.init}
                >
                    <Box className="Scanner">
                        <div id="interactive" className="viewport"></div>
                        <fieldset className="controls">
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <FormControl fullWidth>
                                        <InputLabel className="store-dropdown-label" id="store-dropdown-label">Select your store:</InputLabel>
                                        <Select
                                            labelId="store-dropdown-label"
                                            id="store-dropdown"
                                            name="decoder_readers"
                                            value={this.state.selectedStore}
                                            onChange={this.setBarcode}
                                            className="store-dropdown"
                                        >
                                            {this.getStoreCodes(this.state.storeCodes)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <Grid container direction="column" alignItems='flex-end'>
                                        <IconButton disabled={!this.state.torchExists} onClick={this.setTorch} color="inherit" size="medium" aria-label="toggle torch">
                                            <WbIncandescentIcon />
                                        </IconButton>
                                        <IconButton disabled={this.state.camerasList.length < 2} onClick={this.setCamera} color="inherit" size="medium" aria-label="close scanner">
                                            <FlipCameraIosIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </fieldset>
                        <fieldset className="input-group-close">
                            <IconButton onClick={this.closeCamera} color="inherit" size="medium" aria-label="close scanner">
                                <CloseIcon />
                            </IconButton>
                        </fieldset>
                    </Box>
                </Dialog>
            </div>
        );
    }
}

export default Scanner;
