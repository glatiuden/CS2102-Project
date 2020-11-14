import React from 'react';

import { AppBar, Toolbar, Typography } from '@material-ui/core';

import { useStyles } from './AuthStyle';

export function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            PCS{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export function LoginAppBar() {
    const classes = useStyles();
    return <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
            <Typography variant="h6" noWrap>Pet Caring Service</Typography>
        </Toolbar>
    </AppBar>;
}