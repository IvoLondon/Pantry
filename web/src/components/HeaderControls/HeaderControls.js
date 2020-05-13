import React from 'react';

import {
    IconButton,
    Box,
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    AddAPhoto,
    PlaylistAdd
} from '@material-ui/icons';
import './style.scss';

{/* TODO: REFACTOR STYLE IF NEEDED */}
const inputStyles = makeStyles({
    underline: {
        '&::before': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.42)'
        },
        '&::hover:before': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.87)'
        }
    }
});

const HeaderControls = (props) => {
    const classes = inputStyles();
    return (
        <Grid container direction="row" alignContent="flex-end" justify="flex-end">
            <Grid item container xs={6} alignContent="center" justify="flex-start">
                <Grid>
                    <h5 className="header-controls__title">Scan your can</h5>
                </Grid>
            </Grid>
            <Grid item container xs={6} alignContent="center" justify="flex-end">
                <Grid item>
                    <Box>
                        {/* TODO: CREATE ADD FUNCTIONALITY */}
                        <IconButton disabled className="header-controls__camera-icon" size="medium">
                            <PlaylistAdd />
                        </IconButton>
                        <IconButton className="header-controls__camera-icon" size="medium" color="inherit" onClick={props.showScanner}>
                            <AddAPhoto />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default HeaderControls;
