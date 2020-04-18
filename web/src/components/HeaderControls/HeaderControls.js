import React from 'react';

import {
    Input,
    IconButton
} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';


const HeaderControls = (props) => {
    return (
        <>
            <Input autoFocus={false} />
            <IconButton size="medium" color="primary" onClick={props.toggleScanner}>
                <AddAPhotoIcon />
            </IconButton>
        </>
    );
};

export default HeaderControls;