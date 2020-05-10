import React, { useState, useEffect } from 'react';
import Header from './containers/Header/Header';
import ItemList from './containers/ItemList/ItemList';
import ItemsContext from './containers/ItemsContext';

import './styles/main.scss';

const App = () => {
    return (
        <div className="App">
            <ItemsContext>
                <Header />
                <ItemList />
            </ItemsContext>
        </div>
    );
}

export default App;
