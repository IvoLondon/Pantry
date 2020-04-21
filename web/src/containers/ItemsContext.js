import React, { createContext, useEffect, useState } from 'react';
import { requestGetItems } from './../crud';

export const Context = createContext();

const ItemsContext = (props) => {
    const [items, getItems] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await requestGetItems();
            getItems(response.data);
        } catch (e) {
            console.log(e);
        };
    };

    return (
        <Context.Provider value={{ items, getItems }}>
            { props.children }
        </Context.Provider>
    );
};

export default ItemsContext;
