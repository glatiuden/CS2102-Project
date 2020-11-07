import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
    AppBar, Avatar, Box, CircularProgress, Container, CssBaseline, Divider, Drawer, List, ListItem,
    ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
import ChildFriendlyOutlinedIcon from '@material-ui/icons/ChildFriendlyOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PetsIcon from '@material-ui/icons/Pets';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import { useStyles } from '../Styles';
import { AppContext } from './AppContext';

export interface IState {
    searchText: string;
    loading: boolean;
    classes: any;
    history: any;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState = {
    searchText: "",
    loading: false,
    classes: {} as any,
    history: {} as any,
    setSearchText: {} as React.Dispatch<React.SetStateAction<string>>,
    setLoading: {} as React.Dispatch<React.SetStateAction<boolean>>,
} as IState;

export const MainContext = React.createContext<IState>(initialState);

export const MainContextProvider = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [searchText, setSearchText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { user, isAuthenticated, signOut } = useContext(AppContext);

    const onSignOut = () => {
        signOut();
        history.push("/signin");
    }

    useEffect(() => {
        if (!isAuthenticated) {
            history.push('/signin');
        }
    }, []);

    return (
        <MainContext.Provider
            value={{
                searchText,
                loading,
                classes,
                history,
                setSearchText,
                setLoading
            }}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Pet Caring Service
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            <ListItem button onClick={() => history.push("/profile")}>
                                <Container className={classes.center}>
                                    <Avatar src={'https://source.unsplash.com/random'} className={classes.largeAvatar} />
                                    {/* <Avatar src={'https://www.comp.nus.edu.sg/stfphotos/adi-yoga.jpg'} className={classes.largeAvatar} /> */}
                                    <Typography variant="h6" align="center">{user ? user.name : "Sam"}</Typography>
                                    <Typography variant="caption">
                                        {user ?.user_role === 'PO' ? "Pet_Owner" : ''}
                                        {user ?.user_role === 'PO-FT' ? "Pet_Owner & Care Taker (Full Time)" : ''}
                                        {user ?.user_role === 'PO-PT' ? "Pet_Owner & Care Taker (Part Time)" : ''}
                                        {user ?.user_role === 'PT' ? "Care Taker (Part Time)" : ''}
                                        {user ?.user_role === 'FT' ? "Care Taker (Full Time)" : ''}
                                        {user ?.user_role === 'ADMIN' ? "Admin" : ''}
                                    </Typography>
                                </Container>
                            </ListItem>
                            <Divider />

                            <Box display={user ?.user_role === 'ADMIN' ? "block" : "none"}>
                                <ListItem button onClick={() => history.push("/dashboard")}>
                                    <ListItemIcon>
                                        <DashboardIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Dashboard"} />
                                </ListItem>

                                <ListItem button onClick={() => history.push("/petownermanagement")}>
                                    <ListItemIcon>
                                        <PetsIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Pet Owners Management"} />
                                </ListItem>

                                <ListItem button onClick={() => history.push("/petcategorymanagement")}>
                                    <ListItemIcon>
                                        <AssignmentIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Pet Category Management"} />
                                </ListItem>

                                <ListItem button onClick={() => history.push("/parttimermanagement")}>
                                    <ListItemIcon>
                                        <ChildFriendlyIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Part Timer Management"} />
                                </ListItem>

                                <ListItem button onClick={() => history.push("/fulltimermanagement")}>
                                    <ListItemIcon>
                                        <ChildFriendlyOutlinedIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Full Timer Management"} />
                                </ListItem>

                                <ListItem button onClick={() => history.push("/adminmanagement")}>
                                    <ListItemIcon>
                                        <SupervisorAccountIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Admins Management"} />
                                </ListItem>
                            </Box>
                        </List>

                        <Box display={user ?.user_role === 'PO' || user ?.user_role === 'PO-PT' || user ?.user_role === 'PO-FT' ? "block" : "none"}>
                            <Divider />
                            <List>
                                <ListItem button onClick={() => history.push("/petmanagement")}>
                                    <ListItemIcon>
                                        <PetsIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Pet Management"} />
                                </ListItem>
                            </List>
                            <Divider />
                        </Box>

                        <Box display={user ?.user_role === 'PT' || user ?.user_role === 'FT' || user ?.user_role === 'PO-PT' || user ?.user_role === 'PO-FT' ? "block" : "none"}>
                            <List>
                                <ListItem button onClick={() => history.push("/caretakerconsole")}>
                                    <ListItemIcon>
                                        <AssessmentIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Care Taker Console"} />
                                </ListItem>
                                <ListItem button onClick={() => history.push("/bidsmanagement")}>
                                    <ListItemIcon>
                                        <ChildFriendlyIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"Bids Management"} />
                                </ListItem>
                                {user ?.user_role === 'FT' ?
                                    <ListItem button onClick={() => history.push("/leavemanagement")}>
                                        <ListItemIcon>
                                            <DateRangeIcon className={classes.icon} />
                                        </ListItemIcon>
                                        <ListItemText primary={"Leave Management"} />
                                    </ListItem>
                                    : <ListItem button onClick={() => history.push("/availabilitymanagement")}>
                                        <ListItemIcon>
                                            <DateRangeIcon className={classes.icon} />
                                        </ListItemIcon>
                                        <ListItemText primary={"Availability Management"} />
                                    </ListItem>}
                            </List>
                            {/* <List>
                                <ListItem button onClick={() => history.push("/caretakersalary")}>
                                    <ListItemIcon>
                                        <AssessmentIcon className={classes.icon} />
                                    </ListItemIcon>
                                    <ListItemText primary={"My Salary Report"} />
                                </ListItem>
                            </List> */}
                            <Divider />
                        </Box>

                        <List>
                            <ListItem button>
                                <ListItemIcon>
                                    <PowerSettingsNewIcon className={classes.icon} />
                                </ListItemIcon>
                                <ListItemText primary={"Logout"} onClick={onSignOut} />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div className={classes.loading}>
                        {loading ? <CircularProgress /> : props.children}
                    </div>
                </main>
            </div>
        </MainContext.Provider>
    );
};

export const MainContextConsumer = MainContext.Consumer;
