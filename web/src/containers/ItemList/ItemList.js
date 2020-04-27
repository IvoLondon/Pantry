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
    const [selectedItem, setSelectedItem] = useState(null),
        [filterMode, setFilter] = useState({}),
        [modal, setModalState] = useState(false);

    const toggleModal = (item) => {
        if (!item) {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
        setModalState(!modal);
    };

    const updateItem = (item, action) => {
        const newList = items.filter(x => x._id !== item._id);
        const newItem = { ...item };
        const idx = items.findIndex(x => x._id === item._id);

        if (action === 'decr') {
            newItem.quantity--;
        } else if (action === 'incr') {
            newItem.quantity++;
        }
        newList.splice(idx, 0, newItem);
        // TODO: fix to use debounce
        getItems(newList);
        debounce(async () => {
            try {
                await requestUpdateItem(item._id, { quantity: newItem.quantity });
            } catch (e) {
                console.log(e);
            }
        }, 1000, false)();
    };

    const updateItemNutrition = async (item) => {
        try {
            updateItem(item);
            await requestUpdateItem(item._id, item);
        } catch (e) {
            return new Error(e);
        }
    };

    const classes = useStyles();
    const itemsRender = () => {
        let itemsList = [...items];
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
        return itemsList.map(item => {
            return (
                <React.Fragment key={item.barcode}>
                    <ListItem button>
                        <ListItemIcon>
                            <Badge badgeContent={item.quantity} showZero color="secondary">
                                {/* TODO: UPDATE ICONS COLOUR */}
                                <StoreIcon color="primary" />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={item.name} onClick={() => toggleModal(item)} />
                        <ListItemText primary={item.macros.carb.total} />
                        <ListItemText primary={item.macros.fat.total} />
                        <ListItemText primary={item.macros.protein} />

                        <ButtonGroup variant="contained" color="default">
                            <Button onClick={() => updateItem(item, 'incr')}>+</Button>
                            <Button>{item.quantity}</Button>
                            <Button onClick={() => updateItem(item, 'decr')}>-</Button>
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
                        {itemsRender()}
                    </List>
                    <ItemModal
                        open={modal}
                        selectedItem={selectedItem}
                        onClose={toggleModal}
                        onSaveChanges={updateItemNutrition} />
                        <Filter filterMode={filterMode} setFilter={setFilter} />
                </Grid>
            </Container>
        </Box>
    );
};

export default ItemList;
