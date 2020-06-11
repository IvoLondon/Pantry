import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Container,
    Grid,
    Button,
    ButtonGroup,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Badge,
    Divider
} from '@material-ui/core';
import StoreIcon from '@material-ui/icons/Store';
import { debounce } from '../../utilities';
import { requestUpdateItem } from './../../crud';
import { Context } from './../ItemsContext';
import ItemModal from './../../components/ItemModal/ItemModal';
import Filter from './../Filter/Filter';

import './styles.scss';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)'
    }
}));

const ItemList = () => {
    const { items, getItems } = useContext(Context);
    const [selectedUnit, setSelectedUnit] = useState(null),
        [filterMode, setFilter] = useState({}),
        [modal, setModalState] = useState(false);

    const toggleModal = (unit) => {
        if (!unit) {
            setSelectedUnit(null);
        } else {
            setSelectedUnit(unit);
        }
        setModalState(!modal);
    };

    const updateItem = async (unit, action) => {
        const newList = items.filter(x => x.item._id !== unit.item._id);
        const newUnit = { ...unit };
        const idx = items.findIndex(x => x.item._id === unit.item._id);

        if (action === 'decr') {
            newUnit.quantity--;
        } else if (action === 'incr') {
            newUnit.quantity++;
        }
        newList.splice(idx, 0, newUnit);
        // TODO: fix to use debounce
        getItems(newList);
        try {
            await requestUpdateItem(newUnit.item._id, newUnit);
        } catch (e) {
            console.log(e);
        }
        // debounce(async () => {
        //     try {
        //         await requestUpdateItem(newUnit.item._id, newUnit);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }, 1000, false)();
    };

    const classes = useStyles();
    const itemsRender = (itemsList) => {
        if (Object.keys(filterMode).length) {
            if (filterMode.hasOwnProperty('name') && filterMode.name.length > 2) {
                const val = filterMode.name;
                itemsList = itemsList.filter(el => {
                    return el.name.toLowerCase().includes(val.toLowerCase());
                });
            }

            if (filterMode.hasOwnProperty('macros')) {
                const val = filterMode.macros;
                itemsList.sort((elOne, elTwo) => {
                    if (val === 'protein') {
                        return elTwo.macros[val] - elOne.macros[val];
                    } else {
                        return elTwo.macros[val]?.total - elOne.macros[val]?.total;
                    }
                });
            }
        }
        return itemsList.map(unit => {
            if (!unit.item) return
            return (
                <React.Fragment key={unit.item.barcodeId}>
                    <ListItem button>
                        <ListItemIcon>
                            <Badge badgeContent={unit.quantity} showZero color="secondary">
                                {/* TODO: UPDATE ICONS COLOUR */}
                                <StoreIcon color="primary" />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={unit.item.name} onClick={() => toggleModal(unit)} />

                        <ButtonGroup variant="contained" color="default">
                            <Button onClick={() => updateItem(unit, 'incr')}>+</Button>
                            <Button>{unit.quantity}</Button>
                            <Button onClick={() => updateItem(unit, 'decr')}>-</Button>
                        </ButtonGroup>
                    </ListItem>
                    <Divider className={classes.root} />
                </React.Fragment>
            );
        });
    };

    return (
        <Box>
            <Container maxWidth="md">
                <Grid container direction="row" justify="center" alignItems="center">
                    <List component="nav" className="ItemList" aria-label="main mailbox folders">
                        {itemsRender(items)}
                    </List>
                    <ItemModal
                        open={modal}
                        selectedItem={selectedUnit}
                        onClose={toggleModal}
                        onSaveChanges={updateItem} />
                    <Filter filterMode={filterMode} setFilter={setFilter} />
                </Grid>
            </Container>
        </Box>
    );
};

export default ItemList;
