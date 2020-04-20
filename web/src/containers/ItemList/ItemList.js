import React, { useState, useEffect } from 'react';
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
import { requestGetItems, requestUpdateItem } from './../../crud';
import ItemModal from './../../components/ItemModal/ItemModal';
import './styles.scss';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)'
    }
}));

const ItemList = () => {
    const [items, getItems] = useState([]),
        [selectedItem, setSelectedItem] = useState(null),
        [modal, setModalState] = useState(false);
    let actionTimer;

    useEffect(() => {
        fetchItemsList();
    }, []);

    const fetchItemsList = () => {
        requestGetItems()
            .then(response => {
                getItems(response.data);
            }, error => {
                console.log(error);
            });
    };

    const toggleModal = (item) => {
        if (!item) {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
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

        // TODO: Use a proper throttling function
        clearTimeout(actionTimer);
        actionTimer = setTimeout(() => {
            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newItem.quantity })
            };
            fetch(`${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_SERVER_PORT}/api/item/${item._id}`, options)
                .then(response => console.log(response.status));
        }, 2000);
    };

    const updateItemNutrition = async (item) => {
        try {
            await requestUpdateItem(item._id, item);
            fetchItemsList();
        } catch (e) {
            return new Error(e);
        }
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
                    <ListItemText primary={item.name} onClick={() => toggleModal(item)} />

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
                    <ItemModal
                        open={modal}
                        selectedItem={selectedItem}
                        onClose={toggleModal}
                        onSaveChanges={updateItemNutrition} />
                </Grid>
            </Container>
        </Box>
    );
};

export default ItemList;
