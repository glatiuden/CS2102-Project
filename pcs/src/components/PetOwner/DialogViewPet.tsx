import React, { useContext, useState } from "react";
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

import { MainContext } from "../../contexts/MainContext";
import PetForm from "./PetForm.js";
import CareTakerFinder from "./CareTakerFinder.js";
import { useStyles } from "./PetOwnerStyle";

const DialogViewPet = (props: any) => {
  const { isOpen, onClose, pet, refresh, updateSelectedPet } = props;
  const mainStyle = useContext(MainContext).classes;
  const poStyle = useStyles();
  const [editMode, setEditMode] = useState(false);

  const columns = [
    {
      name: "Care Taker",
      selector: "ct_email",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: "start_date",
      sortable: true,
    },
    {
      name: "Number of Days",
      selector: "number_of_days",
      sortable: true,
    },
    {
      name: "Status",
      selector: "accepted",
      sortable: true,
    },
    {
      name: "Transfer Method",
      selector: "pet_transfer_method",
      sortable: true,
    },
    {
      name: "Payment Method",
      selector: "payment_method",
      sortable: true,
    },
    {
      name: "Total Cost",
      selector: "total_cost",
      sortable: true,
    },
  ];
  return pet ? (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth={true}>
        <DialogTitle className={mainStyle.dialogTitle}>
          <Grid container justify="flex-start" spacing={0}>
            <Grid item md={3}>
              <Avatar
                alt={pet.name}
                src={
                  "https://www.businesstimes.com.sg/sites/default/files/styles/large_popup/public/image/2020/01/11/BT_20200111_PG1BRUNCHREVISE_4002715-1.jpg?itok=KVXsWuAL"
                }
                className={mainStyle.largeAvatar}
              />
            </Grid>
            <Grid item md={7}>
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
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <h3 className={mainStyle.center}>Find care taker</h3>

            <CareTakerFinder pet={pet}/>

          <h3 className={mainStyle.center}>Recent Activities</h3>
          <Grid container item lg={12}>
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={[]}
              noHeader
              defaultSortField="index"
              pagination={true}
            />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default DialogViewPet;
