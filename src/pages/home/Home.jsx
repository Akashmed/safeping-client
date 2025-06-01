import React from 'react';
import { Helmet } from 'react-helmet-async';
import GoogleMapComponent from '../../components/maps/GoogleMapComponent';
import NearbyPlacesPage from '../NearbyPlacesPage';

const Home = () => {
    return (
        <div className='min-h-screen bg-slate-900'>
            <Helmet>
                <title>Safeping | Home</title>
            </Helmet>
            <NearbyPlacesPage />
        </div>
    );
};

export default Home;