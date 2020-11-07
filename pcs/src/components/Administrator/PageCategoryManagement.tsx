import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, IconButton, TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { AppContext } from '../../contexts/AppContext';
import { filterData } from '../../database/DataFilter';
import {
    deletePetCategory, getPetCategory, insertPetCategory, PetCategory, updatePetCategory
} from '../../database/PetCategoryManager';
import DialogCategory from './DialogCategory';

const PageCategoryManagement = () => {
    const [categories, setCategories] = useState<PetCategory[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const init = () => {
        getPetCategory().then(petCats => {
            if (petCats)
                setCategories(petCats.map((val, i) => ({
                    index: i + 1,
                    category: val.category
                })));
        });
    }

    const { notifySuccess } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState<any>(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [dialog, setDialog] = useState(false);

    const toggleDialog = () => {
        setDialog(!dialog);
    };

    const onEditClick = (category) => () => {
        setSelectedCategory(category);
        setIsEdit(true);
        toggleDialog();
    }

    const onAddClick = () => {
        setIsEdit(false);
        toggleDialog();
    }

    useEffect(() => {
        init();
    }, []);

    const onDelete = (petCat: PetCategory) => async () => {
        await deletePetCategory({ category: petCat.category });
        notifySuccess("The selected category has been deleted.");
        init();
    }

    const onSubmit = (petCat: PetCategory) => {
        insertPetCategory(petCat).then(result => {
            if (result) {
                notifySuccess("You have added a category");
                toggleDialog();
                init();
            }
        })
    }

    const onUpdateSubmit = (petCat) => {
        updatePetCategory(petCat).then(result => {
            if (result) {
                setIsEdit(false);
                notifySuccess("You have updated the category");
                toggleDialog();
                init();
            }
        });
    }

    const handleChange = (event: any) => {
        setSearchQuery(event.target.value);
    }

    const columns = [
        {
            name: '#',
            selector: 'index',
            sortable: true,
            grow: 0
        },
        {
            name: 'Category',
            selector: 'category',
            sortable: true,
            grow: 1
        },
        {
            name: 'Actions',
            sortable: false,
            cell: (row: any) => <div>
                <Grid container alignItems="center">
                    <IconButton onClick={onEditClick(row)} size="small">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton onClick={onDelete(row)} size="small">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Grid>
            </div>,
            ignoreRowClick: true,
            selector: 'category',
            grow: 0
        }
    ];

    return categories.length > 0 ? (
        <Card style={{ width: "100%", padding: 10 }}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                    <CardHeader title="Pet Category Management" />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        className="float-right"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}>Add Category</Button>
                </Grid>
            </Grid>
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-basic"
                            label="Search"
                            placeholder="Dog..."
                            fullWidth
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }} />
                    </Grid>
                    <hr />
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={columns}
                            data={filterData(categories, searchQuery)}
                            noHeader
                            defaultSortField="index"
                            pagination={true} />
                        <DialogCategory isOpen={dialog}
                            onClose={toggleDialog}
                            onSubmit={onSubmit}
                            onUpdateSubmit={onUpdateSubmit}
                            petCategoryInfo={selectedCategory}
                            isEdit={isEdit} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>) : <CircularProgress />;
}

export default PageCategoryManagement;