import React, { Component } from 'react';
import Scanner from '../../components/Scanner/Scanner';
import {
    Box,
    Container,
    Grid,
    Input,
    Button,
    IconButton
} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import './styles.scss';


class Header extends Component {
    state = {
        showScanner: true
    }

    toggleScanner = () => {
        this.setState({
            showScanner: !this.state.showScanner
        });
    }

    render() {
        return (
            <React.Fragment>
                <Box className="Header">
                    <Container maxWidth="md" >
                        <Grid container direction="row" justify="center" alignItems="center">
                            <h1>Scan your can</h1>
                            <Scanner showScanner={this.state.showScanner} toggleScanner={this.toggleScanner} />
                            <Input autoFocus={false} /><IconButton size="medium" color="primary" onClick={this.toggleScanner}><AddAPhotoIcon /></IconButton>
                        </Grid>
                    </Container>
                </Box>
            </React.Fragment>
        );
    }
}

export default Header;
