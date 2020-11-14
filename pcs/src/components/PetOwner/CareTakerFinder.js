import moment from 'moment';
import React, { useContext, useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

import {
    Button, Dialog, DialogContent, DialogTitle, Grid, InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';

import { AppContext } from '../../contexts/AppContext';
import { MainContext } from '../../contexts/MainContext';
import {
    insertBid, searchCareTakerByAll, searchCareTakerByCategory
} from '../../database/PetOwnsManager';

const CareTakerFinder = (props) => {
    const { pet, refreshBids } = props;
    const mainStyle = useContext(MainContext).classes;
    const { notifySuccess, notifyDanger } = useContext(AppContext);
    const [data, setData] = useState({
        startDate: moment().add(1, 'day').format("YYYY-MM-DD"),
        endDate: moment().add(1, 'day').format("YYYY-MM-DD"),
        transfer: "Pet Owner Deliver",
        payment: "Cash"
    });
    const [result, setResult] = useState([]);
    const [sdError, setSdError] = useState(false);
    const [edError, setEdError] = useState(false);
    const [row, setRow] = useState({});
    const [bidDialog, setBidDialog] = useState(false);

    const refresh = async () => {
        let list = [];
        if (pet.searchAll) {
            list = await searchCareTakerByAll(
                data.startDate,
                data.endDate,
                pet.po_email
            );
        } else {
            list = await searchCareTakerByCategory(
                data.startDate,
                data.endDate,
                pet.category,
                pet.po_email,
                pet.name
            );
        }
        if (list) setResult(list);
    };

    useEffect(() => {
        if (pet) setResult([]);
    }, [pet]);

    const handleChange = (key) => (e) => {
        const newData = { ...data };
        newData[key] = e.target.value;
        setData(newData);
        if (moment(newData.endDate).isBefore(newData.startDate)
            || moment(newData.startDate).isBefore(moment().add(1, 'day'), 'day')) {
            setSdError(true);
            setEdError(true);
        } else {
            setSdError(false);
            setEdError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let list = [];
        if (!sdError && !edError) {
            if (pet.searchAll) {
                list = await searchCareTakerByAll(
                    data.startDate,
                    data.endDate,
                    pet.po_email
                );
            } else {
                list = await searchCareTakerByCategory(
                    data.startDate,
                    data.endDate,
                    pet.category,
                    pet.po_email,
                    pet.name
                );
            }
            if (list) setResult(list);
        }
    };

    const openDialog = () => {
        setBidDialog(true);
    };

    const closeDialog = () => {
        setBidDialog(false);
    };

    const handleBidRow = row => {
        openDialog();
        setRow(row);
    };

    const handleBid = async () => {
        let result = await insertBid(pet, row, data.startDate, data.endDate, data.transfer, data.payment);
        if (result) {
            await refresh();
            await refreshBids();
            notifySuccess("Bid successful!");
            closeDialog();
        } else {
            notifyDanger("Bid failed!");
            closeDialog();
        }
    }

    const columns = [
        {
            name: "Care Taker",
            selector: "name",
            sortable: true,
        },
        {
            name: "Email",
            selector: "email",
            sortable: true,
        },
        {
            name: "Address",
            selector: "address",
            sortable: true,
        },
        {
            name: "Ratings",
            selector: "ratings",
            sortable: true,
        },
        {
            name: "FT/PT",
            selector: "user_role",
            sortable: true,
        },
        {
            name: "Cost",
            selector: "total_cost",
            sortable: true
        },
        {
            name: "Action",
            sortable: false,
            cell: (row) => (
                <div>
                    <Grid container alignItems="center">
                        <Button onClick={() => handleBidRow(row)} variant="contained" color="primary">Bid</Button>
                    </Grid>
                </div>
            ),
            ignoreRowClick: true,
            selector: "category",
            grow: 0,
        },
    ];

    return (
        <>
            <h3 className={mainStyle.center}>Find Caretaker</h3>
            <form noValidate onSubmit={handleSubmit}>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <TextField
                            required
                            autoFocus
                            label="Start Date"
                            name="startDate"
                            type="date"
                            error={sdError}
                            value={data.startDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange("startDate")}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            autoFocus
                            label="End Date"
                            name="endDate"
                            type="date"
                            error={edError}
                            value={data.endDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange("endDate")}
                        />
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                            Find
            </Button>
                    </Grid>
                </Grid>
            </form>
            <Grid container>
                <DataTable
                    className="dataTables_wrapper"
                    columns={columns}
                    data={result}
                    noHeader
                    defaultSortField="index"
                    pagination={true}
                />
            </Grid>

            <Dialog
                open={bidDialog}
                onClose={closeDialog}
                maxWidth="sm"
                fullWidth={true}
            >
                <DialogTitle className={mainStyle.dialogTitle}>Create Bid</DialogTitle>
                <DialogContent>
                    <InputLabel id="paymentLabel">Payment</InputLabel>
                    <Select
                        labelId="paymentLabel"
                        value={data.payment}
                        onChange={handleChange("payment")}
                        style={{ marginBottom: 25 }}
                    >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                    </Select>

                    <InputLabel id="transferLabel">Transfer</InputLabel>
                    <Select
                        labelId="transferLabel"
                        value={data.transfer}
                        style={{ marginBottom: 25 }}
                        onChange={handleChange("transfer")}
                    >
                        <MenuItem value="Pet Owner Deliver">Pet Owner Deliver</MenuItem>
                        <MenuItem value="Caretaker Pick Up">Caretaker Pick Up</MenuItem>
                        <MenuItem value="PCS Building Transfer">PCS Building Transfer</MenuItem>
                    </Select>
                    <div>
                        <Button onClick={handleBid} variant="contained" color="primary">Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CareTakerFinder;
