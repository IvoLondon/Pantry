export const SHOW_SCANNER = 'SHOW_SCANNER',
    HIDE_SCANNER = 'HIDE_SCANNER',
    ITEM_FOUND = 'ITEM_FOUND',
    SCAN_AGAIN = 'SCAN_AGAIN',
    CREATE_NEW = 'CREATE_NEW',
    SHOW_NEW_ITEM_MODAL = 'SHOW_NEW_ITEM_MODAL',
    SHOW_RESULT_MODAL = 'SHOW_RESULT_MODAL',
    SHOW_UPDATE_ITEM_MODAL = 'SHOW_UPDATE_ITEM_MODAL';

export const reducer = (state, action) => {
    if (action.type === SHOW_SCANNER) {
        return {
            ...state,
            showScanner: action.payload.show
        };
    };

    if (action.type === SHOW_RESULT_MODAL) {
        if(action.payload.show) {
            return {
                ...state,
                showScanner: false,
                showResultModal: true,
                barcodeId: action.payload.barcodeId,
                barcodeType: action.payload.barcodeType,
            };
        }
        return {
            ...state,
            showResultModal: false
        };
    };

    if (action.type === SHOW_UPDATE_ITEM_MODAL) {
        return {
            ...state,
            showUpdateItemModal: action.payload.show
        };
    };

    if (action.type === SHOW_NEW_ITEM_MODAL) {
        return {
            ...state,
            showNewItemModal: action.payload.show
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