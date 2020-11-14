import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, IconButton, TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { AppContext } from '../../contexts/AppContext';
import { filterAvailabilityDate } from '../../database/DataFilter';
import {
    deletePTAvailability, getPTAvailability, insertPTAvailability, PTAvailability,
    updatePTAvailability
} from '../../database/PTAvailabilityManager';
import DialogAvailability from './DialogAvailability';

const PTAvailabilityManagement = () => {
    const { user } = React.useContext(AppContext);
    const [avail, setAvail] = useState<PTAvailability[]>([]);
    const [searchQuery, setSearchQuery] = useState({
        start: '',
        end: ''
    });
    const [loading, setLoading] = useState(true);

    const init = () => {
        if (user) {
            getPTAvailability(user.email).then(ptAvails => {
                if (ptAvails)
                    setAvail(ptAvails.map((val, i) => ({
                        index: i + 1,
                        ...val
                    })));
                setLoading(false);
            });
        }
    }

    const { notifySuccess, notifyDanger } = useContext(AppContext);
    const [selectedAvail, setSelectedAvail] = useState<any>(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [dialog, setDialog] = useState(false);

    const toggleDialog = () => {
        setDialog(!dialog);
    };

    const onEditClick = (availObj) => () => {
        availObj.start_date = moment(availObj.start_date).format('yyyy-MM-DD');
        availObj.end_date = moment(availObj.end_date).format('yyyy-MM-DD');
        setSelectedAvail(availObj);
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

    const onDelete = (availObj: PTAvailability) => async () => {
        availObj.start_date = moment(availObj.start_date).format('yyyy-MM-DD');
        availObj.end_date = moment(availObj.end_date).format('yyyy-MM-DD');
        delete availObj['index'];
        const result = await deletePTAvailability(availObj);
        if (result === 1) {
            notifySuccess("The availability has been deleted.");
            init();
        } else
            notifyDanger(result);
    }

    const onSubmit = (availObj: PTAvailability) => {
        insertPTAvailability(availObj).then(result => {
            if (result === 1) {
                notifySuccess("You have successfully indicated your availability");
                toggleDialog();
                init();
            }
            else
                notifyDanger(result);
        })
    }

    const onUpdateSubmit = (availObj) => {
        updatePTAvailability(availObj).then(result => {
            if (result === 1) {
                setIsEdit(false);
                notifySuccess("You have updated your availability");
                toggleDialog();
                init();
            } else
                notifyDanger(result);

        });
    }

    const handleChange = (type: string) => (event: any) => {
        const _searchQuery = { ...searchQuery }
        _searchQuery[type] = event.target.value;
        setSearchQuery(_searchQuery);
    }

    const columns = [
        {
            name: '#',
            selector: 'index',
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: 'start_date',
            sortable: true,
            format: row => moment(row.start_date).format("DD MMM YYYY")
        },
        {
            name: 'End Date',
            selector: 'end_date',
            sortable: true,
            format: row => moment(row.end_date).format("DD MMM YYYY")
        },
        {
            name: 'Actions',
            sortable: false,
            cell: (row: any) =>
                <div>
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
            selector: 'category'
        }
    ];

    return !loading ? (
        <Card style={{ width: "100%", padding: 10 }}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                    <CardHeader title="Availability Management" />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        className="float-right"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}>Indicate Availability</Button>
                </Grid>
            </Grid>
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField id="outlined-basic" label="Search From" placeholder="Dog..."
                            fullWidth
                            variant="outlined"
                            type="date"
                            value={searchQuery.start}
                            onChange={handleChange('start')}
                            InputLabelProps={{
                                shrink: true,
                            }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="outlined-basic" label="To" placeholder="Dog..."
                            fullWidth
                            variant="outlined"
                            type="date"
                            value={searchQuery.end}
                            onChange={handleChange('end')}
                            InputLabelProps={{
                                shrink: true,
                            }} />
                    </Grid>
                    <hr />
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={columns}
                            data={filterAvailabilityDate(avail, searchQuery)}
                            noHeader
                            defaultSortField="index"
                            pagination={true} />
                        <DialogAvailability isOpen={dialog}
                            onClose={toggleDialog}
                            onSubmit={onSubmit}
                            onUpdateSubmit={onUpdateSubmit}
                            availInfo={selectedAvail}
                            isEdit={isEdit} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>) : <CircularProgress />;
}

export default PTAvailabilityManagement;