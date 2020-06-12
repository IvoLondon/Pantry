import React, { createContext, useEffect, useState } from 'react';
import { requestItems } from './../crud';
import Login from './Login/Login';
import { requestCheckAuth } from './../crud';

export const Context = createContext();

const ItemsContext = (props) => {
    const [items, getItems] = useState([]);
    const [login, setLogin] = useState(true);

    const authenticate = () => {
        setLogin(true);
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
       
        try {
            const response = await requestItems();
            if (response.status === 200) {
                getItems(response.data);
            } else if(response.status === 401) {
                setLogin(false);
            } else {
                throw new Error('Fetch data failed');
            }
        } catch (e) {
            console.log(e);
        };
    };
    let contextChildren;
    if (login) {
        contextChildren = props.children
    } else {
        contextChildren = <Login authenticate={authenticate} />
    }

    return (
        <Context.Provider value={{ items, getItems }}>
            { contextChildren }
        </Context.Provider>
    );
};

export default ItemsContext;
