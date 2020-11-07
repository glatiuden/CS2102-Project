import clsx from 'clsx';
import { copyFileSync } from 'fs';
import React, { useContext, useState, useEffect } from 'react';

import {
    Box, Button, Card, CardContent, CardHeader, Container, Divider, FormControl, Grid, NativeSelect, TextField
} from '@material-ui/core';

import { AppContext } from '../../contexts/AppContext';
import { updateUserPassword } from '../../database/PCSUserManager';
import { getRegions } from './UserProfileHelper';
import { useStyles } from './UserProfileStyle';

const UserProfile = ({ className, ...rest }) => {
    const classes = useStyles();
    const { user, notifySuccess, notifyDanger, updateUserReducer } = useContext(AppContext);
    const [updateInfo, setUpdateInfo] = useState({
        uesr_email: user?.email,
        new_name: user?.name,
        new_region: user?.region,
        new_address: user?.address
    });
    const [updating, setUpdating] = useState(false);
    const [updatePassword, setUpdatePassword] = useState({
        email: user!.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [pwNotMatch, setPwNotMatch] = useState(false);
    const [regions, setRegions] = useState<any>([]);

    const onDetailChange = (key: string) => (e: any) => {
        const _updateInfo = { ...updateInfo } as any;
        _updateInfo[key] = e.target.value;
        setUpdateInfo(_updateInfo);
    }

    const onPasswordChange = (key: string, type: any) => (e: any) => {
        const _updatePassword = { ...updatePassword } as any;
        _updatePassword[key] = e.target.value;
        setUpdatePassword(_updatePassword);

        switch (type) {
            case 1: // current Password
                break;
            case 2: // new Password
                if (e.target.value === _updatePassword.confirmPassword) {
                    setPwNotMatch(false);
                } else {
                    setPwNotMatch(true);
                }
                break;
            case 3: // confirm Password
                if (e.target.value === _updatePassword.newPassword) {
                    setPwNotMatch(false);
                } else {
                    setPwNotMatch(true);
                }
                break;
            default:
        }
    }

    const onProfileSubmit = () => {
        var changesMade = false;
        if (user!.name !== updateInfo!.new_name) changesMade = true;
        if (user!.address !== updateInfo!.new_address) changesMade = true;
        if (user!.region !== updateInfo!.new_region) changesMade = true;

        if (changesMade) {
            setUpdating(true);
            updateUserReducer(updateInfo).then(result => {
                setUpdating(false);
            });
        } else {
            notifyDanger("No changes were made");
        }
    }

    const onPasswordSubmit = async (e: any) => {
        if (pwNotMatch) {
            notifyDanger("Passwords do not match. Please try again.");
        } else if (updatePassword.currentPassword === '' || updatePassword.newPassword === '' || updatePassword.confirmPassword === '') {
            notifyDanger("Please fill in the blanks!");
        } else {
            setUpdating(true);
            const result = await updateUserPassword(updatePassword);
            setUpdating(false);
            if (result !== -1) {
                notifySuccess("Password updated successfully!");
            } else {
                notifyDanger("Your current passwords do no match! Please try again!");
            }
        }
    }

    useEffect(() => {
        setRegions(getRegions());
    }, [])

    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    lg={6}
                    md={6}
                    xs={12}
                >
                    <Card>
                        <CardHeader title="User Profile" />

                        <Divider />

                        <CardContent>
                            <Grid container spacing={3} >
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        onChange={onDetailChange("name")}
                                        required
                                        value={updateInfo!.new_name}
                                        variant="outlined"
                                    />
                                </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <NativeSelect
                                        className={classes.selectionInput}
                                        required
                                        value={updateInfo!.new_region}
                                        onChange={onDetailChange("region")}
                                    >
                                    <option value="">
                                        Region
                                    </option>
                                    {regions.map((c, i) => (<option key={i} value={c.region}>{c.region}</option>))}
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Home Address"
                                        name="homeAdress"
                                        onChange={onDetailChange("address")}
                                        required
                                        value={updateInfo!.new_address}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider />

                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            p={2}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onProfileSubmit}
                                disabled={updating}
                            >
                                Update Profile
                        </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid
                    item
                    lg={6}
                    md={6}
                    xs={12}
                >
                    <Card>
                        <CardHeader title="Change Password" />

                        <Divider />

                        <CardContent>
                            <Grid container spacing={3} >
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        autoComplete="new-password"
                                        fullWidth
                                        label="Current Password"
                                        name="currentPassword"
                                        onChange={onPasswordChange("currentPassword", 1)}
                                        required
                                        type="password"
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="newPassword"
                                        onChange={onPasswordChange("newPassword", 2)}
                                        required
                                        type="password"
                                        variant="outlined"
                                        error={pwNotMatch}
                                        helperText={pwNotMatch ? "Passwords do not match." : null}
                                    />
                                </Grid>

                                <Grid item md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        onChange={onPasswordChange("confirmPassword", 3)}
                                        required
                                        type="password"
                                        variant="outlined"
                                        error={pwNotMatch}
                                        helperText={pwNotMatch ? "Passwords do not match." : null}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider />

                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            p={2}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onPasswordSubmit}
                                disabled={updating}
                            >
                                Update Password
                        </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            </Container>
    );
}

export default UserProfile;