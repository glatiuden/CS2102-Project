import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Avatar, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, Grid, Typography
} from '@material-ui/core';
import PetsIcon from '@material-ui/icons/Pets';
import StarIcon from '@material-ui/icons/Star';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import WorkIcon from '@material-ui/icons/Work';

import { AppContext } from '../../contexts/AppContext';
import {
    acceptBid, Bid, getBidsOfCareTakerStatus, getCareTaker, getCareTakerAverageRatings, PetCategory
} from '../../database/CareTakerManager';
import { bidWithStatus } from '../../database/DataFilter';
import { useStyles } from './CareTakerStyle';

const PagePetManagement = () => {
  const classes = useStyles();
  const { user } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(true);
  const [aBids, setaBids] = useState<Bid[]>([]);
  const [oBids, setoBids] = useState<any[]>([]);
  const [ratings, setRatings] = useState(5);
  const [openAcceptBidDialog, setOpenAcceptBidDialog] = useState(false);
  const [row, setRow] = useState({});
  const [barCount, setBarCount] = useState({
    ongoing: 0,
    upcoming: 0,
    completed: 0,
  })
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    getIsCareTaker();
  };

  const getIsCareTaker = async () => {
    if (user) {
      const ct = await getCareTaker(user.email);
      if (ct) {
        const bids1 = await getBidsOfCareTakerStatus(user.email, 'Pending');
        const bids2 = await getBidsOfCareTakerStatus(user.email, 'Accepted');
        const ratings = await getCareTakerAverageRatings(user.email);
        setaBids(bids1);
        const bidsWStatus = bidWithStatus(bids2);
        setoBids(bidsWStatus);
        let c = 0, o = 0, u = 0;
        bidsWStatus.forEach(x => {
          if (x.datestatus === 'Completed')
            c++;
          else if (x.datestatus === 'Ongoing')
            o++;
          else if (x.datestatus === 'Upcoming')
            u++;
        });
        setBarCount({ completed: c, ongoing: o, upcoming: u });
        setRatings(ratings);
      }
      setLoading(false);
    }
  };

  const openAcceptBidDialogBox = (row) => {
    setRow(row);
    setOpenAcceptBidDialog(true);
  }

  const onAcceptBidClick = async () => {
    let isFT = false;
    if (user) {
      const role = user.user_role;
      isFT = role.includes("FT");

      // If FT, check length of ongoing pet care
      if (isFT) {
        if (oBids.length >= 5) {
          alert("Cannot take care of more than 5 pets");
          return;
        } else {
          _acceptBidHelper(user, row);
        }
      } else {
        // If PT, Check rating
        if (Math.fround(ratings) >= 4.00) {
          if (oBids.length >= 5) {
            alert("Cannot take care of more than 5 pets");
            return;
          } else {
            _acceptBidHelper(user, row);
          }
        } else {
          // If bad => can only accept 2
          if (oBids.length >= 2) {
            alert("Cannot take care of more than 2 pets");
            return;
          } else {
            _acceptBidHelper(user, row);
          }
        }
      }
    }
  };

  const _acceptBidHelper = async (user, row) => {
    setLoading(true);
    setOpenAcceptBidDialog(false);
    const { po_email, pet_name, start_date } = row;
    const acceptSuccess = await acceptBid(po_email, pet_name, user.email, start_date);
    if (acceptSuccess) {
      // Load the new data
      getIsCareTaker();
    } else {
      setLoading(false);
      alert("Failed to accept bid");
    }
  }

  const bidsForMeColumns = [
    {
      name: 'Pet Name',
      sortable: false,
      selector: 'pet_name'
    },
    {
      name: 'PO Email',
      sortable: false,
      selector: 'po_email'
    },
    {
      name: 'Start Date',
      sortable: true,
      selector: 'start_date'
    },
    {
      name: 'Number of Days',
      selector: 'number_of_days',
      sortable: true
    },
    {
      name: 'Pet Transfer Method',
      sortable: false,
      selector: 'pet_transfer_method'
    },
    {
      name: 'Payment Method',
      sortable: false,
      selector: 'payment_method'
    },
    {
      name: 'Total Cost',
      sortable: true,
      selector: 'total_cost',
      format: row => "$" + row.total_cost
    },
    {
      name: '',
      selector: 'accepted',
      cell: (row: any) => (row.accepted ? null : <Button onClick={() => openAcceptBidDialogBox(row)} color="primary">Accept Bid</Button>),
      ignoreRowClick: true,
    }
  ];

  const ongoingPetCareColumns = [
    {
      name: 'Pet Name',
      sortable: false,
      selector: 'pet_name'
    },
    {
      name: 'PO Email',
      sortable: false,
      selector: 'po_email'
    },
    {
      name: 'Start Date',
      sortable: false,
      selector: 'start_date'
    },
    {
      name: 'End Date',
      sortable: false,
      selector: 'end_date'
    },
    {
      name: 'Total Cost',
      sortable: true,
      selector: 'total_cost',
      format: row => "$" + row.total_cost
    },
    {
      name: 'Status',
      sortable: true,
      selector: 'datestatus',
      format: row => <b style={{ color: row.datestatus === 'Upcoming' ? 'orange' : row.datestatus === 'Ongoing' ? 'green' : 'green' }}>{row.datestatus}</b>
    }
  ];

  return loading ? <CircularProgress />
    : (
      <>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={3}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Grid
                  container
                  justify="space-between"
                  spacing={3}
                >
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h6"
                    >
                      ONGOING JOB
                            </Typography>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      {barCount.ongoing}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <WorkIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Grid
                  container
                  justify="space-between"
                  spacing={3}
                >
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h6"
                    >
                      UPCOMING JOB
                            </Typography>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      {barCount.upcoming}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatarOrange}>
                      <PetsIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Grid
                  container
                  justify="space-between"
                  spacing={3}
                >
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h6"
                    >
                      COMPLETED JOB
                    </Typography>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      {barCount.completed}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatarGreen}>
                      <ThumbUpIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Grid
                  container
                  justify="space-between"
                  spacing={3}
                >
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h6"
                    >
                      MY AVERAGE RATINGS
                    </Typography>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      {ratings} / 5
                </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <StarIcon />
                    </Avatar>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            {/* Only displays bids that have yet to be accepted here */}
            <Card style={{ width: '100%' }}>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="h6"
                >
                  PENDING BIDS
            </Typography>
                <Divider />
                <Grid container spacing={1}>
                  <Grid container item lg={12}>
                    <DataTable
                      className="dataTables_wrapper"
                      columns={bidsForMeColumns}
                      data={aBids}
                      noHeader
                      defaultSortField="index"
                      pagination={true}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            {/* Only displays bids that are currently ongoing */}
            <Card style={{ width: '100%' }}>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="h6"
                >
                  ACCEPTED PET CARE JOBS
            </Typography>
                <Divider />
                <Grid container spacing={1}>
                  <Grid container item lg={12}>
                    <DataTable
                      className="dataTables_wrapper"
                      columns={ongoingPetCareColumns}
                      data={oBids}
                      noHeader
                      defaultSortField="index"
                      pagination={true}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box>
          <Dialog open={openAcceptBidDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Accept Bid Confirmation</DialogTitle>
            <DialogContent dividers>
              Are you sure you want to accept this bid?
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpenAcceptBidDialog(false)} color="secondary">
                Cancel
                </Button>
              <Button variant="outlined" onClick={onAcceptBidClick}>
                Accept
                </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
};

export default PagePetManagement;
