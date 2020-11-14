import React, { useContext, useEffect, useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useHistory } from 'react-router-dom';

import {
    AppBar, Avatar, Box, Button, CircularProgress, Container, CssBaseline, Divider, FormControl,
    Grid, Link, NativeSelect, Tab, TextField, Typography
} from '@material-ui/core';
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PetsIcon from '@material-ui/icons/Pets';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { AppContext } from '../../contexts/AppContext';
import { getPetCategory, PetCategory } from '../../database/PetCategoryManager';
import { Copyright, LoginAppBar } from './AuthComponents';
import {
    getRegions, hasEmptyFields, notifyFailure, notifySuccess, signUp, validateEmail
} from './AuthHelper';
import { useStyles } from './AuthStyle';

export default function SignUp() {
    const history = useHistory();
    const classes = useStyles();
    const { isAuthenticated } = useContext(AppContext);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [errorPWInfo, setErrorPWInfo] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorEmailText, setErrorEmailText] = useState("Incorrect Email Format");
    const [pwScore, setPWScore] = useState(0);
    const [regInfo, setRegInfo] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        region: '',
        address: '',
        petName: '',
        petCategory: '',
        petSpecialReq: '',
        ctType: '',
    });
    const [loading, setLoading] = React.useState(false);
    const [checkedPO, setCheckedPO] = React.useState(false);
    const [checkedCT, setCheckedCT] = React.useState(false);
    const [ctType, setCtType] = React.useState("0");
    const [tabValue, setTabValue] = React.useState("1");
    const [petCategories, setPetCategories] = useState<PetCategory[]>([]);
    const [regions, setRegions] = useState<any>([]);

    const onPetOwnerChange = (key: string) => (e: any) => {
        const _regInfo = { ...regInfo } as any;
        _regInfo[key] = e.target.value;
        setRegInfo(_regInfo);

        if (_regInfo.petName === '' && _regInfo.petCategory === '' && _regInfo.petSpecialReq === '') {
            setCheckedPO(false);
        } else {
            setCheckedPO(true);
        }
    }

    const onCareTakerTypeChange = (type: string) => (e: any) => {
        if (ctType === type) {
            setCheckedCT(false);
            setCtType("0");
        } else {
            setCheckedCT(true);
            setCtType(type);
        }
    }

    const onTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setTabValue(newValue);
    };

    const onTextChange = (key: string) => (e: any) => {
        const textValue = e.target.value;
        const _regInfo = { ...regInfo } as any;
        _regInfo[key] = e.target.value;
        setRegInfo(_regInfo);

        if (key === "email") {
            if (validateEmail(textValue)) {
                setErrorEmail(false);
            } else {
                setErrorEmail(true);
                setErrorEmailText("Incorrect email format");
            }
        }
    }

    const onChangeScore = (score: any) => {
        setPWScore(score);
        if (score <= 0) {
            setErrorPWInfo(true);
        } else {
            setErrorPWInfo(false);
        }
    }

    const verifyPassword = (isConfirm: boolean) => (e: any) => {
        const _regInfo = { ...regInfo } as any;
        const textValue = e.target.value;
        if (!isConfirm) {
            //Normal PW
            _regInfo["password"] = textValue;
            setRegInfo(_regInfo);
            if (textValue !== _regInfo.confirmPassword) {
                setErrorPWInfo(true);
            } else {
                setErrorPWInfo(false);
            }
        } else {
            _regInfo["confirmPassword"] = textValue;
            setRegInfo(_regInfo);
            if (textValue !== _regInfo.password) {
                setErrorPWInfo(true);
            } else {
                setErrorPWInfo(false);
            }
        }
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (!errorEmail && !errorPWInfo) {
            if (pwScore > 0) {
                setLoading(true)
                setDisableSubmit(true)
                signUp(regInfo, checkedPO, checkedCT, ctType).then((result) => {
                    setLoading(false)
                    setDisableSubmit(true)
                    if (result > 0) {
                        notifySuccess("Registration Success");
                        setTimeout(() => {
                            history.push("/signin");
                        }, 2000);
                    } else {
                        if (result === 0) {
                            notifyFailure("Email already registered");
                        } else if (result === null) {
                            notifyFailure("Please fill up either pet owner or care taker");
                        } else {
                            notifyFailure("An unexpected error occured. Please try again later");
                            console.log(result);
                        }
                    }
                });
            } else {
                notifyFailure("Please use a stronger password!");
            }
        }
    }

    const retrievePetCategory = async () => {
        const petCategoryResult = await getPetCategory();
        if (petCategoryResult) {
            setPetCategories(petCategoryResult);
        }
    };

    useEffect(() => {
        setDisableSubmit(hasEmptyFields(regInfo))
        if (isAuthenticated) {
            history.push('/home');
        } else {
            retrievePetCategory();
            setRegions(getRegions());
        }
    }, [regInfo])


    return (
        <>
            <LoginAppBar />
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    onChange={onTextChange("name")}
                                    value={regInfo.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={onTextChange("email")}
                                    error={errorEmail}
                                    helperText={errorEmail ? errorEmailText : null}
                                    value={regInfo.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={verifyPassword(false)}
                                    value={regInfo.password}
                                    helperText={errorPWInfo ? "Password do not match." : null}
                                />
                                {regInfo.password ? <PasswordStrengthBar password={regInfo.password} minLength={6} onChangeScore={onChangeScore} /> : null}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={errorPWInfo}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="confirm-password"
                                    helperText={errorPWInfo ? "Password do not match." : null}
                                    onChange={verifyPassword(true)}
                                    value={regInfo.confirmPassword || ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <NativeSelect
                                        className={classes.selectionInput}
                                        required
                                        value={regInfo.region}
                                        onChange={onTextChange("region")}
                                    >
                                        <option value="">
                                            Region
                                    </option>
                                        {regions.map((c, i) => (<option key={i} value={c.region}>{c.region}</option>))}
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="address"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={5}
                                    id="address"
                                    label="Home Address"
                                    onChange={onTextChange("address")}
                                    value={regInfo.address}
                                />
                            </Grid>
                        </Grid>
                        <Divider className={classes.divider} />

                        <div className={classes.tabTitle}>
                            <Typography variant="h6" noWrap>
                                Which role are you signing up for?
                            </Typography>
                            <br />
                        </div>

                        <TabContext value={tabValue}>
                            <AppBar position="static">
                                <TabList
                                    classes={{ indicator: classes.tabIndicator }}
                                    onChange={onTabChange}
                                    aria-label="simple tabs example"
                                    variant="fullWidth"
                                >
                                    <Tab icon={<PetsIcon />} label="Pet Owner" value="1" />
                                    <Tab icon={<ChildFriendlyIcon />} label="Care Taker" value="2" />
                                </TabList>
                            </AppBar>
                            <TabPanel className={classes.tabBorder} value="1">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="petName"
                                            variant="outlined"
                                            fullWidth
                                            id="petName"
                                            label="Pet's Name"
                                            onChange={onPetOwnerChange("petName")}
                                            value={regInfo.petName || ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <NativeSelect
                                                className={classes.selectionInput}
                                                required
                                                value={regInfo.petCategory}
                                                onChange={onPetOwnerChange("petCategory")}
                                            >
                                                <option value="">
                                                    Pet Category
                                            </option>
                                                {petCategories.map((c, i) => (<option key={i} value={c.category}>{c.category}</option>))}
                                            </NativeSelect>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="petSpecialReq"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={5}
                                            id="petSpecialReq"
                                            label="Special Requirement"
                                            onChange={onPetOwnerChange("petSpecialReq")}
                                            value={regInfo.petSpecialReq}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel className={classes.tabBorder} value="2">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button
                                            variant={ctType === "1" ? "contained" : "outlined"}
                                            color="primary"
                                            fullWidth
                                            onClick={onCareTakerTypeChange("1")}
                                        >
                                            Part Timer
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant={ctType === "2" ? "contained" : "outlined"}
                                            color="secondary"
                                            fullWidth
                                            onClick={onCareTakerTypeChange("2")}
                                        >
                                            Full Timer
                                        </Button>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <Typography variant="subtitle2" style={{ color: 'black', textAlign: 'center' }} noWrap>
                                {checkedPO || checkedCT ? "This is an indicator that you are signing up as a " : ''}
                                {checkedPO ? "Pet Owner " : ''}
                                {checkedPO && checkedCT ? "and " : ''}
                                {checkedCT ? "Caretaker" : ''}
                                <br />
                            </Typography>
                        </TabContext>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={disableSubmit}>Sign Up</Button>
                        <Grid container justify="center">
                            <Grid item>
                                <Link href="/signin" variant="body2">Already have an account? Sign in</Link>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={3} display={loading ? "block" : "none"}>
                        <CircularProgress />
                    </Box>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
}
