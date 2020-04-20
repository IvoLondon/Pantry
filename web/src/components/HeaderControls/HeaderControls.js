import React from 'react';

import {
    Input,
    IconButton,
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import './style.scss';

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
        <Grid container direction="column" alignContent="center">
            <h5 className="header-controls__title">Scan your goods</h5>
            <Grid>
                <Input classes={{ underline: classes.underline }} autoFocus={false} />
                <IconButton size="medium" color="primary" onClick={props.showScanner}>
                    <AddAPhotoIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default HeaderControls;
