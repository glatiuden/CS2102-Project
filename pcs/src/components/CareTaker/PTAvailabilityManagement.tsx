import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { AppContext } from '../../contexts/AppContext';
import { filterData } from '../../database/DataFilter';
import {
    deletePTAvailability, getPTAvailability, insertPTAvailability, PTAvailability,
    updatePTAvailability
} from '../../database/PTAvailabilityManager';
import DialogAvailability from './DialogAvailability';

const PTAvailabilityManagement = () => {
    const { user } = React.useContext(AppContext);
    const [avail, setAvail] = useState<PTAvailability[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    const { notifySuccess } = useContext(AppContext);
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
        if (result) notifySuccess("The availability has been deleted.");
        init();
    }

    const onSubmit = (availObj: PTAvailability) => {
        insertPTAvailability(availObj).then(result => {
            if (result) {
                notifySuccess("You have indicated your availability");
                toggleDialog();
                init();
            }
        })
    }

    const onUpdateSubmit = (availObj) => {
        updatePTAvailability(availObj).then(result => {
            if (result) {
                setIsEdit(false);
                notifySuccess("You have updated your availability");
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
            name: '',
            sortable: false,
            cell: (row: any) => <div>
                <Button onClick={onEditClick(row)} className="btn btn-link" color="primary">Edit</Button>{" | "}
                <Button onClick={onDelete(row)} className="btn btn-link" color="secondary">Delete</Button>
            </div>,
            ignoreRowClick: true,
            selector: 'category'
        }
    ];

    return !loading ? (
        <Card style={{ width: "100%", padding: 10 }}>
            <CardHeader title="Availability Management" />
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        <TextField id="outlined-basic" label="Search" placeholder="Dog..."
                            fullWidth
                            value={searchQuery}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }} />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            className="float-right"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={onAddClick}>Indicate Availability</Button>
                    </Grid>
                    <hr />
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={columns}
                            data={filterData(avail, searchQuery)}
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