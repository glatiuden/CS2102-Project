import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { CartesianGrid, Label, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import {
    Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Typography
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PersonIcon from '@material-ui/icons/Person';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import { MainContext } from '../../contexts/MainContext';
import {
    getAllBids, getBestPerformingMonth, getNewRegistrationCount, getRevenueMonth, getRevenueToday,
    getTodayBidsCount
} from '../../database/DashboardManager';
import { useStyles } from './DashboardStyle';

const Dashboard = () => {
    const { classes } = useContext(MainContext);
    const [rCount, setrCount] = useState<any>({});
    const [tRevenue, settRevenue] = useState<any>({});
    const [bCount, setbCount] = useState<any>({});
    const [bMonth, setbMonth] = useState<any>({});
    const [lineData, setLineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bids, setBids] = useState<any>([]);
    const dbStyle = useStyles();
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const all = Promise.all([getNewRegistrationCount(), getTodayBidsCount(), getRevenueToday(), getBestPerformingMonth(), getRevenueMonth(), getAllBids()]);
        const result = await all;
        if (result) {
            setrCount(result[0]);
            setbCount(result[1]);
            settRevenue(result[2]);
            setbMonth(result[3]);
            setLineData(result[4]);
            setBids(result[5]);
            setLoading(false);
        }
    }

    const CustomTooltip = (data) => {
        const { active, payload, label } = data;
        if (active) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}`}</p>
                    <p className="intro">{`${payload[0].value}`}</p>
                    <p className="desc">Anything you want can be displayed here.</p>
                </div>
            );
        }
        return null;
    };

    const columns = [
        {
            name: "Care Taker",
            selector: "ct_email",
            sortable: true,
            grow: 2
        },
        {
            name: "Start Date",
            selector: "start_date",
            sortable: true,
            format: row => moment(row.start_date).format("DD MMM YYYY")
        },
        {
            name: "Number of Days",
            selector: "number_of_days",
            sortable: true,
        },
        {
            name: "Payment Method",
            selector: "payment_method",
            sortable: true,
        },
        {
            name: "Total Cost",
            selector: "total_cost",
            sortable: true,
            format: row => "$" + row.total_cost
        },
    ];

    return (loading ? <CircularProgress /> :
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Card className={dbStyle.root}>
                        <CardContent className={dbStyle.content}>
                            <Grid container>
                                <Grid item xs={4} md={4} lg={4} className={classes.center}>
                                    <PersonIcon style={{ fontSize: 75 }} />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        New Registration
                                    </Typography>
                                    <Typography component="p" variant="h4">
                                        {rCount.num ? rCount.num : 0}
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.depositContext}>
                                        Last Updated: {rCount.last_updated ? rCount.last_updated.substring(0, 5) : ' - '}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Card className={dbStyle.root}>
                        <CardContent className={dbStyle.content}>
                            <Grid container>
                                <Grid item xs={4} md={4} lg={4} className={classes.center}>
                                    <ShoppingCartIcon style={{ fontSize: 75 }} />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        New Bids
                                    </Typography>
                                    <Typography component="p" variant="h4">
                                        {bCount.num ? bCount.num : 0}
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.depositContext}>
                                        Last Updated: {bCount.last_updated ? bCount.last_updated.substring(0, 5) : ' - '}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Card className={dbStyle.root}>
                        <CardContent className={dbStyle.content}>
                            <Grid container>
                                <Grid item xs={4} md={4} lg={4} className={classes.center}>
                                    <AttachMoneyIcon style={{ fontSize: 75 }} />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Revenue
                                    </Typography>
                                    <Typography component="p" variant="h4">
                                        ${tRevenue.num ? tRevenue.num : 0}
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.depositContext}>
                                        Last Updated: {tRevenue.last_updated ? tRevenue.last_updated.substring(0, 5) : ' - '}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Card className={dbStyle.root}>
                        <CardContent className={dbStyle.content}>
                            <Grid container>
                                <Grid item xs={4} md={4} lg={4} className={classes.center}>
                                    <TrendingUpIcon style={{ fontSize: 75 }} />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Best Performing Month
                                        </Typography>
                                    <Typography component="p" variant="h4">
                                        {bMonth.month}
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.depositContext}>
                                        Earned ${bMonth.sum}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item lg={6}>
                    <Card>
                        <CardHeader title="Recent Orders" className={classes.center} />
                        <Divider />
                        <CardContent>
                            <Grid container item lg={12}>
                                <DataTable
                                    className="dataTables_wrapper"
                                    columns={columns}
                                    data={bids}
                                    noHeader
                                    defaultSortField="index"
                                    pagination={true}
                                    paginationPerPage={5}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6}>
                    <Card>
                        <CardHeader title="Monthly Revenue" className={classes.center} />
                        <Divider />
                        <CardContent>
                            <LineChart
                                width={640}
                                height={350}
                                data={lineData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month">
                                    <Label
                                        value="Month"
                                        offset={0}
                                        position="insideBottomRight"
                                    />
                                </XAxis>
                                <YAxis
                                    label={{
                                        value: "$",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />
                                <Tooltip formatter={(value) => '$' + value} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sum"
                                    stroke="#78acdb"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default Dashboard;