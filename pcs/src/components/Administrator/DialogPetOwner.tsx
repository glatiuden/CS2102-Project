import React, { useContext, useEffect, useState } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Box
} from '@material-ui/core';
import {useStyles} from './AdminStyle';

export default function DialogPetOwner(props: any) {
    const adminStyle = useStyles();
    const { dialogType, closeDialog, onDeleteSubmit, selectedOwnerInfo } = props;

    const submitDialog = () => {
        onDeleteSubmit(selectedOwnerInfo);
    }

    return (
        <Box>
            <Dialog open={dialogType == "Delete"} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete Confirmation</DialogTitle>
                <DialogContent dividers>
                    Are you sure you want to delete this Pet Owner named "{selectedOwnerInfo ? selectedOwnerInfo.name : null}"" ?
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={closeDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button className={adminStyle.deleteIcon} variant="outlined" onClick={submitDialog}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
