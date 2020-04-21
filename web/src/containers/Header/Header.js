import React, { lazy, Suspense, useReducer, useContext } from 'react';
import {
    Box,
    Container,
    Grid
} from '@material-ui/core';
import './styles.scss';
import {
    requestSingleItem,
    requestCreateItem,
    requestUpdateItem
} from './../../crud';
import { Context } from './../ItemsContext';
import HeaderControls from './../../components/HeaderControls/HeaderControls';
import ItemModal from './../../components/ItemModal/ItemModal';
import ResultModal from './../../components/ResultModal/ResultModal';

const Scanner = lazy(() => import('../../components/Scanner/Scanner'));

const SHOW_SCANNER = 'SHOW_SCANNER',
    HIDE_SCANNER = 'HIDE_SCANNER',
    ITEM_FOUND = 'ITEM_FOUND',
    SCAN_AGAIN = 'SCAN_AGAIN',
    CREATE_NEW = 'CREATE_NEW',
    SHOW_NEW_ITEM_MODAL = 'SHOW_NEW_ITEM_MODAL',
    HIDE_NEW_ITEM_MODAL = 'HIDE_NEW_ITEM_MODAL',
    SHOW_RESULT_MODAL = 'SHOW_RESULT_MODAL',
    HIDE_RESULT_MODAL = 'HIDE_RESULT_MODAL',
    SHOW_UPDATE_ITEM_MODAL = 'SHOW_UPDATE_ITEM_MODAL',
    HIDE_UPDATE_ITEM_MODAL = 'HIDE_UPDATE_ITEM_MODAL';

const reducer = (state, action) => {
    if (action.type === SHOW_SCANNER) {
        return {
            ...state,
            showScanner: true
        };
    };

    if (action.type === HIDE_SCANNER) {
        return {
            ...state,
            showScanner: false
        };
    };

    if (action.type === SHOW_RESULT_MODAL) {
        return {
            ...state,
            showScanner: false,
            showResultModal: true,
            itemId: action.payload.itemId
        };
    };

    if (action.type === HIDE_RESULT_MODAL) {
        return {
            ...state,
            showResultModal: false
        };
    };

    if (action.type === SHOW_UPDATE_ITEM_MODAL) {
        return {
            ...state,
            showUpdateItemModal: true
        };
    };

    if (action.type === HIDE_UPDATE_ITEM_MODAL) {
        return {
            ...state,
            showUpdateItemModal: false
        };
    };

    if (action.type === SHOW_NEW_ITEM_MODAL) {
        return {
            ...state,
            showNewItemModal: true
        };
    };

    if (action.type === HIDE_NEW_ITEM_MODAL) {
        return {
            ...state,
            showNewItemModal: false
        };
    };

    if (action.type === ITEM_FOUND) {
        return {
            ...state,
            item: action.payload.data,
            showUpdateItemModal: true,
            showScanner: false
        };
    };

    if (action.type === SCAN_AGAIN) {
        return {
            ...state,
            showScanner: true,
            showResultModal: false
        };
    };

    if (action.type === CREATE_NEW) {
        return {
            ...state,
            showNewItemModal: true,
            showResultModal: false
        };
    };

    return state;
};

const initialState = {
    item: {},
    itemId: 0,
    showScanner: false,
    showNewItemModal: false,
    showResultModal: false,
    showUpdateItemModal: false
};

const Header = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { items, getItems } = useContext(Context);

    const checkForItem = async (scannedItem) => {
        const fetchedItem = await requestSingleItem(+scannedItem);
        if (fetchedItem.data) {
            dispatch({ type: ITEM_FOUND, payload: { data: fetchedItem.data } });
        } else {
            dispatch({ type: SHOW_RESULT_MODAL, payload: { itemId: +scannedItem } });
        }
    };

    const createNewItem = async (newItem) => {
        try {
            await requestCreateItem(newItem);
            getItems([
                newItem,
                ...items
            ]);
            dispatch({ type: HIDE_NEW_ITEM_MODAL });
        } catch (e) {
            return new Error(e);
        }
    };

    const updateItem = async (newItem) => {
        try {
            await requestUpdateItem(newItem._id, newItem);
            getItems(items.map(i => {
                if (i._id === newItem._id) {
                    return newItem;
                }
                return i;
            }));
            dispatch({ type: HIDE_UPDATE_ITEM_MODAL });
        } catch (e) {
            return new Error(e);
        }
    };

    return (
        <React.Fragment>
            <Box className="Header">
                <Container maxWidth="md" >
                    <Grid container direction="row" justify="center" alignItems="center">
                        <HeaderControls showScanner={() => dispatch({ type: SHOW_SCANNER })} />
                        <Suspense fallback={<h6>Loading...</h6>}>
                            {state.showScanner
                                ? <Scanner
                                    showScanner={state.showScanner}
                                    hideScanner={() => dispatch({ type: HIDE_SCANNER })}
                                    onDetect={checkForItem} />
                                : null }
                        </Suspense>
                        { state.showNewItemModal
                            ? <ItemModal
                                open={state.showNewItemModal}
                                itemId={state.itemId}
                                onClose={() => dispatch({ type: HIDE_NEW_ITEM_MODAL })}
                                onSaveChanges={createNewItem} />
                            : null }
                        { state.showUpdateItemModal
                            ? <ItemModal
                                open={state.showUpdateItemModal}
                                selectedItem={state.item}
                                onClose={() => dispatch({ type: HIDE_UPDATE_ITEM_MODAL })}
                                onSaveChanges={updateItem} />
                            : null }
                        { state.showResultModal
                            ? <ResultModal
                                open={state.showResultModal}
                                itemId={state.itemId}
                                onScanAgain={() => dispatch({ type: SCAN_AGAIN })}
                                onClose={() => dispatch({ type: HIDE_RESULT_MODAL })}
                                onCreateNew={() => dispatch({ type: CREATE_NEW })} />
                            : null }
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default Header;
