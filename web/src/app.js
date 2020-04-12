import React, { Component } from 'react';
import Header from './containers/Header/Header';
import ItemList from './containers/ItemList/ItemList';
import './styles/main.scss';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <ItemList />
            </div>
        );
    }
}

export default App;
