import React, { useContext, useEffect, useState } from 'react';

import {
    Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { AppContext } from '../../contexts/AppContext';
import { MainContext } from '../../contexts/MainContext';
import { getPetCategory, PetCategory } from '../../database/PetCategoryManager';
import { getPetOwns, PetOwns } from '../../database/PetOwnsManager';
import CareTakerFinder from './CareTakerFinder';
import DialogAddPet from './DialogAddPet';
import DialogViewPet from './DialogViewPet';
import PetCard from './PetCard';

const PagePetManagement = () => {
    const { user, isAuthenticated } = React.useContext(AppContext);
    const mainStyle = useContext(MainContext).classes;

    const [pets, setPets] = useState<PetOwns[]>([]);
    const [petCategories, setPetCategories] = useState<PetCategory[]>([]);
    const [petCategory, setPetCategory] = useState<PetCategory>(
        new PetCategory("")
    );
    const [viewPetDialog, setViewPetDialog] = useState<boolean>(false);
    const [addPetDialog, setAddPetDialog] = useState<boolean>(false);
    const [finderDialog, setFinderDialog] = useState<boolean>(false);
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

    const openFinderDialog = () => {
        setFinderDialog(true);
    };

    const closeFinderDialog = () => {
        setFinderDialog(false);
    };

    const handleCategoryChange = (event) => {
        setPetCategory(new PetCategory(event.target.value));
    };

    const retrieveData = async () => {
        if (isAuthenticated && user) {
            const petResult = await getPetOwns(user.email);
            if (petResult) setPets(petResult);
        }
    };

    const retrieveCategories = async () => {
        const petCategoryResult = await getPetCategory();
        if (petCategoryResult) setPetCategories(petCategoryResult);
    };

    const updateSelectedPet = (pet) => {
        setSelectedPet(pet);
    };

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
            >
                <Grid item xs={10} sm={3} md={2} lg={1}>
                    <Button
                        style={{ minHeight: 50 }}
                        variant="contained"
                        color="primary"
                        onClick={openAddPetDialog}
                        startIcon={<AddIcon />}
                    >
                        Add Pet
                    </Button>
                </Grid>
                <Grid item xs={10} sm={3} md={3} lg={7}>
                    <FormControl variant="outlined" className={mainStyle.formControl} style={{ width: '100%' }}>
                        <InputLabel htmlFor="outlined-age-native-simple">Category</InputLabel>
                        <Select
                            style={{ minWidth: 150 }}
                            labelId="categoryLabel"
                            label="Category"
                            variant="outlined"
                            value={petCategory.category}
                            onChange={handleCategoryChange}
                            inputProps={{
                                name: 'category',
                                id: 'outlined-age-native-simple',
                            }}>
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {petCategories.map((c) => (
                                <MenuItem key={c.category} value={c.category}>
                                    {c.category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container item xs={10} sm={3} md={3} lg={4} justify="flex-end">
                    <Button
                        style={{ minHeight: 50 }}
                        variant="contained"
                        color="primary"
                        onClick={openFinderDialog}
                    >
                        Find caretaker for all pets
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
                style={{ marginBottom: 25, marginLeft: 5 }}
            >
            </Grid>
            <Grid container justify="flex-start" spacing={1}>
                {pets.length > 0
                    ? pets
                        .filter((pet) =>
                            petCategory.category == "" ||
                            pet.category == petCategory.category
                        ).map((pet) => (
                            <PetCard key={pet.name} pet={pet} onClick={openViewPetDialog} />
                        ))
                    : null}
            </Grid>

            <Dialog
                open={finderDialog}
                onClose={closeFinderDialog}
                maxWidth="lg"
                fullWidth={true}>
                <DialogTitle className={mainStyle.dialogTitle}>Find caretaker for all pets
                        <IconButton aria-label="close" className={mainStyle.closeButton} onClick={closeFinderDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <CareTakerFinder refreshBids={() => { }} pet={{ po_email: user ? user.email : null, searchAll: true }} />
                </DialogContent>
            </Dialog>

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
                categories={petCategories}
            />
        </>
    );
};

export default PagePetManagement;
