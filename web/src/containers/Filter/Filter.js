import React, { useState, useEffect, useReducer } from 'react';
import {
    Grid,
    Container,
    IconButton,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    TextField
} from '@material-ui/core';
import {
    Close,
    Autorenew,
    KeyboardArrowDown
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useLocalStorage } from './../../utilities';
import './style.scss';

const useStyles = makeStyles((theme) => ({
    form: {
        root: {
            minWidth: '60%'
        }
    },
    textField: {
        root: {
            minWidth: '60%'
        }
    }
}));

const CLEAR_FILTER = 'CLER_FILTER',
    SHOW_FILTER = 'SHOW_FILTER',
    HANDLE_SEARCH = 'HANDLE_SEARCH',
    HANDLE_SORTING = 'HANDLE_SORTING',
    PRELOAD_DATA = 'PRELOAD_DATA';

const reducer = (state, action) => {
    if (action.type === CLEAR_FILTER) {
        return {
            ...state,
            filterHasValues: false,
            name: '',
            macros: ''
        }
    }

    if (action.type === SHOW_FILTER) {
        return {
            ...state,
            isVisible: action.payload.isVisible
        }
    }

    if (action.type === HANDLE_SORTING) {
        return {
            ...state,
            filterHasValues: action.payload.filterHasValues,
            macros: action.payload.macros
        }
    }

    if (action.type === HANDLE_SEARCH) {
        return {
            ...state,
            filterHasValues: action.payload.filterHasValues,
            name: action.payload.name,
        }
    }

    if (action.type === PRELOAD_DATA) {
        return {
            ...state,
            isVisible: true,
            filterHasValues: true,
            ...action.payload,
        }
    }
    return state;
}
const initialState = {
    isVisible: false,
    filterHasValues: false,
    name: '',
    macros: '',
}

const Filter = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [localStorageState, setlocalStorageState] = useLocalStorage('filter', {});

    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
        setlocalStorageState({});
        props.setFilter({});
    };

    useEffect(() => {
        if (Object.keys(localStorageState).length > 0) {
            dispatch({ type: PRELOAD_DATA, payload: { ...localStorageState } });
            props.setFilter({ ...props.filterMode, ...localStorageState });
        }
    }, [state.isVisible]);

    const openFilter = () => {
        dispatch({ type: SHOW_FILTER, payload: { isVisible: true }})
    };

    const closeFilter = () => {
        dispatch({ type: SHOW_FILTER, payload: { isVisible: false }})
    };

    const handleInput = (e) => {
        
        if (e.target.value.length > 2) {
            props.setFilter({ ...props.filterMode, name: e.target.value });
        } else {
            props.setFilter({ ...props.filterMode, name: '' });
        }

        dispatch({
            type: HANDLE_SEARCH,
            payload: {
                filterHasValues: true,
                name: e.target.value,
            }
        });
        
        setlocalStorageState({
            ...props.filterMode,
            name: e.target.value
        });
    };

    const handleSorting = (e) => {
        if (props.setFilter) {
            props.setFilter({ ...props.filterMode, macros: e.target.value });
        }

        dispatch({
            type: HANDLE_SORTING,
            payload: {
                filterHasValues: true,
                macros: e.target.value,
            }
        });

        setlocalStorageState({
            ...props.filterMode,
            macros: e.target.value
        });
    };

    const css = useStyles();
    return (
        <section className="filter-section">
            <Container maxWidth="md">
                <Grid container direction="column">
                    <Grid className={`filter ${state.isVisible ? 'filter--open' : ''}`} container direction="row" justify="space-evenly" alignItems="center">
                        <Grid item xs={4}>
                            <TextField
                                className="filter__search-input"
                                id="search-name"
                                onChange={handleInput}
                                value={state.name}
                                label="Search by name" />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth className="filter__sort-select" classes={{ root: css.form.root }}>
                                <InputLabel id="sort-label">Sort</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    id="sort-select"
                                    value={state.macros}
                                    classes={{ root: css.textField.root }}
                                    onChange={handleSorting}
                                >
                                    <MenuItem value='protein'>Protein</MenuItem>
                                    <MenuItem value='carb'>Carbs</MenuItem>
                                    <MenuItem value='fat'>Fat</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container justify="flex-end">
                                { state.filterHasValues
                                    ? (<IconButton onClick={clearFilter} >
                                        <Autorenew color="secondary" />
                                    </IconButton>)
                                    : (<IconButton onClick={closeFilter}>
                                        <Close color="secondary" />
                                    </IconButton>)
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    { !state.isVisible
                        ? (<IconButton onClick={openFilter}>
                            <KeyboardArrowDown color="primary" />
                        </IconButton>)
                        : null
                    }
                </Grid>
            </Container>
        </section>
    );
};

export default Filter;
