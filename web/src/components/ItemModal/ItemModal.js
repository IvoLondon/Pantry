import React, { useState, useEffect } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Divider
} from '@material-ui/core';

import './style.scss';


const ItemModal = (props) => {
    const [item, getItem] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [createMode, setCreateMode] = useState(false);
    const INITIAL_ITEM = {
        calories: 0,
        barcode: props.itemId ?? 0,
        macros: {
            carb: { total: 0, sugar: 0 },
            fat: { total: 0, saturated: 0, unsaturated: 0, trans: 0 },
            protein: 0
        },
        name: '',
        quantity: 0
    };

    useEffect(() => {
        if (props.open) {
            if (props.selectedItem) {
                getItem(props.selectedItem);
            } else {
                getItem(INITIAL_ITEM);
                setEditMode(true);
                setCreateMode(true);
            }
        }
    }, [props.open]);

    const updateField = (e) => {
        let updatedItem = { ...item };
        const name = e.target.name;
        const value = e.target.value;
        const fieldToUpdate = name.split('.');

        updatedItem = updateState(updatedItem, fieldToUpdate, value);
        getItem(updatedItem);
    };

    const updateState = (updatedItem, field = [], value) => {
        if (updatedItem.hasOwnProperty(field[0]) && typeof updatedItem[field[0]] !== 'object') {
            updatedItem[field[0]] = isNaN(Number(value)) ? value : Number(value);
        } else {
            updateState(updatedItem[field[0]], field.slice(1), value);
        }
        return updatedItem;
    };

    const onSaveChanges = () => {
        setEditMode(false);
        props.onSaveChanges(item);
    };

    const createData = (name, calories, ref) => {
        return { name, calories, ref };
    };

    // TODO: render the data auto
    const rows = [
        createData('Calories', item?.calories, 'calories'),
        createData('Protein', item?.macros?.protein, 'macros.protein'),
        createData('Carbs', item?.macros?.carb?.total, 'macros.carb.total'),
        createData(' - sugar', item?.macros?.carb?.sugar, 'macros.carb.sugar'),
        createData('Fat', item?.macros?.fat?.total, 'macros.fat.total'),
        createData(' - saturated', item?.macros?.fat?.saturated, 'macros.fat.saturated'),
        createData(' - unsaturated', item?.macros?.fat?.unsaturated, 'macros.fat.unsaturated'),
        createData(' - trans', item?.macros?.fat?.trans, 'macros.fat.trans')
    ];

    return (
        <Box className="ItemModal">
            <Dialog open={props.open} onClose={() => props.onClose(false)}>
                <form>
                    <DialogTitle disableTypography={true} id="dialog-title">
                        <Box display="flex" width="100%">
                            <Box width="100%">
                                { createMode ? <TextField
                                    className="ItemModal__text-field"
                                    id="item-barcode"
                                    disabled
                                    label="Barcode*"
                                    disabled={!editMode}
                                    name="barcode"
                                    onChange={updateField}
                                    defaultValue={props.itemId} />
                                    : null }

                                <TextField
                                    className="ItemModal__text-field"
                                    id="item-title"
                                    disabled
                                    label={createMode ? 'Product name*' : item?.barcode}
                                    disabled={!editMode}
                                    name="name"
                                    onChange={updateField}
                                    defaultValue={item?.name} />
                            </Box>
                            <Box flexShrink={4} align="right">
                                <TextField
                                    className="ItemModal__text-field"
                                    id="item-quantity"
                                    label="Quantity"
                                    disabled={!editMode}
                                    name="quantity"
                                    onChange={updateField}
                                    placeholder="0"
                                    defaultValue={item?.quantity} />
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
                                                disabled={!editMode}
                                                placeholder="0"
                                                defaultValue={row.calories}
                                                name={row.ref}
                                                onChange={updateField}
                                                inputProps={{ style: { textAlign: 'right' } }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        {!editMode
                            ? <Button autoFocus onClick={() => setEditMode(true)} color="primary">
                                Edit
                            </Button>
                            : <>
                                <Button autoFocus onClick={() => props.onClose(false)} color="primary">
                                    Close
                                </Button>
                                <Button autoFocus onClick={onSaveChanges} color="primary">
                                    Save changes
                                </Button>
                            </>
                        }
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default ItemModal;
