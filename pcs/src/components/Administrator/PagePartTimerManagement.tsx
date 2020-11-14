import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Avatar, Box, Button, Card, CardContent, CardHeader, CircularProgress, Dialog, DialogActions,
    DialogContent, DialogTitle, Divider, Grid, IconButton, Link, TextField, Typography
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import StarIcon from '@material-ui/icons/Star';

import { MainContext } from '../../contexts/MainContext';
import { CareTaker, deleteCareTaker, getAllPartTimers } from '../../database/CareTakerManager';
import { getPTSalary } from '../../database/DashboardManager';
import { filterData } from '../../database/DataFilter';
import { getAverageRatings, getSalaryReport, SalaryReport } from '../../database/SalaryManager';
import { notifyFailure, notifySuccess } from './AdminHelper';
import { useStyles } from './AdminStyle';
import DialogPartTimer from './DialogPartTimer';

const PagePartTimerManagement = () => {
    const classes = useStyles();
    const [partTimerList, setPartTimerList] = useState<CareTaker[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogType, setDialogType] = useState('');
    const [selectedPartTimerInfo, setSelectedPartTimerInfo] = useState<any>(undefined);
    const [loading, setLoading] = useState(true);
    const [openPartTimerDialog, setOpenPartTimerDialog] = useState(false);
    const [salaryReport, setSalaryReport] = React.useState<SalaryReport>();
    const [lastSalaryReport, setLastSalaryReport] = React.useState<SalaryReport>();
    const [salaryPercentage, setSalaryPercentage] = React.useState(0);
    const [bonusPercentage, setBonusPercentage] = React.useState(0);
    const [lastBonusZero, setLastBonusZero] = React.useState(false);
    const [ratings, setRatings] = useState(5);
    const toDate = new Date();
    const mainStyle = useContext(MainContext).classes;
    const [total, setTotal] = useState(0);

    const init = () => {
        getAllPartTimers().then((partTimers) => {
            if (partTimers) {
                setPartTimerList(partTimers.map(val => ({
                    email: val.email,
                    name: val.name,
                    address: val.address,
                    region: val.region,
                    reg_date: val.reg_date == null ? '' : val.reg_date.split("T")[0]
                })));
                setLoading(false);
            }
        });
        getPTSalary().then(result => {
            if (result)
                setTotal(result);
        });

    }

    const closeDialog = () => {
        setDialogType("");
    }

    const onDeleteClick = (partTimerInfo) => () => {
        setDialogType("Delete");
        setSelectedPartTimerInfo(partTimerInfo);
    }

    const onDeleteSubmit = (partTimerInfo: CareTaker) => {
        setPartTimerList([]);
        deleteCareTaker(partTimerInfo).then((result) => {
            if (result === 1) {
                notifySuccess("You have successfully deleted " + "'" + partTimerInfo.name + "'" + "!");
                closeDialog();
            } else {
                notifyFailure("An unexpected error occured, please try again later.");
            }
            init();
        });
    }

    const handleChange = (event: any) => {
        setSearchQuery(event.target.value);
    }

    const onPartTimerClick = (partTimerInfo: CareTaker) => {
        setOpenPartTimerDialog(true);
        setSelectedPartTimerInfo(partTimerInfo);
        getSalaryReport(partTimerInfo.email, toDate.getMonth() + 1).then((report) => {
            if (report != null) {
                setSalaryReport(report);
                getSalaryReport(partTimerInfo.email, toDate.getMonth()).then((lastReport) => {
                    if (lastReport != null) {
                        setLastSalaryReport(lastReport);
                        setSalaryPercentage((report.salary - lastReport.salary) / lastReport.salary);

                        if (lastReport.bonus === 0) {
                            setLastBonusZero(true);
                            setBonusPercentage((report.bonus - lastReport.bonus) / 1);
                        } else {
                            setLastBonusZero(false);
                            setBonusPercentage((report.bonus - lastReport.bonus) / lastReport.bonus);
                        }
                    }
                });
            }
        });

        getAverageRatings(partTimerInfo.email).then((ratings) => {
            if (ratings != null) {
                setRatings(ratings);
            }
        })
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
            cell: (row: any) =>
                <Link onClick={() => onPartTimerClick(row)} underline="always">
                    <span style={{ cursor: 'pointer' }}>{row.name}</span>
                </Link>
            ,
            grow: 1
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            grow: 1.5
        },
        {
            name: 'Home Address',
            selector: 'address',
            sortable: true,
            grow: 1.5
        },
        {
            name: 'Region',
            selector: 'region',
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

    return !loading ? (
        <div style={{ width: '100%' }}>
            <Card style={{ width: "100%", padding: 10 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={8}>
                        <CardHeader title="Part-Timers Management" />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom component="p" variant="h6">
                            <b>Total Salary to be Paid this Month:</b> ${total}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Search"
                                placeholder="John Tan..."
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
                                data={filterData(partTimerList, searchQuery)}
                                noHeader
                                defaultSortField="index"
                                pagination={true} />
                            <DialogPartTimer
                                dialogType={dialogType}
                                closeDialog={closeDialog}
                                onDeleteSubmit={onDeleteSubmit}
                                selectedPartTimerInfo={selectedPartTimerInfo}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box width="100%">
                <Dialog open={openPartTimerDialog} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
                    <DialogTitle id="form-dialog-title">{selectedPartTimerInfo ? selectedPartTimerInfo.name : ''}</DialogTitle>
                    <DialogContent dividers>
                        {salaryReport ? <Grid container spacing={2} alignItems="stretch" justify="center">
                            <Grid item xs={6}>
                                <Card style={{ height: "100%" }}>
                                    <CardContent>
                                        <Grid
                                            container
                                            justify="space-between"
                                            spacing={3}
                                        >
                                            <Grid item>
                                                <Typography
                                                    color="textSecondary"
                                                    gutterBottom
                                                    variant="h6"
                                                >
                                                    WORK DAYS
                                            </Typography>
                                                <Typography
                                                    color="textPrimary"
                                                    variant="h3"
                                                >
                                                    {salaryReport ? salaryReport.work_days : 'Error'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ height: "100%" }}>
                                    <CardContent>
                                        <Grid
                                            container
                                            justify="space-between"
                                            spacing={3}
                                        >
                                            <Grid item>
                                                <Typography
                                                    color="textSecondary"
                                                    gutterBottom
                                                    variant="h6"
                                                >
                                                    ESTIMATED SALARY
                                                </Typography>
                                                <Typography
                                                    color="textPrimary"
                                                    variant="h3"
                                                >
                                                    {salaryReport ? '$' + salaryReport.salary : 'Error'}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Avatar className={classes.avatar}>
                                                    <LocalAtmIcon />
                                                </Avatar>
                                            </Grid>
                                        </Grid>
                                        <Box
                                            mt={2}
                                            display="flex"
                                            alignItems="center"
                                        >
                                            {salaryPercentage > 0 ? <ArrowUpwardIcon className={classes.increaseIcon} /> : ''}
                                            {salaryPercentage === 0 ? <DragHandleIcon className={classes.equalIcon} /> : ''}
                                            {salaryPercentage < 0 ? <ArrowDownwardIcon className={classes.decreaseIcon} /> : ''}

                                            <Typography
                                                className={
                                                    salaryPercentage > 0 ? classes.increaseValue : (
                                                        salaryPercentage === 0 ? classes.equalValue : (
                                                            salaryPercentage < 0 ? classes.decreaseValue : ''))
                                                }
                                                variant="body2"
                                            >
                                                {Math.round(Math.abs(salaryPercentage * 100))}%
                                            </Typography>
                                            <Typography
                                                color="textSecondary"
                                                variant="caption" 
                                            >
                                                Since last month of {lastSalaryReport ? '$' + lastSalaryReport.salary : 'Error'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ height: "100%" }}>
                                    <CardContent>
                                        <Grid
                                            container
                                            justify="space-between"
                                            spacing={3}
                                        >
                                            <Grid item>
                                                <Typography
                                                    color="textSecondary"
                                                    gutterBottom
                                                    variant="h6"
                                                >
                                                    ESTIMATED BONUS
                                            </Typography>
                                                <Typography
                                                    color="textPrimary"
                                                    variant="h3"
                                                >
                                                    {salaryReport ? '$' + salaryReport.bonus : 'Error'}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Avatar className={classes.avatar}>
                                                    <MonetizationOnIcon />
                                                </Avatar>
                                            </Grid>
                                        </Grid>
                                        <Box
                                            mt={2}
                                            display="flex"
                                            alignItems="center"
                                        >
                                            {bonusPercentage > 0 ? <ArrowUpwardIcon className={classes.increaseIcon} /> : ''}
                                            {bonusPercentage === 0 ? <DragHandleIcon className={classes.equalIcon} /> : ''}
                                            {bonusPercentage < 0 ? <ArrowDownwardIcon className={classes.decreaseIcon} /> : ''}
                                            <Typography
                                                className={
                                                    bonusPercentage > 0 ? classes.increaseValue : (
                                                        bonusPercentage === 0 ? classes.equalValue : (
                                                            bonusPercentage < 0 ? classes.decreaseValue : ''))
                                                }
                                                variant="body2"
                                            >
                                                {lastBonusZero ? '' : !Number.isNaN(bonusPercentage) ? Math.round(Math.abs(bonusPercentage * 100)) + '%' : '0%'}
                                            </Typography>
                                            <Typography
                                                color="textSecondary"
                                                variant="caption"
                                            >
                                                Since last month of {lastSalaryReport ? '$' + lastSalaryReport.bonus : 'Error'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={6}>
                                <Card style={{ height: "100%" }}>
                                    <CardContent>
                                        <Grid
                                            container
                                            justify="space-between"
                                            spacing={3}
                                        >
                                            <Grid item>
                                                <Typography
                                                    color="textSecondary"
                                                    gutterBottom
                                                    variant="h6"
                                                >
                                                    AVERAGE RATINGS
                                        </Typography>
                                                <Typography
                                                    color="textPrimary"
                                                    variant="h3"
                                                >
                                                    {ratings} / 5
                                    </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Avatar className={classes.avatar}>
                                                    <StarIcon />
                                                </Avatar>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid> : <span className={mainStyle.center}><CircularProgress /></span>}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={() => setOpenPartTimerDialog(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>)

        : <CircularProgress />;
}

export default PagePartTimerManagement;