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
    deleteFTLeaves, FTLeaves, getFTLeaves, insertFTLeaves, updateFTLeaves
} from '../../database/FTLeavesManager';
import DialogLeave from './DialogLeave';

const FTLeaveManagement = () => {
    const { user } = React.useContext(AppContext);
    const [leaves, setLeaves] = useState<FTLeaves[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const init = () => {
        if (user) {
            getFTLeaves(user.email).then(ftLeaves => {
                if (ftLeaves)
                    setLeaves(ftLeaves.map((val, i) => ({
                        index: i + 1,
                        ...val
                    })));
                setLoading(false);
            });
        }
    }

    const { notifySuccess } = useContext(AppContext);
    const [selectedLeave, setSelectedLeave] = useState<any>(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [dialog, setDialog] = useState(false);

    const toggleDialog = () => {
        setDialog(!dialog);
    };

    const onEditClick = (leave) => () => {
        leave.date = moment(leave.date).format('yyyy-MM-DD');
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
        leaveObj.date = moment(leaveObj.date).format('yyyy-MM-DD');
        delete leaveObj['index'];
        const result = await deleteFTLeaves(leaveObj);
        if (result) notifySuccess("You have deleted your leave.");
        init();
    }

    const onSubmit = (leaveObj: FTLeaves) => {
        insertFTLeaves(leaveObj).then(result => {
            if (result) {
                notifySuccess("Your leave have been successfully applied.");
                toggleDialog();
                init();
            }
        })
    }

    const onUpdateSubmit = (leaveObj) => {
        updateFTLeaves(leaveObj).then(result => {
            if (result) {
                setIsEdit(false);
                notifySuccess("You have updated your leave.");
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
            name: 'Leave Date',
            selector: 'date',
            sortable: true,
            format: row => moment(row.date).format("DD MMM YYYY")
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
            <CardHeader title="Leave Management" />
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
                            onClick={onAddClick}>Apply Leave</Button>
                    </Grid>
                    <hr />
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={columns}
                            data={filterData(leaves, searchQuery)}
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