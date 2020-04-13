import React, { useState, useEffect } from 'react';

import {
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import './style.scss';

const UpdateItemModal = (props) => {
    const [itemNutrition, getItemNutrition] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${props.barcode}`)
            .then(response => response.json())
            .then(response => {
                getItemNutrition(response.data);
            }, error => {
                console.log(error);
            });
    }, []);

    const updateField = (e, field) => {
        const newItemNutrition = { ...itemNutrition };
        const fieldToUpdate = field.split('.');
        let temp = newItemNutrition;
        for (let i = 0; i < fieldToUpdate.length; i++) {
            if (temp.hasOwnProperty(fieldToUpdate[i]) && typeof temp[fieldToUpdate[i]] === 'object') {
                temp = temp[fieldToUpdate[i]];
            } else {
                temp[fieldToUpdate[i]] = Number(e.target.value);
            }
        }
        getItemNutrition(newItemNutrition);
    };

    const updateItem = async () => {
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemNutrition)
        };
        await fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${itemNutrition._id}`, options);
        setEditMode(false);
    };

    function createData(name, calories, ref) {
        return { name, calories, ref };
    }

    const rows = [
        createData('Protein', itemNutrition?.macros?.protein, 'macros.protein'),
        createData('Carbs', itemNutrition?.macros?.carb?.total, 'macros.carb.total'),
        createData(' - sugar', itemNutrition?.macros?.carb?.sugar, 'macros.carb.sugar'),
        createData('Fat', itemNutrition?.macros?.fat?.total, 'macros.fat.total'),
        createData(' - saturated', itemNutrition?.macros?.fat?.saturated, 'macros.fat.saturated'),
        createData(' - unsaturated', itemNutrition?.macros?.fat?.unsaturated, 'macros.fat.unsaturated'),
        createData(' - trans', itemNutrition?.macros?.fat?.trans, 'macros.fat.trans')
    ];

    if (!itemNutrition.name) {
        return null;
    }
    return (
        <Box className="ItemModal">
            <DialogTitle disableTypography={true} id="dialog-title" onClose={props.onClose}>
                <Box display="flex" width="100%">
                    <Box width="100%">
                        <TextField
                            className="ItemModal__text-field"
                            id="item-title"
                            disabled
                            label={itemNutrition.barcode}
                            disabled={!editMode}
                            onChange={(e) => updateField(e, 'name')}
                            defaultValue={itemNutrition.name} />
                    </Box>
                    <Box flexShrink={4} align="right">
                        <TextField
                            className="ItemModal__text-field"
                            id="item-quantity"
                            label="Quantity"
                            disabled={!editMode}
                            onChange={(e) => updateField(e, 'quantity')}
                            defaultValue={itemNutrition.quantity} />
                    </Box>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Table className="ItemModal__content" size="small">
                    <TableBody>
                        { rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell colSpan={3}>
                                    {row.name}
                                </TableCell>
                                <TableCell colSpan={1} align="right">
                                    <TextField
                                        className="ItemModal__text-field"
                                        onChange={(e) => updateField(e, row.ref)}
                                        disabled={!editMode}
                                        defaultValue={row.calories}
                                        inputProps={{ style: { textAlign: 'right' } }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


            </DialogContent>
            <DialogActions>
                {!editMode ?
                    <Button autoFocus onClick={() => setEditMode(true)} color="primary">
                        Edit
                    </Button>
                    : <>
                        <Button autoFocus onClick={props.onClose} color="primary">
                            Close
                        </Button>
                        <Button autoFocus onClick={updateItem} color="primary">
                            Save changes
                        </Button>
                    </>
                }
            </DialogActions>
        </Box>
    );
};

export default UpdateItemModal;
