import React, { Component, lazy, Suspense } from 'react';
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

const Scanner = lazy(() => import('../../components/Scanner/Scanner'));

class Header extends Component {
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
            <React.Fragment>
                <Box className="Header">
                    <Container maxWidth="md" >
                        <Grid container direction="row" justify="center" alignItems="center">
                            <h1>Scan your can</h1>
                            <Suspense fallback={<h6>Loading...</h6>}>
                                {this.state.showScanner ?
                                    <Scanner showScanner={this.state.showScanner} toggleScanner={this.toggleScanner} />
                                    : null }
                            </Suspense>
                            <Input autoFocus={false} /><IconButton size="medium" color="primary" onClick={this.toggleScanner}><AddAPhotoIcon /></IconButton>
                        </Grid>
                    </Container>
                </Box>
            </React.Fragment>
        );
    }
}

export default Header;
