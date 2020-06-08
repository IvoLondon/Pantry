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
    Divider,
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from '@material-ui/core';
import { 
    storeCodes,
} from './../../utilities';
import './style.scss';
import {
    ItemInterface
} from './interfaces';

interface Props {
    open: boolean,
    createMode: boolean,
    barcodeId: string,
    barcodeType: string,
    item: ItemInterface,
    selectedItem: ItemInterface,
    onSaveChanges?: (v: ItemInterface) => void | {},
    onClose: (v: boolean) => boolean
}

const NewProductModal: React.FC<Props> = (props) => {
    const INITIAL_ITEM: ItemInterface = {
        quantity: 1,
        continuous: false,
        item: {
            name: '',
            calories: 0,
            barcodeId: props.barcodeId,
            barcodeType: props.barcodeType,
            macros: {
                carb: { total: 0, sugar: 0 },
                fat: { total: 0, saturated: 0, unsaturated: 0, trans: 0 },
                protein: 0
            },    
        }
    };

    const [item, getItem] = useState<ItemInterface>(INITIAL_ITEM);

    const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        const fieldToUpdate = name.split('.');
        getItem(updateState(item, fieldToUpdate, value));
    };

    const updateState = (updatedItem, field = [], value) => {
        // TODO: USE LODASH CLONE AND SETWITH
        if (updatedItem.hasOwnProperty(field[0]) && typeof updatedItem[field[0]] !== 'object') {
            updatedItem[field[0]] = isNaN(Number(value)) ? value : Number(value);
        } else {
            updateState(updatedItem[field[0]], field.slice(1), value);
        }
        return updatedItem;
    };

    const onSaveChanges = () => {
        props.onSaveChanges(item);
    };

    const createData = (name, calories, ref) => {
        return { name, calories, ref };
    };

    const getStoreCodes = (storecodes) => {
        return storecodes.map(({code, label}) => {
            return <MenuItem key={code} value={code}>{label}</MenuItem>
        })
    }

    // TODO: render the data auto
    const rows = [
        createData('Calories', item?.item?.calories, 'item.calories'),
        createData('Protein', item?.item?.macros?.protein, 'item.macros.protein'),
        createData('Carbs', item?.item?.macros?.carb?.total, 'item.macros.carb.total'),
        createData(' - sugar', item?.item?.macros?.carb?.sugar, 'item.macros.carb.sugar'),
        createData('Fat', item?.item?.macros?.fat?.total, 'item.macros.fat.total'),
        createData(' - saturated', item?.item?.macros?.fat?.saturated, 'item.macros.fat.saturated'),
        createData(' - unsaturated', item?.item?.macros?.fat?.unsaturated, 'item.macros.fat.unsaturated'),
        createData(' - trans', item?.item?.macros?.fat?.trans, 'item.macros.fat.trans')
    ];
    return (
        <Box className="ItemModal">
            <Dialog open={props.open} onClose={() => props.onClose(false)}>
                <form>
                    <DialogTitle disableTypography={true} id="dialog-title">
                        <Box width="100%">
                            <TextField
                                name="item.barcodeId"
                                label="Barcode*"
                                onChange={updateField}
                                className="ItemModal__text-field"
                                defaultValue={item.item.barcodeId} />
                            <FormControl>
                                <InputLabel className="store-dropdown-label" id="store-dropdown-label">Select your store:</InputLabel>
                                <Select
                                    name="item.barcodeType"
                                    labelId="barcode-type-label"
                                    value={item.item.barcodeType}
                                    onChange={updateField}
                                    className="barcode-type-dropdown">
                                    {getStoreCodes(storeCodes)}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" width="100%">
                            <Box width="100%">
                                <TextField
                                    name="item.name"
                                    className="ItemModal__text-field"
                                    label="Product name*"
                                    onChange={updateField}
                                    defaultValue={item?.item?.name} />
                            </Box>
                            <Box flexShrink={4}>
                                <TextField
                                    className="ItemModal__text-field"
                                    id="item-quantity"
                                    label="Quantity"
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
                                                placeholder="0"
                                                defaultValue={row.calories}
                                                name={row.ref}
                                                onChange={updateField}
                                                inputProps={{ style: { textAlign: 'right' }}} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={() => props.onClose(false)} color="primary">
                            Close
                        </Button>
                        <Button autoFocus onClick={onSaveChanges} color="primary">
                            Save changes
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default NewProductModal;
