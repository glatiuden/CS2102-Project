import React, { useContext, useState } from "react";
import { TextField, Button, Grid, Select, InputLabel, MenuItem } from "@material-ui/core";
import moment from "moment";
import { searchCareTakerByCategory, getBidsByPetOwns, insertBid } from "../../database/PetOwnsManager";
import DataTable from "react-data-table-component";
import { link } from "fs";

const CareTakerFinder = (props) => {
  const { pet } = props;
  const [data, setData] = useState({
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    payment: "cash"
  });
  const [result, setResult] = useState([]);
  const [sdError, setSdError] = useState(false);
  const [edError, setEdError] = useState(false);

  const refresh = async () => {
    let list =  await searchCareTakerByCategory(data.startDate, data.endDate, pet.category);
    if(list)  setResult(list);
  }

  const handleChange = (key) => (e) => {
    const newData = { ...data };
    newData[key] = e.target.value;
    setData(newData);
    if (moment(newData.endDate).isBefore(newData.startDate)) {
      setSdError(true);
      setEdError(true);
    } else {
      setSdError(false);
      setEdError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sdError && !edError) {
      let list = await searchCareTakerByCategory(
        data.startDate,
        data.endDate,
        pet.category
      );
      console.dir(list);
      if (list) setResult(list);
    }
  };

  const handleBid = async row => {
    await insertBid(pet, row, data.startDate, data.endDate, data.payment);
    await refresh();
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
      sortable: true
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
      name: "Action",
      sortable: false,
      cell: row => (
        <div>
          <Grid container alignItems="center">
            <Button onClick={() => handleBid(row)} variant="contained" color="primary">
              Bid
            </Button>
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
        {/* <InputLabel id="label">Payment</InputLabel>
        <Select labelId="label" value={data.payment} onChange={handleChange("payment")}>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="credit">Credit card</MenuItem>
        </Select> */}
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
      {/* <Grid container>
          <DataTable
            className="dataTables_wrapper"
            columns={columns}
            data={result}
            noHeader
            defaultSortField="index"
            pagination={true}
          />
      </Grid> */}
    </>
  );
};

export default CareTakerFinder;
