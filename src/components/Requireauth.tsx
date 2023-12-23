import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUserRole,
} from "../redux/Slices/authSlice";

const RequireAuth = (props: { allowedRoles: string[] }) => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentUserRole);
  const location = useLocation();

  if (role && props.allowedRoles?.includes(role)) {
    return <Outlet />;
  } else {
    if (token) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
};

export default RequireAuth;
