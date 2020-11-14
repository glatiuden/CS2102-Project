import React from 'react';

import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField
} from '@material-ui/core';

import { useStyles } from './AdminStyle';

export default function DialogPartTimer(props: any) {
    const adminStyle = useStyles();
    const { dialogType, closeDialog, onDeleteSubmit, selectedPartTimerInfo } = props;

    const submitDialog = () => {
        onDeleteSubmit(selectedPartTimerInfo);
    }

    return (
        <Box>
            <Dialog open={dialogType === "Delete"} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete Confirmation</DialogTitle>
                <DialogContent dividers>
                    Are you sure you want to delete this Part-Time Caretaker named "{selectedPartTimerInfo ? selectedPartTimerInfo.name : null}"?
                    If he/she have any accepted/confirmed jobs, it will be auto-reassigned to the next suitable full-time caretaker.
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
