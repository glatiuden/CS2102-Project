import React, { useContext, useEffect, useState } from 'react';

import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField
} from '@material-ui/core';

import { hasEmptyFields, notifyFailure, notifySuccess, validateEmail } from './AdminHelper';
import { useStyles } from './AdminStyle';

export default function DialogAdmin(props: any) {
    const adminStyle = useStyles();
    const { dialogType, closeDialog, onAddSubmit, onUpdateSubmit, onDeleteSubmit, selectedAdminInfo } = props;
    const [adminInfo, setAdminInfo] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [pwNotMatch, setPwNotMatch] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const onChange = (key: string) => (e: any) => {
        const _adminInfo = { ...adminInfo } as any;
        _adminInfo[key] = e.target.value;
        setAdminInfo(_adminInfo);

        if (key == 'email') {
            if (validateEmail(e.target.value)) {
                setEmailError(false);
            } else {
                setEmailError(true);
            }
        } else if (key == 'password') {
            if (e.target.value === adminInfo.confirmPassword) {
                setPwNotMatch(false);
            } else {
                setPwNotMatch(true);
            }
        } else if (key == 'confirmPassword') {
            if (e.target.value === adminInfo.password) {
                setPwNotMatch(false);
            } else {
                setPwNotMatch(true);
            }
        }
    };

    const submitDialog = () => {
        switch (dialogType) {
            case "Add":
                if (hasEmptyFields(adminInfo)) {
                    notifyFailure("Please fill in the blanks!");
                } else if (emailError) {
                    notifyFailure("Please enter a vaid email address!");
                } else if (pwNotMatch) {
                    notifyFailure("Password do not match! Please try again!");
                } else {
                    onAddSubmit(adminInfo);
                }
                break;
            case "Update":
                break;
            case "Delete":
                onDeleteSubmit(selectedAdminInfo);
                break;
        }
    }

    const clearAndCloseDialog = () => {
        setAdminInfo({
            email: '',
            name: '',
            password: '',
            confirmPassword: ''
        });
        closeDialog();
    }

    return (
        <Box>
            <Dialog open={dialogType == "Add"} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Admin</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        onChange={onChange("name")}
                        value={adminInfo.name}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="email"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoFocus
                        onChange={onChange("email")}
                        value={adminInfo.email}
                        error={emailError}
                        helperText={emailError ? "Incorrect email format" : null}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="password"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={onChange("password")}
                        value={adminInfo.password}
                        error={pwNotMatch}
                        helperText={pwNotMatch ? "Passwords do not match." : null}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="password"
                        required
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={onChange("confirmPassword")}
                        value={adminInfo.confirmPassword || {}}
                        error={pwNotMatch}
                        helperText={pwNotMatch ? "Passwords do not match." : null}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={clearAndCloseDialog} color="secondary">
                        Cancel</Button>
                    <Button variant="outlined" onClick={submitDialog} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogType == "Delete"}>
                <DialogTitle id="form-dialog-title">Delete Confirmation</DialogTitle>
                <DialogContent dividers>
                    Are you sure you want to delete this admin named "{selectedAdminInfo ? selectedAdminInfo.name : null}"" ?
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={clearAndCloseDialog} color="secondary">
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
