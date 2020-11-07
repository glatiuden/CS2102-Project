import React, { useContext } from 'react';

import {
    Avatar, Card, CardActionArea, CardContent, Container, Grid, Typography
} from '@material-ui/core';

import { MainContext } from '../../contexts/MainContext';
import { useStyles } from './PetOwnerStyle';

const PetCard = (props) => {
    const { pet, onClick } = props;
    const mainStyle = useContext(MainContext).classes;
    const poStyle = useStyles();

    return <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={pet.name}>
        <Card className={poStyle.petCard} elevation={3}>
            <CardActionArea onClick={() => onClick(pet)}>
                <Container className={mainStyle.center}>
                    <div>
                        <Avatar alt={pet.name} src={'https://www.businesstimes.com.sg/sites/default/files/styles/large_popup/public/image/2020/01/11/BT_20200111_PG1BRUNCHREVISE_4002715-1.jpg?itok=KVXsWuAL'} className={mainStyle.largeAvatar} />
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