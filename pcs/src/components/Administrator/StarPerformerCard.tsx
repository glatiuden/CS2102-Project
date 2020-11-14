import React, { useContext } from 'react';

import {
    Avatar, Card, CardActionArea, CardContent, Container, Grid, Typography
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

import CareTakerProfile from '../../assets/CareTakerProfile.png';
import test from '../../assets/test.jpg';
import { MainContext } from '../../contexts/MainContext';
import { useStyles } from './AdminStyle';

const StarPerformerCard = (props) => {
    const { ct, onClick } = props;
    const mainStyle = useContext(MainContext).classes;
    const adminStyle = useStyles();

    return <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={ct.email}>
        <Card className={adminStyle.starPerformerCard} elevation={3}>
            <CardActionArea onClick={() => onClick(ct)}>
                <Container className={mainStyle.center}>
                    <div>
                        <Avatar alt={ct.name} src={CareTakerProfile} className={mainStyle.largeAvatar} />
                    </div>
                    <CardContent>
                        <Typography variant="caption">
                            Category: {ct.category}
                        </Typography>
                        <br />
                        <Typography variant="caption">
                            {ct.user_role}
                        </Typography>
                        <br />
                        <Typography gutterBottom component="p" variant="h6">
                            {ct.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                            Average Rating:
                        </Typography>
                        <Rating name="read-only" value={Number(ct.ratings)} readOnly />
                    </CardContent>
                </Container>
            </CardActionArea>
        </Card>
    </Grid>;
}

export default StarPerformerCard;