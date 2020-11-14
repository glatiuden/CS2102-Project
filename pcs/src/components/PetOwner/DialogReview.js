import React, { useContext, useState, useEffect } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Avatar
} from "@material-ui/core";
import { AppContext } from "../../contexts/AppContext";
import { MainContext } from "../../contexts/MainContext";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { updateReview } from "../../database/PetOwnsManager";
import Rating from '@material-ui/lab/Rating';
import CTPP from '../../assets/CTPP.png';
import { getCareTakerByEmail } from "../../database/CareTakerManager";

const DialogReview = (props) => {
    const { isOpen, onClose, bid } = props;
    const [data, setData] = useState({
        rating: 5,
        review: "",
    });
    const mainStyle = useContext(MainContext).classes;
    const { notifySuccess, notifyDanger } = useContext(AppContext);
    const [ct, setCt] = useState({});
    useEffect(() => {
        if (bid) {
            setData({ rating: bid.rating ? bid.rating : 5, review: bid.review ? bid.review : "" });
            if (bid.ct_email)
                getCareTakerByEmail(bid.ct_email).then(result => {
                    if (result)
                        setCt(result)
                });
        }
    }, [bid]);

    const handleChange = (key) => (e) => {
        const newData = { ...data };
        newData[key] = e.target.value;
        setData(newData);
    };

    const handleSubmit = async () => {
        if (data.rating && data.review) {
            bid.rating = data.rating;
            bid.review = data.review;
            let result = updateReview(bid);
            if (result) {
                notifySuccess("Review successfully posted!");
                onClose();
            } else {
                notifyDanger("Review post failed");
            }
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth={true}>
            <DialogTitle className={mainStyle.dialogTitle}>
                Review Caretaker
            <IconButton aria-label="close" className={mainStyle.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={mainStyle.center} dividers>
                <Avatar
                    alt={bid.ct_email}
                    src={CTPP}
                    className={mainStyle.largeAvatar}
                />
                <br />
                <Typography gutterBottom variant="h6">
                    {ct.name}
                </Typography>
                <Typography component="legend">Rating</Typography>
                <Rating
                    name="simple-controlled"
                    value={data.rating}
                    onChange={(event, newValue) => {
                        const newData = { ...data };
                        newData.rating = newValue;
                        setData(newData);
                    }}
                />
                <TextField
                    labelId="reviewLabel"
                    value={data.review}
                    multiline
                    rows={4}
                    onChange={handleChange("review")}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Review"
                    name="review"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel</Button>
                <Button onClick={handleSubmit} color="primary" variant="outlined">
                    Post
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogReview;
