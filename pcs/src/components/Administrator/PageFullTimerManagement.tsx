import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, IconButton, TextField
} from '@material-ui/core';

import { filterData } from '../../database/DataFilter';
import { 
    CareTaker, getAllFullTimers, deleteFullTimer 
} from '../../database/CareTakerManager';
import { notifySuccess, notifyFailure } from './AdminHelper';
import DialogFullTimer from './DialogFullTimer';
import DeleteIcon from '@material-ui/icons/Delete';

const PageFullTimerManagement = () => {
    const [fullTimerList, setFullTimerList] = useState<CareTaker[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogType, setDialogType] = useState('');
    const [selectedFullTimerInfo, setSelectedFullTimerInfo] = useState<any>(undefined);

    const init = () => {
        getAllFullTimers().then((fullTimers) => {
            if (fullTimers)
                setFullTimerList(fullTimers.map((val, i) => ({
                    index: i + 1,
                    email: val.email,
                    name: val.name,
                    address: val.address,
                    reg_date: val.reg_date == null ? '' : val.reg_date.split("T")[0]
                })));
        })
    }

    const closeDialog = () => {
        setDialogType("");
    }

    const onDeleteClick = (fullTimerInfo) => () =>{
        setDialogType("Delete");
        setSelectedFullTimerInfo(fullTimerInfo);
    }

    const onDeleteSubmit = (fullTimerInfo: CareTaker) => {
        const tempName = fullTimerInfo.name;
        setFullTimerList([]);
        deleteFullTimer(fullTimerInfo).then((result) => {
            // if(result){
            //     notifySuccess("You have successfully deleted " + "'" + tempName + "'" + "!");
                closeDialog();
                console.log(result);
            // }else{                
            //     notifyFailure("An unexpected error occured, please try again later.");
            // }
            init();
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
            name: 'Name',
            selector: 'name',
            sortable: true,
            grow: 1
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            grow: 1
        },
        {
            name: 'Home Address',
            selector: 'address',
            sortable: true,
            grow: 1
        },
        {
            name: 'Registration Date',
            selector: 'reg_date',
            sortable: true,
            grow: 1
        },
        {
            name: 'Action',
            sortable: false,
            cell: (row: any) => <div>
                <Grid container alignItems="center">
                    {/* <IconButton onClick={onEditClick(row)} size="small">
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <Divider orientation="vertical" flexItem /> */}
                    <IconButton onClick={onDeleteClick(row)} size="small">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Grid>
            </div>,
            ignoreRowClick: true,
            selector: 'email',
            grow: 0,
        }
    ];

    useEffect(() => {
        init();
    }, []);

    return fullTimerList.length > 0 ? (
        <Card style={{ width: "100%", padding: 10 }}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                    <CardHeader title="Full Timers Management" />
                </Grid>
            </Grid>
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField 
                            id="outlined-basic" 
                            label="Search" 
                            placeholder="Adi Yoga..."
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
                            data={filterData(fullTimerList, searchQuery)}
                            noHeader
                            defaultSortField="index"
                            pagination={true} />
                        <DialogFullTimer 
                            dialogType={dialogType}
                            closeDialog={closeDialog}
                            onDeleteSubmit={onDeleteSubmit}
                            selectedFullTimerInfo={selectedFullTimerInfo}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>) : <CircularProgress />;
}

export default PageFullTimerManagement;