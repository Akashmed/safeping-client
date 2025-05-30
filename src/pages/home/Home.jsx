import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div className='min-h-screen bg-slate-900'>
            <Helmet>
                <title>Safeping | Home</title>
            </Helmet>
            <p className='text-4xl text-red-400 text-center'>Welcome to SafePing</p>
        </div>
    );
};

export default Home;