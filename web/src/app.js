import React, { Component } from 'react';
import Header from './containers/Header/Header';
import ItemList from './containers/ItemList/ItemList';
import ItemsContext from './containers/ItemsContext';

import './styles/main.scss';

class App extends Component {
    render() {
        return (
            <div className="App">
                <ItemsContext>
                    <Header />
                    <ItemList />
                </ItemsContext>
            </div>
        );
    }
}

export default App;
