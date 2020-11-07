import React, { useContext, useState } from "react";
import { Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { AppContext } from "../../contexts/AppContext";
import { useStyles } from "./PetOwnerStyle";
import {
  insertPetOwns,
  updatePetOwns,
  deletePetOwns,
} from "../../database/PetOwnsManager";
import { PetOwnerContext } from "../../contexts/PetOwnerContext";

const PetForm = (props) => {
  const { type, pet, endForm, closeDialog, refresh, updateSelectedPet } = props;
  const { user } = useContext(AppContext);
  const { notifySuccess, notifyDanger } = useContext(AppContext);
  const { petCategories } = useContext(PetOwnerContext);
  const categories = petCategories.map((c) => c.category);
  const poStyle = useStyles();

  const [data, setData] = useState(pet ? pet : {
    po_email: "",
    name: "",
    category: "",
    special_requirement: ""
  });

  const [errorName, setErrorName] = useState(false);
  const [errorCat, setErrorCat] = useState(false);
  let fieldVariant = "standard";
  if (type === "Add") fieldVariant = "standard";
  else if (type === "Edit") fieldVariant = "filled";

  const [showDialog, setShowDialog] = useState(false);
  const openAlert = () => setShowDialog(true);
  const closeAlert = () => setShowDialog(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.category || !user) {
      if (!data.name) setErrorName(true);
      if (!data.category) setErrorCat(true);
      if (!user) notifyDanger("Not logged in");
    } else {
      data.po_email = user.email;

      let result = [];
      if (type === "Add") result = await insertPetOwns(data);
      else if (type === "Edit") result = await updatePetOwns(data);

      if (result) {
        let success = "hey there";
        if (type === "Add") {
          success = "Pet added";
          await refresh();
        } else if (type === "Edit") {
          success = "Pet edited";
          await updateSelectedPet(data);
          refresh();
        }
        endForm();
        notifySuccess(success);
      } else {
        notifyDanger("Error updating pet.");
      }
    }
  };

  const handleDelete = async () => {
    closeAlert();
    data.po_email = user.email;
    const result = await deletePetOwns(data);
    if(result) {
      notifySuccess("Pet deleted");
      await refresh();
      endForm();
      closeDialog();
    } else {
      notifyDanger("Delete failed");
    }
  };

  const handleChange = (key) => (e) => {
    const newData = { ...data };
    newData[key] = e.target.value;
    setData(newData);
  };

  return (
    <>
      <form
        noValidate
        className={`${poStyle.petForm} ${poStyle.editForm}`}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div>
          <TextField
            required
            disabled={type === "Edit"}
            error={errorName}
            label="Name"
            variant={fieldVariant}
            value={data.name}
            onChange={handleChange("name")}
          />
        </div>
        <div>
          <TextField
            select
            required
            error={errorCat}
            label="Category"
            variant={fieldVariant}
            value={data.category}
            onChange={handleChange("category")}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <TextField
            label="Special requirement"
            variant={fieldVariant}
            value={data.special_requirement}
            onChange={handleChange("special_requirement")}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" color="primary">
            {type}
          </Button>
          <Button variant="contained" onClick={endForm}>
            Cancel
          </Button>
        </div>
        <div>
          <Button onClick={openAlert} variant="contained" color="secondary">
            Delete
          </Button>
        </div>
      </form>

      <Dialog open={showDialog} onClose={closeAlert}>
        <DialogTitle>{"Delete pet?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlert} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PetForm;
