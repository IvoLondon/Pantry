import React from 'react';
import {
    Dialog,
    DialogContent,
    Divider,
    Button,
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './style.scss';

const dividerStyle = makeStyles({
    root: {
        margin: '20px 0',
        width: '100%'
    }
});

const contentStyle = makeStyles({
    root: {
        paddingBottom: '30px'
    }
});

const ResultModal = (props) => {
    const dividerClasses = dividerStyle();
    const dialogClasses = contentStyle();

    return (
        <Dialog open={props.open} onClose={props.toggleResultModal}>
            <DialogContent classes={{ root: dialogClasses.root }}>
                <h5 className="result-modal__subtitle">Is the barcode correct?</h5>
                <h3 className="result-modal__title">{props.itemId}</h3>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Button variant="contained" color="primary" onClick={props.onScanAgain}>Scan Again</Button>
                    <Divider classes={{ root: dividerClasses.root }} />
                    <Button variant="contained" color="secondary" onClick={props.onCreateNew}>Add New</Button>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ResultModal;
