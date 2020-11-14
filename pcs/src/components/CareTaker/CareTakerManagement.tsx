import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { bindActionCreators } from 'redux';

import {
    Avatar, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, Grid, IconButton, Tooltip, Typography
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PetsIcon from '@material-ui/icons/Pets';
import StarIcon from '@material-ui/icons/Star';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import WorkIcon from '@material-ui/icons/Work';

import { AppContext } from '../../contexts/AppContext';
import {
    acceptBid, Bid, confirmBid, deleteBid, getBidsOfCareTaker, getBidsOfCareTakerStatus,
    getCareTaker, getCareTakerAverageRatings, PetCategory
} from '../../database/CareTakerManager';
import { bidWithStatus } from '../../database/DataFilter';
import { notifyFailure, notifySuccess } from './CareTakerHelper';
import { useStyles } from './CareTakerStyle';

const PagePetManagement = () => {
  const classes = useStyles();
  const { user } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(true);
  const [pendingBids, setPendingBids] = useState<Bid[]>([]);
  const [acceptedBids, setAcceptedBids] = useState<any[]>([]);
  const [confirmedBids, setConfirmedBids] = useState<any[]>([]);
  const [upcomingOngoingBids, setUpcomingOngoingBids] = useState<any[]>([]);
  const [ratings, setRatings] = useState(5);
  const [openAcceptBidDialog, setOpenAcceptBidDialog] = useState(false);
  const [openRejectBidDialog, setOpenRejectBidDialog] = useState(false);
  const [openConfirmBidDialog, setOpenConfirmBidDialog] = useState(false);
  const [openSuccessBidDialog, setOpenSuccessBidDialog] = useState(false);
  const [row, setRow] = useState<any>({});
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
        const allBids = await getBidsOfCareTaker(user.email);
        const ratings = await getCareTakerAverageRatings(user.email);
        const pendingData = allBids.filter((bid) => { return bid.status === 'Pending'; });
        const acceptedData = allBids.filter((bid) => { return bid.status === 'Accepted' || bid.status === 'Reassigned'; });
        const confirmedData = allBids.filter((bid) => { return bid.status === 'Confirmed'; });

        setPendingBids(pendingData);
        setAcceptedBids(acceptedData);
        const completedBidsWithStatus = bidWithStatus(confirmedData);
        setConfirmedBids(completedBidsWithStatus);
        const upcomingOngoingData = completedBidsWithStatus.filter((bid) => { return bid.datestatus != 'Completed' });
        setUpcomingOngoingBids(upcomingOngoingData);

        let c = 0, o = 0, u = 0;
        completedBidsWithStatus.forEach(x => {
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
    // let isFT = false;
    // if (user) {
    //   const role = user.user_role;
    //   isFT = role.includes("FT");

    //   // If FT, check length of ongoing pet care
    //   if (isFT) {
    //     if (acceptedBids.length + upcomingOngoingBids.length >= 5) {
    //       alert("Cannot take care of more than 5 pets");
    //       return;
    //     } else {
    //       _acceptBidHelper(user, row);
    //     }
    //   } else {
    //     // If PT, Check rating
    //     if (Math.fround(ratings) >= 4.00) {
    //       if (acceptedBids.length >= 5) {
    //         notifyFailure("Cannot take care of more than 5 pets");
    //         return;
    //       } else {
    //         _acceptBidHelper(user, row);
    //       }
    //     } else {
    // 	  // If bad => can only accept 2
    //       if (acceptedBids.length + upcomingOngoingBids.length >= 2) {
    //         notifyFailure("Cannot take care of more than 2 pets");
    //         return;
    //       } else {
    _acceptBidHelper(user, row);
    //       }
    //     }
    //   }
    // }
  };

  const _acceptBidHelper = async (user, row) => {
    setLoading(true);
    setOpenAcceptBidDialog(false);
    const { po_email, pet_name, start_date } = row;
    const acceptSuccess = await acceptBid(po_email, pet_name, user.email, start_date);
    console.log(acceptSuccess);
    if (acceptSuccess) {
      // Load the new data
      getIsCareTaker();
      notifySuccess("You have successfully accepted the bid");
      setOpenSuccessBidDialog(true);
    } else {
      setLoading(false);
      notifyFailure("Failed to accept bid");
    }
  }

  const openRejectBidDialogBox = (row) => {
    setRow(row);
    setOpenRejectBidDialog(true);
  }

  const onRejectBidClick = async () => {
    setLoading(true);
    setOpenRejectBidDialog(false);
    const rejectSuccess = await deleteBid(row.po_email, row.pet_name, user!.email, row.start_date);
    if (rejectSuccess) {
      getIsCareTaker();
      notifySuccess("You have successfully rejected the bid");
    } else {
      setLoading(false);
      notifyFailure("Failed to reject bid");
    }
  }

  const openConfirmBidDialogBox = (row) => {
    setRow(row);
    setOpenConfirmBidDialog(true);
  }

  const onConfirmBidClick = async () => {
    setLoading(true);
    setOpenConfirmBidDialog(false);
    const confirmSuccess = await confirmBid(row.po_email, row.pet_name, user!.email, row.start_date);
    if (confirmSuccess) {
      getIsCareTaker();
      notifySuccess("You have successfully confirmed the bid");
    } else {
      setLoading(false);
      notifyFailure("Failed to confirm bid");
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
      name: 'Transfer Method',
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
      name: 'Actions',
      selector: 'accepted',
      cell: (row: any) => (row.accepted ? null :
        <div>
          <Grid container alignItems="center">
            <Tooltip title="Accept Bid">
              <IconButton onClick={() => openAcceptBidDialogBox(row)} size="small">
                <CheckIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Reject Bid">
              <IconButton onClick={() => openRejectBidDialogBox(row)} size="small">
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Grid>
        </div>
      ),
      ignoreRowClick: true,
    }
  ];

  const acceptedPetCareColumns = [
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
      name: 'End Date',
      sortable: false,
      selector: 'end_date'
    },
    {
      name: 'Transfer Method',
      sortable: false,
      selector: 'pet_transfer_method'
    },
    {
      name: 'Total Cost',
      sortable: true,
      selector: 'total_cost',
      format: row => "$" + row.total_cost
    },
    {
      name: 'Actions',
      selector: 'confirmed',
      cell: (row: any) => (row.accepted ? null :
        <div>
          <Grid container alignItems="center">
            <Tooltip title="Confirm Bid">
              <IconButton onClick={() => openConfirmBidDialogBox(row)} size="small">
                <CheckIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Reject Bid">
              <IconButton onClick={() => openRejectBidDialogBox(row)} size="small">
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Grid>
        </div>
      ),
      ignoreRowClick: true,
    }
  ];

  const confirmedPetCareColumns = [
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
      name: 'Transfer Method',
      sortable: false,
      selector: 'pet_transfer_method'
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
      format: row => <b style={{ color: row.datestatus === 'Upcoming' ? 'gold' : row.datestatus === 'Ongoing' ? 'green' : 'orange' }}>{row.datestatus}</b>
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
          {/* </Grid> */}

          <Box display={user ?.user_role === 'PT' || user ?.user_role === 'PO-FT' ? "block" : "none"} margin={1} width="100%">
            <Grid container spacing={2} alignItems="stretch">
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
                          data={pendingBids}
                          noHeader
                          defaultSortField='start_date'
                          pagination={true}
                          paginationPerPage={5}
                          paginationRowsPerPageOptions={[5, 10, 20]}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* <Grid container spacing={2} alignItems="stretch"> */}
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
                      columns={acceptedPetCareColumns}
                      data={acceptedBids}
                      noHeader
                      defaultSortField='start_date'
                      pagination={true}
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 20]}
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
                  CONFIRMED PET CARE JOBS
            </Typography>
                <Divider />
                <Grid container spacing={1}>
                  <Grid container item lg={12}>
                    <DataTable
                      className="dataTables_wrapper"
                      columns={confirmedPetCareColumns}
                      data={confirmedBids}
                      noHeader
                      pagination={true}
                      defaultSortAsc={false}
                      defaultSortField='datestatus'
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
              <Button variant="outlined" color="secondary" onClick={() => setOpenAcceptBidDialog(false)}>
                Cancel
                </Button>
              <Button variant="contained" color="primary" onClick={onAcceptBidClick}>
                Accept
                </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <Dialog open={openRejectBidDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Reject Bid Confirmation</DialogTitle>
            <DialogContent dividers>
              Are you sure you want to reject this bid?
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="secondary" onClick={() => setOpenRejectBidDialog(false)}>
                Cancel
                </Button>
              <Button variant="contained" color="primary" onClick={onRejectBidClick}>
                Reject
                </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <Dialog open={openConfirmBidDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Bid Confirmation</DialogTitle>
            <DialogContent dividers>
              Are you sure you want to confirm this bid?<br></br>
              You are not allowed to reject this bid after confirmation.
			</DialogContent>
            <DialogActions>
              <Button variant="outlined" color="secondary" onClick={() => setOpenConfirmBidDialog(false)}>
                Cancel
				</Button>
              <Button variant="contained" color="primary" onClick={onConfirmBidClick}>
                I am sure!
				</Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <Dialog open={openSuccessBidDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Bid Accepted!</DialogTitle>
            <DialogContent dividers>
              You have accepted this bid! Chat with the pet owner before you confirm this bid!
				</DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={() => setOpenSuccessBidDialog(false)}>
                Confirm
					</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
};

export default PagePetManagement;
