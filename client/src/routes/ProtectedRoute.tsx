import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store";

const ProtectedRoute: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    console.log("isloggedIn : ",isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}

export default ProtectedRoute;