import React, { useContext } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import { MainContext } from '../../contexts/MainContext';
import PetForm from './PetForm.js';

const DialogAddPet = (props: any) => {
  const { isOpen, onClose, refresh, categories } = props;
  const mainStyle = useContext(MainContext).classes;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle className={mainStyle.dialogTitle}>Add New Pet</DialogTitle>
      <DialogContent>
        <PetForm type="Add" endForm={onClose} refresh={refresh} categories={categories} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddPet;
