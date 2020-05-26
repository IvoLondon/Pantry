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
    }

    useEffect(() => {
        requestCheckAuth().then(data => {
            if (data?.status !== 200) {
                setLogin(false);
            } else {
                fetchData();
            }
        });
    }, []);

    const fetchData = async () => {
        try {
            const response = await requestItems();
            getItems(response.data);
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
