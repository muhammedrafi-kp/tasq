import {useSelector} from "react-redux";
import {Navigate,Outlet} from "react-router-dom";
import type React from "react";
import type {RootState} from "../redux/store";

const PublicRoute : React.FC=()=>{
    const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated);
    
    if(isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return <Outlet/>;
}

export default PublicRoute;