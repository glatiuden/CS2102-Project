import React, { useContext, useEffect, useState } from 'react';

import {
    CircularProgress, FormControl, Grid, InputLabel, Select, TextField
} from '@material-ui/core';

import { MainContext } from '../../contexts/MainContext';
import { CareTaker } from '../../database/CareTakerManager';
import {
    getAllStarPerformerCareTakers, getStarPerformerCareTakers
} from '../../database/DashboardManager';
import { filterData } from '../../database/DataFilter';
import { getPetCategory, PetCategory } from '../../database/PetCategoryManager';
import DialogCareTaker from './DialogCareTaker';
import StarPerformerCard from './StarPerformerCard';

const PageStarPerformer = () => {
    const { classes } = useContext(MainContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [viewCTDialog, setViewCTDialog] = useState<boolean>(false);
    const [starperformers, setStarperformers] = useState<CareTaker[]>([]);
    const [categories, setCategories] = useState<PetCategory[]>([]);
    const [selectedCT, setSelectedCT] = useState<any>(undefined);

    useEffect(() => {
        init();
    }, []);

    const onCategoryChange = (e) => {
        if (e.target.value === 'All') getAllCategory();
        else
            getStarPerformerCareTakers(e.target.value).then(result => {
                setStarperformers(result);
            });
    }

    const init = () => {
        getPetCategory().then(petCats => {
            if (petCats) {
                setCategories(petCats);
                // let performers = [] as any;
                // petCats.forEach(x => {
                //     getStarPerformerCareTakers(x.category).then(result => {
                //         if (result.length > 0)
                //             performers = [...performers, ...result];
                //     });
                // });
                // setTimeout(() => {
                //     setStarperformers(performers);
                setLoading(false);
                // }, 1000);
            }
        });
        getAllCategory();
    }

    const getAllCategory = () => {
        getAllStarPerformerCareTakers().then(result => {
            if (result)
                setStarperformers(result);
        })
    }

    const openViewCTDialog = (ct) => {
        setSelectedCT(ct);
        setViewCTDialog(true);
    };

    const closeViewCTDialog = () => {
        setViewCTDialog(false);
    };

    const handleChange = (event: any) => {
        setSearchQuery(event.target.value);
    }

    return (loading ?
        <CircularProgress /> :
        <>
            <h2>Star Performers of Past Month</h2>
            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1} style={{ marginBottom: 25 }}>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-basic"
                        label="Search"
                        placeholder="John Tan..."
                        fullWidth
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }} />
                </Grid>
                <Grid item xs={6}>
                    <FormControl variant="outlined" className={classes.formControl} style={{ width: '100%' }}>
                        <InputLabel htmlFor="outlined-age-native-simple">Category</InputLabel>
                        <Select
                            native
                            label="Category"
                            onChange={onCategoryChange}
                            inputProps={{
                                name: 'category',
                                id: 'outlined-age-native-simple',
                            }}>
                            <option value="All">
                                All
                            </option>
                            {categories.map((c, i) => (<option key={i} value={c.category}>{c.category}</option>))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container justify="flex-start" spacing={1}>
                {starperformers.length > 0 ? filterData(starperformers, searchQuery).map(ct => (
                    <StarPerformerCard
                        key={ct.email}
                        ct={ct}
                        onClick={openViewCTDialog}
                    />
                )) : null}
            </Grid>
            <DialogCareTaker
                isOpen={viewCTDialog}
                onClose={closeViewCTDialog}
                ct={selectedCT}
            />
        </>
    );
};

export default PageStarPerformer;
