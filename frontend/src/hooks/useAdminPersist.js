import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosAdmin from "../lib/axiosAdmin";
import {
  setAdminLoginData,
  logoutAdmin,
  setAdminLoading,
} from "../redux/adminAuthSlice";

export default function useAdminPersist() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!window.location.pathname.startsWith("/admin")) return;

    const restoreAdmin = async () => {
      dispatch(setAdminLoading(true));

      try {
        const res = await axiosAdmin.post("/refresh-token");

        dispatch(
          setAdminLoginData({
            admin: res.data.admin,
            accessToken: res.data.accessToken,
          })
        );
      } catch (err) {
        dispatch(logoutAdmin());
      }
    };

    restoreAdmin();
  }, [dispatch]);

  return null;
}
