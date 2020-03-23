import React, { Component } from 'react';
import Scanner from './Components/Scanner/Scanner';
import Button from '@material-ui/core/Button';

class App extends Component {
    state = {
        showScanner: false
    }

    toggleScanner = () => {
        this.setState({
            showScanner: !this.state.showScanner
        });
    }

    render() {
        return (
            <div className="App">
                { this.state.showScanner ? <Scanner toggleScanner={this.toggleScanner} />
                    : <Button varian="contained" color="primary" onClick={this.toggleScanner}>Show camera</Button> }
            </div>
        );
    }
}

export default App;
