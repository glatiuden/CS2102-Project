import React, { useEffect, useState } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@material-ui/core';

import { AppContext } from '../../contexts/AppContext';

export default function DialogLeave(props: any) {
    const { user } = React.useContext(AppContext);

    const { isOpen, onClose, onSubmit, onUpdateSubmit, leaveInfo, isEdit } = props;
    const [leave, setLeave] = useState({
        ct_email: user!.email,
        date: ""
    });

    useEffect(() => {
        if (isEdit) {
            setLeave(leaveInfo);
        }
    }, [leaveInfo]);

    const closeDialog = () => {
        setLeave({ ...leave, date: "" });
        onClose();
    }

    const submitDialog = () => {
        if (isEdit)
            onUpdateSubmit({
                ct_email: user!.email,
                old_date: leaveInfo.date,
                new_date: leave.date
            });
        else
            onSubmit(leave);
    }

    const onChange = (key: string) => (e: any) => {
        const _date = { ...leave } as any;
        _date[key] = e.target.value;
        setLeave(_date);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth={true}>
            <DialogTitle id="form-dialog-title">{isEdit ? "Edit " : "Add New "}Leave</DialogTitle>
            <DialogContent>
                <TextField
                    required
                    fullWidth
                    id="date"
                    label="Date"
                    name="Date"
                    autoFocus
                    type="date"
                    onChange={onChange("date")}
                    value={leave.date}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="secondary">
                    Cancel</Button>
                <Button onClick={submitDialog} color="primary">
                    {isEdit ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
