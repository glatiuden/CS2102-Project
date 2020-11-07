import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Avatar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, Grid, TextField, Typography
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import { AppContext } from '../../contexts/AppContext';
import {
    getKindsOfPets, getReviews, optToggle, PetCategory
} from '../../database/CareTakerManager';
import { getSalaryReport, SalaryReport } from '../../database/SalaryManager';
import { useStyles } from './CareTakerStyle';

const CareTakerSalary = () => {
    const classes = useStyles();
    const { user } = React.useContext(AppContext);
    const toDate = new Date();
    const [salaryReport, setSalaryReport] = React.useState<SalaryReport>();
    const [lastSalaryReport, setLastSalaryReport] = React.useState<SalaryReport>();
    const [salaryPercentage, setSalaryPercentage] = React.useState(0);
    const [bonusPercentage, setBonusPercentage] = React.useState(0);
    const [lastBonusZero, setLastBonusZero] = React.useState(false);
    const [myPetCategories, setPetCategories] = useState<PetCategory[]>([]);
    const [pcRow, setPcRow] = useState<PetCategory>();
    const [petCategorySetPrice, setOpenPetCategorySetPriceDialog] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);

    const onOptToggle = async (row) => {
        let isCT = false;
        if (user) {
            const role = user.user_role;
            isCT = role.includes("FT") || role.includes("CT");
            const email = user.email;
            if (isCT) {
                const { category, optin } = row;
                let toggleSuccess = false;
                if (optin) {
                    toggleSuccess = await optToggle(email, category, false, 10); // opting in
                } else {
                    toggleSuccess = await optToggle(email, category, true, 10); // opting out
                }

                if (toggleSuccess) {
                    const pc = await getKindsOfPets(user.email);
                    setPetCategories(pc);
                } else {
                    alert("Failed to opt in");
                }
            } else {
                alert("Invalid call");
            }
        }
    };

    const petCategoriesColumns = [
        {
            name: 'Category',
            sortable: false,
            selector: 'category'
        },
        {
            name: 'Daily Price',
            sortable: false,
            selector: 'daily_price',
            format: row => "$" + row.daily_price
        },
        {
            name: '',
            selector: 'optin',
            cell: (row: any) => (row.optin ? <Button onClick={() => onOptToggle(row)} color="primary">Opt Out</Button> : <Button onClick={() => openPetCategorySetPriceDialogBox(row)} color="primary">Opt In</Button>),
            ignoreRowClick: true,
        }
    ];

    const reviewsColumn = [
        {
            name: 'PO Email',
            sortable: true,
            selector: 'po_email'
        },
        {
            name: 'Rating',
            sortable: true,
            selector: 'rating'
        },
        {
            name: 'Review',
            sortable: false,
            selector: 'review'
        }
    ];

    const openPetCategorySetPriceDialogBox = (pcRow) => {
        setPcRow(pcRow);
        setOpenPetCategorySetPriceDialog(true);
    }

    useEffect(() => {
        if (user) {
            getSalaryReport(user!.email, toDate.getMonth() + 1).then((report) => {
                if (report != null) {
                    setSalaryReport(report);
                    getSalaryReport(user!.email, toDate.getMonth()).then((lastReport) => {
                        if (lastReport != null) {
                            setLastSalaryReport(lastReport);
                            setSalaryPercentage((report.salary - lastReport.salary) / lastReport.salary);

                            if (lastReport.bonus == 0) {
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
            getKindsOfPets(user.email).then((result) => {
                if (result) setPetCategories(result);
            });
            getReviews(user.email).then((result) => {
                if (result) setReviews(result);
            });
        }
    }, []);

    return (<>
        <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={2}>
                <Card style={{ height: '100%' }}>
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
            <Grid item xs={5}>
                <Card style={{ height: '100%' }}>
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
                            {salaryPercentage == 0 ? <DragHandleIcon className={classes.equalIcon} /> : ''}
                            {salaryPercentage < 0 ? <ArrowDownwardIcon className={classes.decreaseIcon} /> : ''}

                            <Typography
                                className={
                                    salaryPercentage > 0 ? classes.increaseValue : (
                                        salaryPercentage == 0 ? classes.equalValue : (
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
            <Grid item xs={5}>
                <Card style={{ height: '100%' }}>
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
                            {bonusPercentage == 0 ? <DragHandleIcon className={classes.equalIcon} /> : ''}
                            {bonusPercentage < 0 ? <ArrowDownwardIcon className={classes.decreaseIcon} /> : ''}
                            <Typography
                                className={
                                    bonusPercentage > 0 ? classes.increaseValue : (
                                        bonusPercentage == 0 ? classes.equalValue : (
                                            bonusPercentage < 0 ? classes.decreaseValue : ''))
                                }
                                variant="body2"
                            >
                                {lastBonusZero ? '' : Math.round(Math.abs(bonusPercentage * 100)) + '%'}
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
                {/* Displays all Pet Categories */}
                <Card style={{ width: "100%" }}>
                    <CardContent>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h6"
                        >
                            PET CATEGORIES
                            </Typography>
                        <Divider />
                        <Grid container spacing={1}>
                            <Grid container item lg={12}>
                                <DataTable
                                    className="dataTables_wrapper"
                                    columns={petCategoriesColumns}
                                    data={myPetCategories}
                                    noHeader
                                    defaultSortField="index"
                                    pagination={true}
                                    paginationPerPage={5}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                {/* Displays all Pet Categories */}
                <Card style={{ width: "100%" }}>
                    <CardContent>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h6"
                        >
                            RATINGS AND REVIEWS
                            </Typography>
                        <Divider />
                        <Grid container spacing={1}>
                            <Grid container item lg={12}>
                                <DataTable
                                    className="dataTables_wrapper"
                                    columns={reviewsColumn}
                                    data={reviews}
                                    noHeader
                                    defaultSortField="index"
                                    pagination={true}
                                    paginationPerPage={5}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        <Dialog open={petCategorySetPrice} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Set Daily Price</DialogTitle>
            <DialogContent dividers>
                Set the daily price of the pet category you're opting into.<br />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="pcPrice"
                    autoFocus
                    id="pcPrice"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setOpenPetCategorySetPriceDialog(false)} color="secondary">
                    Cancel
                </Button>
                <Button variant="outlined" onClick={() => {
                    if (pcRow) {
                        let input = document.getElementById("pcPrice")
                        if (input) {
                            pcRow.daily_price = parseFloat((input as HTMLInputElement).value);
                            onOptToggle(pcRow);
                            setOpenPetCategorySetPriceDialog(false);
                        }
                    }
                }}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
};

export default CareTakerSalary;
