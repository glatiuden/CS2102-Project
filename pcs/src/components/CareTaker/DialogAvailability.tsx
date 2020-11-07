import React, { useEffect, useState } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@material-ui/core';

import { AppContext } from '../../contexts/AppContext';

export default function DialogAvailability(props: any) {
    const { user } = React.useContext(AppContext);

    const { isOpen, onClose, onSubmit, onUpdateSubmit, availInfo, isEdit } = props;
    const [avail, setAvail] = useState({
        email: user!.email,
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        if (isEdit) {
            setAvail(availInfo);
        }
    }, [availInfo]);

    const closeDialog = () => {
        setAvail({ ...avail, start_date: '', end_date: '' });
        onClose();
    }

    const submitDialog = () => {
        if (isEdit)
            onUpdateSubmit({
                ct_email: user!.email,
                old_startdate: availInfo.start_date,
                old_enddate: availInfo.end_date,
                new_startdate: avail.start_date,
                new_enddate: avail.end_date
            });
        else
            onSubmit(avail);
    }

    const onChange = (key: string) => (e: any) => {
        const _avail = { ...avail } as any;
        _avail[key] = e.target.value;
        setAvail(_avail);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth={true}>
            <DialogTitle id="form-dialog-title">{isEdit ? "Edit " : "Add New "}Availability</DialogTitle>
            <DialogContent>
                <TextField
                    required
                    fullWidth
                    id="date"
                    label="Start Date"
                    name="Start Date"
                    autoFocus
                    type="date"
                    onChange={onChange("start_date")}
                    value={avail.start_date}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <br />
                <TextField
                    required
                    fullWidth
                    id="date"
                    label="End Date"
                    name="End Date"
                    autoFocus
                    type="date"
                    onChange={onChange("end_date")}
                    value={avail.end_date}
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
