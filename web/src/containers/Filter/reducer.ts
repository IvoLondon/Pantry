export interface stateInterface {
    isVisible?: boolean,
    filterHasValues?: boolean,
    name?: string,
    macros?: string
}

export enum actionTypeHandler {
    CLEAR_FILTER,
    SHOW_FILTER,
    HANDLE_SEARCH,
    HANDLE_SORTING,
    PRELOAD_DATA
};

export interface actionInterface {
    type: actionTypeHandler
    payload?: stateInterface
}

export const reducer = (state, action) => {
    if (action.type === actionTypeHandler.CLEAR_FILTER) {
        return {
            ...state,
            filterHasValues: false,
            name: '',
            macros: ''
        }
    }

    if (action.type === actionTypeHandler.SHOW_FILTER) {
        return {
            ...state,
            isVisible: action.payload.isVisible
        }
    }

    if (action.type === actionTypeHandler.HANDLE_SORTING) {
        return {
            ...state,
            filterHasValues: action.payload.filterHasValues,
            macros: action.payload.macros
        }
    }

    if (action.type === actionTypeHandler.HANDLE_SEARCH) {
        return {
            ...state,
            filterHasValues: action.payload.filterHasValues,
            name: action.payload.name,
        }
    }

    if (action.type === actionTypeHandler.PRELOAD_DATA) {
        return {
            ...state,
            isVisible: true,
            filterHasValues: true,
            ...action.payload,
        }
    }
    return state;
}