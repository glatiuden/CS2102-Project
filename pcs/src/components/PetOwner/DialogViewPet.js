import React, { useContext, useState, useEffect } from "react";
import DataTable from "react-data-table-component";

import {
    Avatar,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';

import { MainContext } from "../../contexts/MainContext";
import { AppContext } from "../../contexts/AppContext";
import PetForm from "./PetForm.js";
import DialogReview from './DialogReview';
import CareTakerFinder from "./CareTakerFinder.js";
import { getBidsByPetOwns, deleteBid } from "../../database/PetOwnsManager";
import moment from "moment";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { getPPByCategory } from './ProfileImageHelper';

const DialogViewPet = (props) => {
    const { categories, isOpen, onClose, pet, refresh, updateSelectedPet } = props;
    const mainStyle = useContext(MainContext).classes;
    const { notifySuccess, notifyDanger } = useContext(AppContext);
    const [editMode, setEditMode] = useState(false);
    const [upcomingBids, setUpcomingBids] = useState([]);
    const [pendingBids, setPendingBids] = useState([]);
    const [pastBids, setPastBids] = useState([]);
    const [reviewDialog, setReviewDialog] = useState(false);
    const [currentReviewBid, setCurrentReviewBid] = useState({});

    const refreshBids = async () => {
        let result = await getBidsByPetOwns(pet);
        if(result && result.length > 0)
        {
            result = result.map(bid => ({
                ...bid,
                start_date: moment(bid.start_date).format('DD-MM-YYYY'),
                end_date: moment(bid.end_date).format('DD-MM-YYYY')
            }));
            setUpcomingBids(result.filter(bid => (bid.status === "Accepted" || bid.status === "Confirmed") && moment(bid.end_date, 'DD-MM-YYYY').isSameOrAfter(moment(), 'day')));
            setPendingBids(result.filter(bid => bid.status === "Pending"));
            setPastBids(result.filter(bid => bid.status === "Confirmed" && moment(bid.end_date, 'DD-MM-YYYY').isBefore(moment(), 'day')));
        } else {
            setUpcomingBids([]);
            setPendingBids([]);
            setPastBids([]);
        }

    };

    useEffect(() => {
        async function effect() {
            if (pet) await refreshBids();
        }
        effect();
    }, [pet]);

    const columns = [
        {
            name: "Care Taker",
            selector: "ct_email",
            sortable: true,
            grow: 1.5
        },
        {
            name: "Start Date",
            selector: "start_date",
            sortable: true,
            grow: 0.7
        },
        {
            name: "End Date",
            selector: "end_date",
            sortable: true,
            grow: 0.7
        },
        {
            name: "Transfer Method",
            selector: "pet_transfer_method",
            sortable: true,
            grow: 1
        },
        {
            name: "Payment Method",
            selector: "payment_method",
            sortable: true,
            grow: 0.6
        },
        {
            name: "Total Cost",
            selector: "total_cost",
            sortable: true,
            format: row => "$" + row.total_cost,
            grow: 0.6
        },
    ];

    const handleCancel = async row => {
        const result = await deleteBid(row);
        if (result) {
            notifySuccess("Bid cancelled!");
            refreshBids();
        } else notifyDanger("Unable to cancel");
    }

    const pendingColumns = [
        ...columns,
        {
            name: "Action",
            sortable: false,
            cell: (row) => (
                <div>
                    <Button
                        onClick={() => handleCancel(row)}
                        variant="contained"
                        size="small"
                        style={{ fontSize: "0.7rem" }}
                        color="secondary"
                    >
                        Cancel
            </Button>
                </div>
            ),
            ignoreRowClick: true,
            selector: "category",
            grow: 0,
        },
    ];

    const handleReview = row => {
        setReviewDialog(true);
        setCurrentReviewBid(row);
    }

    const pastColumns = [
        ...columns,
        {
            name: "Rating",
            sortable: false,
            cell: (row) =>
                <>
                    {
                        !row.rating ? <div>
                            <Grid container alignItems="center">
                                <Button
                                    onClick={() => handleReview(row)}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{ fontSize: "0.7rem" }}
                                >
                                    Review
                        </Button>
                            </Grid>
                        </div> : <Rating name="read-only" value={Number(row.rating)} readOnly size="small" />
                    }</>,
            ignoreRowClick: true,
            selector: "category",
            grow: 0.5,
        },
    ];


    return pet ? (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth={true}>
                <DialogTitle className={mainStyle.dialogTitle}>
                    <Grid container justify="flex-start" spacing={0}>
                        <Grid item md={2}>
                            <Avatar
                                alt={pet.name}
                                src={getPPByCategory(pet.category)}
                                className={mainStyle.largeAvatar}
                            />
                        </Grid>
                        <Grid item md={10}>
                            {!editMode && (
                                <div>
                                    <Typography variant="h6">{pet.name}</Typography>
                                    <Typography variant="body1">{pet.category}</Typography>
                                    <Typography variant="body2">
                                        <b>Special Requirements:</b> {pet.special_requirement}
                                    </Typography>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit
                                </Button>
                                </div>
                            )}
                            {editMode && (
                                <div>
                                    <PetForm
                                        type="Edit"
                                        pet={pet}
                                        refresh={refresh}
                                        updateSelectedPet={updateSelectedPet}
                                        endForm={() => setEditMode(false)}
                                        closeDialog={onClose}
                                        categories={categories}
                                    />
                                </div>
                            )}
                        </Grid>
                    </Grid>
                    <IconButton aria-label="close" className={mainStyle.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <CareTakerFinder pet={pet} refreshBids={refreshBids} />
                    <h3 className={mainStyle.center}>Accepted Bids</h3>
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={columns}
                            data={upcomingBids}
                            noHeader
                            defaultSortField="index"
                            pagination={true}
                        />
                    </Grid>
                    <h3 className={mainStyle.center}>Current Bids</h3>
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={pendingColumns}
                            data={pendingBids}
                            noHeader
                            defaultSortField="index"
                            pagination={true}
                        />
                    </Grid>
                    <h3 className={mainStyle.center}>Past Bids</h3>
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={pastColumns}
                            data={pastBids}
                            noHeader
                            defaultSortField="index"
                            pagination={true}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
            <DialogReview
                isOpen={reviewDialog}
                onClose={() => setReviewDialog(false)}
                bid={currentReviewBid}
            />
        </>
    ) : null;
};

export default DialogViewPet;
