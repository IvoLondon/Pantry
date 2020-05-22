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
    KeyboardArrowUp
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useLocalStorage } from './../../utilities';
import {
    stateInterface,
    actionInterface,
    actionTypeHandler,
    reducer
} from './reducer';
import './style.scss';

const useStyles = makeStyles((theme) => ({
    form: {
        root: {
            minWidth: '200px'
        }
    },
    textField: {
        root: {
            minWidth: '200px'
        }
    }
}));

const initialState: stateInterface = {
    isVisible: false,
    filterHasValues: false,
    name: '',
    macros: '',
}

interface filterInterface {
    setFilter: ({}) => void,
    filterMode: {
        name?: string,
        macros?: string,
    }
}

const Filter: React.FC<filterInterface> = (props) => {
    const [state, dispatch] = useReducer<React.Reducer<stateInterface, actionInterface>>(reducer, initialState);
    const [localStorageState, setlocalStorageState] = useLocalStorage('filter', {});

    const clearFilter = () => {
        dispatch({ type: actionTypeHandler.CLEAR_FILTER });
        setlocalStorageState({});
        props.setFilter({});
    };

    useEffect(() => {
        if (Object.keys(localStorageState).length > 0) {
            dispatch({ type: actionTypeHandler.PRELOAD_DATA, payload: { ...localStorageState } });
            props.setFilter({ ...props.filterMode, ...localStorageState });
        }
    }, [state.isVisible]);

    const openFilter = () => {
        dispatch({ type: actionTypeHandler.SHOW_FILTER, payload: { isVisible: true }})
    };

    const closeFilter = () => {
        dispatch({ type: actionTypeHandler.SHOW_FILTER, payload: { isVisible: false }})
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {    
        if (e.target.value.length > 2) {
            props.setFilter({ ...props.filterMode, name: e.target.value });
        } else {
            props.setFilter({ ...props.filterMode, name: '' });
        }

        dispatch({
            type: actionTypeHandler.HANDLE_SEARCH,
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
            type: actionTypeHandler.HANDLE_SORTING,
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
                            <FormControl className="filter__sort-select" classes={{ root: css.form.root }}>
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
                        ? (<Grid justify="center" container item><IconButton onClick={openFilter}>
                            <KeyboardArrowUp color="primary" />
                        </IconButton></Grid>)
                        : null
                    }
                </Grid>
            </Container>
        </section>
    );
};

export default Filter;
