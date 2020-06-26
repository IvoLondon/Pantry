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
import { storeCodes } from './../../utilities';
import { INITIAL_ITEM } from './../../const';
import { ItemInterface } from './../../constInterfaces';
import './style.scss';

interface Props {
    open: boolean,
    createMode: boolean,
    item: ItemInterface,
    selectedItem: ItemInterface,
    onSaveChanges?: (v: ItemInterface) => void | {},
    onClose: (v: boolean) => boolean
}

const ItemModal: React.FC<Props> = (props) => {

    const [unit, setUnit] = useState<ItemInterface>(INITIAL_ITEM);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (props.open) {
            if (props.selectedItem) {
                setUnit(props.selectedItem);
            } else {
                setUnit(INITIAL_ITEM);
                setEditMode(true);
            }
        }
        return () => {
            setUnit(INITIAL_ITEM);
            setEditMode(false);
        };
    }, [props.open]);

    const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        const fieldToUpdate = name.split('.');

        setUnit(updateStateHelper({...unit}, fieldToUpdate, value));
    };

    const updateStateHelper = (unitToUpdate, field = [], value) => {
        // TODO: USE LODASH CLONE AND SETWITH
        if (unitToUpdate.hasOwnProperty(field[0]) && typeof unitToUpdate[field[0]] !== 'object') {
            unitToUpdate[field[0]] = isNaN(Number(value)) ? value : Number(value);
        } else {
            updateStateHelper(unitToUpdate[field[0]], field.slice(1), value);
        }
        return unitToUpdate;
    };

    const onSaveChanges = () => {
        setEditMode(false);
        props.onSaveChanges(unit);
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
        createData('Calories', unit?.item?.calories, 'item.calories'),
        createData('Protein', unit?.item?.macros?.protein, 'item.macros.protein'),
        createData('Carbs', unit?.item?.macros?.carb?.total, 'item.macros.carb.total'),
        createData(' - sugar', unit?.item?.macros?.carb?.sugar, 'item.macros.carb.sugar'),
        createData('Fat', unit?.item?.macros?.fat?.total, 'item.macros.fat.total'),
        createData(' - saturated', unit?.item?.macros?.fat?.saturated, 'item.macros.fat.saturated'),
        createData(' - unsaturated', unit?.item?.macros?.fat?.unsaturated, 'item.macros.fat.unsaturated'),
        createData(' - trans', unit?.item?.macros?.fat?.trans, 'item.macros.fat.trans')
    ];
    return (
        <Box className="ItemModal">
            <Dialog open={props.open} onClose={() => props.onClose(false)}>
                <form>
                    <DialogTitle disableTypography={true} id="dialog-title">
                        { props.createMode ?
                            <Box width="100%">
                                <TextField
                                    name="barcode"
                                    label="Barcode*"
                                    disabled={!editMode}
                                    onChange={updateField}
                                    className="ItemModal__text-field"
                                    defaultValue={unit.item.barcodeId} />
                                <FormControl>
                                    <InputLabel className="store-dropdown-label" id="store-dropdown-label">Select your store:</InputLabel>
                                    <Select
                                        name="barcodeType"
                                        labelId="barcode-type-label"
                                        value={storeCodes[0].code}
                                        onChange={updateField}
                                        className="barcode-type-dropdown"
                                    >
                                        {getStoreCodes(storeCodes)}
                                    </Select>
                                </FormControl>
                            </Box>
                        : null }
                        <Box display="flex" width="100%">
                            <Box width="100%">
                                <TextField
                                    name="name"
                                    className="ItemModal__text-field"
                                    label={props.createMode ? 'Product name*' : unit?.item?.barcodeId}
                                    disabled={!editMode}
                                    onChange={updateField}
                                    defaultValue={unit?.item?.name} />
                            </Box>
                            <Box flexShrink={4}>
                                <TextField
                                    className="ItemModal__text-field"
                                    id="item-quantity"
                                    label="Quantity"
                                    disabled={!editMode}
                                    name="quantity"
                                    onChange={updateField}
                                    placeholder="0"
                                    defaultValue={unit?.quantity} />
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
                                <Button onClick={() => props.onClose(false)} color="primary">
                                    Close
                                </Button>
                                <Button onClick={onSaveChanges} color="primary">
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
