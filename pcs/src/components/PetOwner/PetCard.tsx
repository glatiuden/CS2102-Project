import React, { useContext } from 'react';

import {
    Avatar, Card, CardActionArea, CardContent, Container, Grid, Typography
} from '@material-ui/core';

import { MainContext } from '../../contexts/MainContext';
import { useStyles } from './PetOwnerStyle';
import { getPPByCategory } from './ProfileImageHelper';

const PetCard = (props) => {
    const { pet, onClick } = props;
    const mainStyle = useContext(MainContext).classes;
    const poStyle = useStyles();

    return <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={pet.name}>
        <Card className={poStyle.petCard} elevation={3}>
            <CardActionArea onClick={() => onClick(pet)}>
                <Container className={mainStyle.center}>
                    <div>
                        <Avatar alt={pet.name} src={getPPByCategory(pet.category)} className={mainStyle.largeAvatar} />
                    </div>
                    <CardContent>
                        <Typography variant="caption">
                            {pet.category}
                        </Typography>
                        <br />
                        <Typography gutterBottom component="p" variant="h5">
                            {pet.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                            Special Requirement:
                        <br />
                            {pet.special_requirement}
                        </Typography>
                    </CardContent>
                </Container>
            </CardActionArea>
        </Card>
    </Grid>;
}

export default PetCard;