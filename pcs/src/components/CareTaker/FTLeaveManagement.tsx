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
import { filterDateLeave } from '../../database/DataFilter';
import {
    deleteFTLeaves, FTLeaves, getFTLeaves, insertFTLeaves, updateFTLeaves
} from '../../database/FTLeavesManager';
import DialogLeave from './DialogLeave';

const FTLeaveManagement = () => {
    const { user } = React.useContext(AppContext);
    const [leaves, setLeaves] = useState<FTLeaves[]>([]);
    const [searchQuery, setSearchQuery] = useState({
        start: '',
        end: ''
    });
    const [loading, setLoading] = useState(true);
    const init = () => {
        if (user) {
            getFTLeaves(user.email).then(ftLeaves => {
                if (ftLeaves)
                    setLeaves(ftLeaves);
                setLoading(false);
            });
        }
    }

    const { notifySuccess, notifyDanger } = useContext(AppContext);
    const [selectedLeave, setSelectedLeave] = useState<any>(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [dialog, setDialog] = useState(false);

    const toggleDialog = () => {
        setDialog(!dialog);
    };

    const onEditClick = (leave) => () => {
        leave.date = moment(leave.date).format('YYYY-MM-DD');
        setSelectedLeave(leave);
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

    const onDelete = (leaveObj: FTLeaves) => async () => {
        leaveObj.date = moment(leaveObj.date).format('YYYY-MM-DD');
        delete leaveObj['index'];
        const result = await deleteFTLeaves(leaveObj);
        if (result === 1) {
            notifySuccess("You have deleted your leave.");
            init();
        } else {
            notifyDanger(result);
        }
    }

    const onSubmit = (leaveObj: FTLeaves) => {
        insertFTLeaves(leaveObj).then(result => {
            if (result === 1) {
                notifySuccess("Your leave have been successfully applied.");
                toggleDialog();
                init();
            } else {
                notifyDanger(result);
            }
        })
    }

    const onUpdateSubmit = (leaveObj) => {
        updateFTLeaves(leaveObj).then(result => {
            if (result === 1) {
                setIsEdit(false);
                notifySuccess("You have updated your leave.");
                toggleDialog();
                init();
            } else {
                notifyDanger(result);
            }
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
            name: 'Leave Date',
            selector: 'date',
            sortable: true,
            format: row => moment(row.date).format("DD MMM YYYY")
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
                    <CardHeader title="Leave Management" />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        className="float-right"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}>Apply Leave</Button>
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
                            data={filterDateLeave(leaves, searchQuery)}
                            noHeader
                            defaultSortField="index"
                            pagination={true} />
                        <DialogLeave isOpen={dialog}
                            onClose={toggleDialog}
                            onSubmit={onSubmit}
                            onUpdateSubmit={onUpdateSubmit}
                            leaveInfo={selectedLeave}
                            isEdit={isEdit} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>) : <CircularProgress />;
}

export default FTLeaveManagement;