import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Hashloader from "../components/loader/Hashloader";
import React from "react";


const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading) return <Hashloader/>;
    if(user) return children ;

    return <Navigate to='/login' state={{from: location}} replace={true}></Navigate>
};

export default PrivateRoute;