import React, { Component } from 'react';
import Header from './containers/Header/Header';
import './styles/main.scss';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
            </div>
        );
    }
}

export default App;
