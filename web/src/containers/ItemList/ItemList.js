import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Container,
    Grid,
    Dialog,
    Button,
    ButtonGroup
} from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import StoreIcon from '@material-ui/icons/Store';

import UpdateItemModal from './../../components/UpdateItemModal/UpdateItemModal';
import './styles.scss';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)'
    }
}));

const ItemList = () => {
    const [items, getItems] = useState([]),
    [selectedItem, setSelectedItem] = useState(false),
    [modal, setModalState] = useState(false);
    let actionTimer;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item`)
            .then(response => response.json())
            .then(response => {
                getItems(response.data);
            }, error => {
                console.log(error);
            });
    }, []);

    const toggleModal = (barcode) => {
        if (!barcode) barcode = 0;
        setSelectedItem(barcode);
        setModalState(!modal);
    };

    const updateItemQuantity = (item, action) => {
        const currentList = [...items];
        const newList = currentList.filter(x => x._id !== item._id);
        const newItem = currentList.find(x => x._id === item._id);
        const newItemIndex = currentList.findIndex(x => x._id === item._id);

        if (action === 'decr') {
            newItem.quantity--;
        } else if (action === 'incr') {
            newItem.quantity++;
        }
        newList.splice(newItemIndex, 0, newItem);
        getItems([
            ...newList
        ]);

        clearTimeout(actionTimer);
        actionTimer = setTimeout(() => {
            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "quantity": newItem.quantity })
            };
            fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${item._id}`, options)
                .then(response => console.log(response.status));
        }, 2000);
    };

    const classes = useStyles();
    const itemsList = items.map(item => {
        return (
            <React.Fragment key={item.barcode}>
                <ListItem button>
                    <ListItemIcon>
                        <Badge badgeContent={item.quantity} showZero color="secondary">
                            <StoreIcon style={{ color: 'white' }} />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText primary={item.name} onClick={() => toggleModal(item.barcode)} />

                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        <Button onClick={() => updateItemQuantity(item, 'incr')}>+</Button>
                        <Button>{item.quantity}</Button>
                        <Button onClick={() => updateItemQuantity(item, 'decr')}>-</Button>
                    </ButtonGroup>
                </ListItem>
                <Divider className={classes.root} />
            </React.Fragment>
        );
    });

    return (
        <Box>
            <Container maxWidth="md" >
                <Grid container direction="row" justify="center" alignItems="center">
                    <List component="nav" className="ItemList" aria-label="main mailbox folders">
                        {itemsList}
                    </List>
                    <Dialog open={modal} onClose={toggleModal}>
                        <UpdateItemModal onClose={toggleModal} barcode={selectedItem} />
                    </Dialog>
                </Grid>
            </Container>
        </Box>
    );
};

export default ItemList;
