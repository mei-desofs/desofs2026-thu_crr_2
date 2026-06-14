import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

/** Clears session (Redux + localStorage + token) and redirects to login. */
export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useCallback(() => {
    dispatch(logout());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);
}
