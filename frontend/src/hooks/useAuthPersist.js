import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosClient from "../lib/axiosClient";
import { setCredentials, logout, setLoading } from "../redux/authSlice";

export default function useAuthPersist() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreUser = async () => {
      dispatch(setLoading(true));

      try {
        const res = await axiosClient.post("/auth/refresh-token");

        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          })
        );
      } catch (err) {
        dispatch(logout());
      }
    };

    restoreUser();
  }, [dispatch]);

  return null;
}
