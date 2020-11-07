import React, { useEffect, useState } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@material-ui/core';

export default function DialogCategory(props: any) {
    const { isOpen, onClose, onSubmit, onUpdateSubmit, petCategoryInfo, isEdit } = props;
    const [category, setCategory] = useState({
        category: ""
    });

    useEffect(() => {
        if (isEdit) {
            setCategory(petCategoryInfo);
        }
    }, [petCategoryInfo]);

    const closeDialog = () => {
        setCategory({
            category: ""
        });
        onClose();
    }

    const submitDialog = () => {
        if (isEdit)
            onUpdateSubmit({
                categoryOld: petCategoryInfo.category,
                categoryNew: category.category
            });
        else
            onSubmit(category);
    }

    const onChange = (key: string) => (e: any) => {
        const _category = { ...category } as any;
        _category[key] = e.target.value;
        setCategory(_category);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{isEdit ? "Edit " : "Add New "}Category</DialogTitle>
            <DialogContent dividers>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="category"
                    label="Category"
                    name="category"
                    autoFocus
                    onChange={onChange("category")}
                    value={category.category}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="secondary" variant="outlined">
                    Cancel</Button>
                <Button onClick={submitDialog} color="primary" variant="outlined">
                    {isEdit ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
