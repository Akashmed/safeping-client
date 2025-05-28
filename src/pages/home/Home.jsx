import React from 'react';
import { Helmet } from 'react-helmet-async';
import useAuth from '../../hooks/useAuth';

const Home = () => {
    const {user,logOut} = useAuth();
    return (
        <div>
            <Helmet>
                <title>Safeping | Home</title>
            </Helmet>
            <p className='text-4xl text-red-400 bg-slate-900 text-center'>SafePing</p>
            {
                user && <button className='p-3 border-2 cursor-pointer' onClick={logOut}>Logout</button>
            }
        </div>
    );
};

export default Home;