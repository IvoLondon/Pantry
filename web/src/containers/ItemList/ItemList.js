import React, { useState, useContext, useCallback } from 'react';
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
        // TODO: Use a proper throttling function
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
                        <Button onClick={() => updateItem(item, 'incr')}>+</Button>
                        <Button>{item.quantity}</Button>
                        <Button onClick={() => updateItem(item, 'decr')}>-</Button>
                    </ButtonGroup>
                </ListItem>
                <Divider className={classes.root} />
            </React.Fragment>
        );
    });
    console.log('renders');
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
