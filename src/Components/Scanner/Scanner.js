import React, { Component } from 'react';
import * as Quagga from './quagga';
import {
    initStoreCodes,
    initCameraState,
    handleError,
    inputMapper
} from './utilities';
import { whatUpdated } from './../../utilities';
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
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';

import './style.scss';


class Scanner extends Component {
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

    init = () => {
        const App = this;
        this.initCameraSelection();

        Quagga.init({ ...App.state.cameraState }, function (err) {
            if (err) {
                return handleError(err);
            }
            Quagga.registerResultCollector(resultCollector);
            App.checkCapabilities();
            Quagga.start();
        });


        const resultCollector = Quagga.ResultCollector.create({
            capture: true,
            capacity: 5,
            filter: function (codeResult) {
                // only store results which match this constraint
                // e.g.: codeResult
                // TODO: get objects
                return true;
            }
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

        Quagga.onDetected(function (result) {
            // let code = result.codeResult.code;
            // if (App.lastResult !== code) {
            // }
            console.log(result);
        });
    };

    closeCamera = (e) => {
        e.preventDefault();
        this.props.toggleScanner();
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
        console.log('Torch ', capabilities.torch);
        this.setState({
            torchExists: !!capabilities.torch
        });
    }

    changeState = (e) => {
        // TODO:  REMOVE WHEN ALL WIRED
        this.initCameraSelection();
        e.preventDefault();

        const $target = e.target,
            value = $target.getAttribute('type') === 'checkbox' ? $target.setAttribute('checked', 'true') : $target.value,
            name = $target.getAttribute('name'),
            state = this.convertNameToState(name);
        console.log(`Value of ${state} changed to ${value}`);
        this.setCameraState(state, value);
    };

    setBarcode = (e) => {
        e.preventDefault();
        const $target = e.target,
            value = $target.value,
            name = 'decoder_readers',
            state = this.convertNameToState(name);
        console.log(`Value of ${state} changed to ${value}`);
        this.setCameraState(state, value);
        this.setState({
            selectedStore: e.target.value
        });
    }

    setCamera = (e) => {
        e.preventDefault();
        const camerasList = this.state.camerasList;
        let activeCameraNum = this.state.activeCamera + 1;
        if (activeCameraNum >= camerasList.length) {
            activeCameraNum = 0;
        }
        const value = camerasList[activeCameraNum].deviceId || camerasList[activeCameraNum].id,
            name = 'input-stream_constraints',
            state = this.convertNameToState(name);
        this.setCameraState(state, value);

        this.setState({
            activeCamera: activeCameraNum
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

    accessByPath = (obj, path, val) => {
        const parts = path.split('.'),
            setter = (typeof val !== 'undefined');

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
        if (track && typeof track.getCapabilities === 'function') {
            switch (setting) {
                case 'torch':
                    return track.applyConstraints({ advanced: [{ torch: !!value }] });
            }
        }
    };


    initCameraSelection = () => {
        const streamLabel = Quagga.CameraAccess.getActiveStreamLabel(),
            App = this;

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
                                        <InputLabel id="store-dropdown-label">Select your store:</InputLabel>
                                        <Select
                                            labelId="store-dropdown-label"
                                            id="store-dropdown"
                                            name="decoder_readers"
                                            value={this.state.selectedStore}
                                            onChange={this.setBarcode}
                                        >
                                            {this.getStoreCodes(this.state.storeCodes)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <Grid item xs={12}>
                                        <IconButton disabled={!this.state.torchExists} onClick={this.setTorch} color="inherit" size="medium" aria-label="toggle torch">
                                            <WbIncandescentIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12}>
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

const customSelectColors = {
    root: {
        color: 'white'
    },
    filled: {
        color: 'white',
    }
};

export default withStyles(customSelectColors)(Scanner);
