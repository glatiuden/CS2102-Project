import React, { useContext } from 'react';

import { Container } from '@material-ui/core';

import { ExampleContext } from '../../contexts/ExampleContext';

const Home = () => {
    const { valueToBeStored } = useContext(ExampleContext);

    return <Container maxWidth="sm"><h1>{valueToBeStored}</h1></Container>;
}

export default Home;