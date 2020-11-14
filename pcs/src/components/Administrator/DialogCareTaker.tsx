import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import { Avatar, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Rating from '@material-ui/lab/Rating';

import CareTakerProfile from '../../assets/CareTakerProfile.png';
import { MainContext } from '../../contexts/MainContext';
import { getCareTakerAverageRatingsWithCount, getReviews } from '../../database/CareTakerManager';

const DialogCareTaker = (props: any) => {
    const { isOpen, onClose, ct } = props;
    const { classes } = useContext(MainContext);
    const [reviews, setReviews] = useState<any[]>([]);
    const [ratings, setRatings] = useState({
        ratings: 0,
        counts: 0
    });

    const reviewsColumn = [
        {
            name: 'Pet Owner Email',
            sortable: true,
            selector: 'po_email'
        },
        {
            name: 'Rating',
            sortable: true,
            selector: 'rating',
            cell: (row: any) => <Rating name="read-only" value={Number(row.rating)} readOnly />
        },
        {
            name: 'Review',
            sortable: false,
            selector: 'review',
            grow: 3
        }
    ];
    useEffect(() => {
        if (ct) {
            getReviews(ct.email).then((result) => {
                if (result) setReviews(result);
            });
            getCareTakerAverageRatingsWithCount(ct.email).then(result => {
                if (result) {
                    setRatings(result);
                }
            });
        }
    }, [ct]);

    return ct ? (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth={true}>
                <DialogTitle className={classes.dialogTitle}>
                    <Grid container justify="flex-start" spacing={0}>
                        <Grid item xs={2}>
                            <Avatar
                                alt={ct.name}
                                src={CareTakerProfile}
                                className={classes.ctAvatar}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="h6">{ct.name}</Typography>
                            <Typography variant="body1">{ct.email}</Typography>
                            <Typography variant="body2">
                                {ct.user_role}
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', }}>
                                {ct.ratings}{" "}<Rating value={Number(ct.ratings)} readOnly /> ({ratings.counts})</div>
                        </Grid>
                    </Grid>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <h3 className={classes.center}>Reviews Received</h3>
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            noHeader
                            columns={reviewsColumn}
                            data={reviews}
                            defaultSortField="index"
                            pagination={true}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    ) : null;
}
export default DialogCareTaker;
