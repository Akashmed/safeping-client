import React from 'react';
import { Helmet } from 'react-helmet-async';
import GoogleMapComponent from '../../components/maps/GoogleMapComponent';
import NearbyPlacesPage from '../NearbyPlacesPage';
import HomeTools from './HomeTools';

const Home = () => {
    return (
        <div className='min-h-screen bg-slate-900'>
            <Helmet>
                <title>Safeping | Home</title>
            </Helmet>
            <HomeTools />
            <NearbyPlacesPage />
        </div>
    );
};

export default Home;