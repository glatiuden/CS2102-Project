import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem
} from "@material-ui/core";

import { MainContext } from "../../contexts/MainContext";
import { useStyles } from "./PetOwnerStyle";
import { insertPetOwns } from "../../database/PetOwnsManager"
import { AppContext } from "../../contexts/AppContext";
import PetForm from "./PetForm.js";

const DialogAddPet = (props: any) => {
  let { isOpen, onClose, refresh, categories } = props;
  categories = categories.map((c) => c.category);
  const mainStyle = useContext(MainContext).classes;
  const poStyle = useStyles();

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle className={mainStyle.dialogTitle}>Add new pet</DialogTitle>
      <DialogContent>
        <PetForm type="Add" endForm={onClose} refresh={refresh}/>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddPet;
