import React, { useState, lazy, Suspense } from 'react';
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
import HeaderControls from './../../components/HeaderControls/HeaderControls';
import ItemModal from './../../components/ItemModal/ItemModal';
import ResultModal from './../../components/ResultModal/ResultModal';

const Scanner = lazy(() => import('../../components/Scanner/Scanner'));

const Header = () => {
    const [item, getItem] = useState({});
    const [scannerState, showScanner] = useState(false);
    const [newItemModal, showNewItemModal] = useState(false);
    const [resultModal, showResultModal] = useState(false);
    const [updateItemModal, showUpdateItemModal] = useState(false);
    const [itemId, getItemId] = useState(0);

    const checkForItem = async (scannedItem) => {
        getItemId(+scannedItem);
        const fetchedItem = await requestSingleItem(+scannedItem);
        if (fetchedItem.data) {
            getItem(fetchedItem.data);
            toggleUpdateModal();
        } else {
            toggleResultModal();
        }
        toggleScanner();
    };

    const onScanAgain = () => {
        toggleResultModal();
        toggleScanner();
    };

    const toggleScanner = () => {
        showScanner(!scannerState);
    };

    const toggleNewItemModal = () => {
        showNewItemModal(!newItemModal);
    };

    const toggleResultModal = () => {
        showResultModal(!resultModal);
    };

    const toggleUpdateModal = () => {
        showUpdateItemModal(!updateItemModal);
    };

    const onCreateNew = () => {
        toggleResultModal();
        toggleNewItemModal();
    };

    const createNewItem = async (newItem) => {
        await requestCreateItem(newItem);
        toggleNewItemModal();
    };

    const updateItem = async (newItem) => {
        await requestUpdateItem(newItem._id, newItem);
        toggleUpdateModal();
    };

    return (
        <React.Fragment>
            <Box className="Header">
                <Container maxWidth="md" >
                    <Grid container direction="row" justify="center" alignItems="center">
                        <h1>Scan your can</h1>
                        <HeaderControls toggleScanner={toggleScanner} />
                        <Suspense fallback={<h6>Loading...</h6>}>
                            {scannerState
                                ? <Scanner
                                    showScanner={scannerState}
                                    toggleScanner={toggleScanner}
                                    onDetect={checkForItem} />
                                : null }
                        </Suspense>
                        { newItemModal
                            ? <ItemModal
                                open={newItemModal}
                                itemId={itemId}
                                onClose={toggleNewItemModal}
                                onSaveChanges={createNewItem} />
                            : null }
                        { updateItemModal
                            ? <ItemModal
                                open={updateItemModal}
                                selectedItem={item}
                                onClose={toggleUpdateModal}
                                onSaveChanges={updateItem} />
                            : null }
                        { resultModal
                            ? <ResultModal
                                open={resultModal}
                                itemId={itemId}
                                onScanAgain={onScanAgain}
                                onClose={toggleResultModal}
                                onCreateNew={onCreateNew} />
                            : null }
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default Header;
