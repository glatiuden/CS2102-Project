import React, { useEffect, useState } from 'react';

import { Button, Grid, InputLabel, MenuItem, Paper, Select } from '@material-ui/core';

import { AppContext } from '../../contexts/AppContext';
import { PetOwnerContext } from '../../contexts/PetOwnerContext';
import { getPetCategory, PetCategory } from '../../database/PetCategoryManager';
import { getPetOwns, PetOwns } from '../../database/PetOwnsManager';
import DialogAddPet from './DialogAddPet';
import DialogViewPet from './DialogViewPet';
import PetCard from './PetCard';
import { useStyles } from './PetOwnerStyle';

const PagePetManagement = () => {
  const { user, isAuthenticated } = React.useContext(AppContext);
  const { petCategories, setPetCategories } = React.useContext(PetOwnerContext);
  const poStyle = useStyles();

  const [pets, setPets] = useState<PetOwns[]>([]);
  const [petCategory, setPetCategory] = useState<PetCategory>(
    new PetCategory("")
  );
  const [viewPetDialog, setViewPetDialog] = useState<boolean>(false);
  const [addPetDialog, setAddPetDialog] = useState<boolean>(false);
  const [selectedPet, setSelectedPet] = useState<any>(undefined);

  const openViewPetDialog = (pet) => {
    setSelectedPet(pet);
    setViewPetDialog(true);
  };

  const closeViewPetDialog = () => {
    setViewPetDialog(false);
  };

  const openAddPetDialog = () => {
    setAddPetDialog(true);
  };

  const closeAddPetDialog = () => {
    setAddPetDialog(false);
  };

  const handleCategoryChange = (event) => {
    setPetCategory(new PetCategory(event.target.value));
  };

  const retrieveData = async () => {
    if (isAuthenticated && user) {
      const petResult = await getPetOwns(user.email);
      console.dir(petResult);
      if (petResult) setPets(petResult);
    }
  };

  const retrieveCategories = async () => {
    const petCategoryResult = await getPetCategory();
    if (petCategoryResult) setPetCategories(petCategoryResult);
  };

  const updateSelectedPet = (pet) => {
    setSelectedPet(pet);
  }

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    retrieveCategories();
    retrieveData();
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={1}
        style={{ marginBottom: 25 }}
      >
        <Grid item xs={10} sm={3} md={2} lg={1}>
          <Button
            style={{ minWidth: 100 }}
            variant="contained"
            color="primary"
            onClick={openAddPetDialog}
          >
            Add pet
          </Button>
        </Grid>
        <Grid item xs={10} sm={3} md={3} lg={4}>
          <InputLabel id="categoryLabel">Filter category</InputLabel>
          <Select
            style={{ minWidth: 120 }}
            labelId="categoryLabel"
            value={petCategory.category}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {petCategories.map((c) => (
              <MenuItem key={c.category} value={c.category}>
                {c.category}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container justify="flex-start" spacing={1}>
        {pets.length > 0
          ? pets.filter(pet => petCategory.category == "" || pet.category == petCategory.category).map((pet) => (
            <PetCard
              key={pet.name}
              pet={pet}
              onClick={openViewPetDialog}
            />
          ))
          : null}
      </Grid>

      <DialogAddPet
        isOpen={addPetDialog}
        onClose={closeAddPetDialog}
        refresh={retrieveData}
        categories={petCategories}
      />

      <DialogViewPet
        isOpen={viewPetDialog}
        onClose={closeViewPetDialog}
        refresh={retrieveData}
        updateSelectedPet={updateSelectedPet}
        pet={selectedPet}
      />
    </>
  );
};

export default PagePetManagement;
