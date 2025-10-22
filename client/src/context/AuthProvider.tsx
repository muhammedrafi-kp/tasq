import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";
import { apiClient } from "../api/axiosInstance";

interface AuthContextType {
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await apiClient.get("/users/me");
        console.log("data :",data);
        dispatch(setUser(data.user));
      } catch (err) {
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
