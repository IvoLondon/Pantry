import React, { useState, useEffect } from 'react';

import {
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';


const UpdateItemModal = (props) => {
    const [itemNutrition, getItemNutrition] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${props.barcode}`)
            .then(response => response.json())
            .then(response => {
                getItemNutrition(response.data);
            }, error => {
                console.log(error);
            });
    }, []);
    return (
        <Box>
            <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
                {itemNutrition.name}
            </DialogTitle>
            <DialogContent dividers>
                {itemNutrition.protein}

                {itemNutrition.barcode}

                Protein:
                {itemNutrition?.macros?.protein}

                Carbs:
                {itemNutrition?.macros?.carbs?.total}
                {itemNutrition?.macros?.carbs?.sugar}

                Fats:
                {itemNutrition?.macros?.fat?.total}
                {itemNutrition?.macros?.fat?.saturated}
                {itemNutrition?.macros?.fat?.unsaturated}
                {itemNutrition?.macros?.fat?.trans}

                Quantity:
                {itemNutrition.quantity}

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={props.onClose} color="primary">
                    Save changes
                </Button>
            </DialogActions>
        </Box>
    );
};

export default UpdateItemModal;
