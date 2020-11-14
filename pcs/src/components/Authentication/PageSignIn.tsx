import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import {
    Avatar, Box, Button, Checkbox, CircularProgress, CssBaseline, FormControlLabel, Grid, Link,
    Paper, TextField, Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { AppContext } from '../../contexts/AppContext';
import { Copyright } from './AuthComponents';
import { useStyles } from './AuthStyle';

const PageSignIn = () => {
    const classes = useStyles();
    const history = useHistory();
    const { signIn, isAuthenticated } = React.useContext(AppContext);
    const [loginCredentials, setLoginCredentials] = React.useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = React.useState(false);

    const onSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true)
        signIn(loginCredentials).then((result: any) => {
            setLoading(false);
            if (result) {
                history.push('/main');
            }
        });
    };

    const onChange = (key: string) => (e: any) => {
        const _loginCredentials = { ...loginCredentials } as any;
        _loginCredentials[key] = e.target.value;
        setLoginCredentials(_loginCredentials);
    };

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/main');
        }
    }, []);

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={onSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={onChange("email")}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={onChange("password")}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="./signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                    <Box mt={3} display={loading ? "block" : "none"}>
                        <CircularProgress />
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}

export default PageSignIn;
