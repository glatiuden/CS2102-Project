import React, { useContext, useEffect, useState } from 'react';

import {
    Box, Button, Card, CardContent, CardHeader, Container, Divider, FormControl, Grid, NativeSelect,
    TextField
} from '@material-ui/core';

import { AppContext } from '../../contexts/AppContext';
import { updateUserPassword, updateUserCard, getUserCard } from '../../database/PCSUserManager';
import { getRegions } from './UserProfileHelper';
import { useStyles } from './UserProfileStyle';

const UserProfile = ({ className, ...rest }) => {
    const classes = useStyles();
    const { user, notifySuccess, notifyDanger, updateUserReducer } = useContext(AppContext);
    const [updateInfo, setUpdateInfo] = useState({
        email: user ?.email,
        name: user ?.name,
        region: user ?.region,
        address: user ?.address,
        user_role: user?.user_role,
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
    const [cardInfo, setCardInfo] = useState({
        email: user!.email,
        cardName: '',
        cardNum: '',
        expiryDate: '',
        ccv: ''
    });
    const [userCard, setUserCard] = useState<any>({
        credit_card: ''
    });
    const [hasCard, setHasCard] = useState(false);

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
        if (user!.name !== updateInfo!.name) changesMade = true;
        if (user!.address !== updateInfo!.address) changesMade = true;
        if (user!.region !== updateInfo!.region) changesMade = true;

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

    const onCardChange = (key: string) => (e: any) => {
        const _cardInfo = { ...cardInfo } as any;
        _cardInfo[key] = e.target.value;
        setCardInfo(_cardInfo);
    }

    const onCreditCardSubmit = async (e:any) => {
        setUpdating(true);
        const result = await updateUserCard(cardInfo);
        setUpdating(false);
        if(result){
            notifySuccess("Card Added!");
            setHasCard(true);
            setUserCard({
                credit_card: cardInfo.cardNum
            });
        }else{
            notifyDanger("Some error occured! Please try again later!");
        }
    }

    const onChangeCardClicked = () => {
        setHasCard(false);
    }

    const onDeleteCardClicked = async () =>{
        setUpdating(true);
        const result = await updateUserCard({
            email: user!.email,
            credit_card: ''
        });
        setUpdating(false);
        if(result){
            notifySuccess("Card Removed!");
            setHasCard(false);
            setUserCard({
                credit_card: ''
            });
        }else{
            notifyDanger("Some error occured! Please try again later!");
        }
    }

    const retrieveUserCard = async () => {
        getUserCard(user!.email).then((result) => {
            if(result){
                if(result['credit_card'] != null && result['credit_card'] != ''){
                    setUserCard(result);
                    setHasCard(true);
                }
            }
        })
    }

    useEffect(() => {
        setRegions(getRegions());
        retrieveUserCard();
    }, [])

    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={1}
            >
                <Grid item lg={6} md={6} xs={12}>
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
                                        value={updateInfo!.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <NativeSelect
                                            className={classes.selectionInput}
                                            required
                                            value={updateInfo!.region}
                                            onChange={onDetailChange("region")}
                                        >
                                            <option value="">
                                                Region
                                            </option>
                                            {regions.map((c, i) => (<option key={i} value={c.region}>{c.region}</option>))}
                                        </NativeSelect>
                                    </FormControl>
                                </Grid>
                                {user ?.user_role === "ADMIN" ? null :
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            label="Home Address"
                                            name="homeAdress"
                                            onChange={onDetailChange("address")}
                                            required
                                            value={updateInfo!.address}
                                            variant="outlined"
                                        />
                                    </Grid> }
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
                                style={{marginLeft:"auto"}}
                            >
                                Update Profile
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid item lg={6} md={6} xs={12}>
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
                                style={{marginLeft:"auto"}}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Box width="100%" margin="5px" display={user!.user_role.includes('PO') && !hasCard ? "block":"none"}>
                    <Grid item lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Credit Card Details" />

                            <Divider />

                            <CardContent>
                                <Grid container spacing={3} >
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Card Name"
                                            name="cardname"
                                            onChange={onCardChange("cardName")}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Card Number"
                                            name="cardNum"
                                            onChange={onCardChange("cardNum")}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item md={8} xs={8}>
                                        <TextField
                                            fullWidth
                                            label="Expiration Date"
                                            name="expiryDate"
                                            onChange={onCardChange('expiryDate')}
                                            required
                                            placeholder='MM/YY'
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item md={4} xs={4}>
                                        <TextField
                                            fullWidth
                                            label="CCV"
                                            name="ccv"
                                            onChange={onCardChange("ccv")}
                                            required
                                            type="password"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>

                            <Divider />
                            
                            <div style={{padding:'10px'}}>
                                <Grid container spacing={1} justify="flex-end" direction="row">
                                    <Grid item>
                                        <Box display={userCard!.credit_card == '' ? 'none' : 'block'}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setHasCard(true)}
                                                disabled={updating}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onCreditCardSubmit}
                                            disabled={updating}
                                        >
                                            Add Card
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Card>
                    </Grid>
                </Box>


                <Box width="100%" margin="5px" display={user!.user_role.includes('PO') && hasCard ? "block":"none"}>
                    <Grid item lg={6} md={6} xs={12}>
                        <Card>
                            <CardHeader title="Credit Card Details" />

                            <Divider />

                            <CardContent>
                                <Grid container spacing={3} >
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Card Number"
                                            value={userCard!.credit_card.replace(/[0-9](?=([0-9]{4}))/g, '•')}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>

                            <Divider />

                            <div style={{padding:'10px'}}>
                                <Grid container spacing={1} justify="flex-end" direction="row">
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onDeleteCardClicked}
                                            disabled={updating}
                                        >
                                            Delete Card
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onChangeCardClicked}
                                            disabled={updating}
                                        >
                                            Change Card
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Card>
                    </Grid>
                </Box>
            </Grid>
        </Container>
    );
}

export default UserProfile;