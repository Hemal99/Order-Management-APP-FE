import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import { selectCurrentUser } from "../redux/Slices/authSlice";
import { useSelector } from "react-redux";

export default function NavDrawer(props: {
  open: boolean;
  onClose: () => void;
}) {
  const { onClose, open } = props;

  const currentUser = useSelector(selectCurrentUser);

  const DrawerLink = (props: {
    href: string;
    name: string;
    iconComponent: React.ReactNode;
  }) => (
    <Link to={props.href} style={{ textDecoration: "none", color: "black" }}>
      <ListItem button key={props.name} onClick={onClose}>
        <ListItemIcon>{props.iconComponent}</ListItemIcon>
        <ListItemText primary={props.name} />
      </ListItem>
    </Link>
  );
  return (
    <Drawer open={open} onClose={onClose}>
      <List sx={{ width: "20vw", pt: 5 }}>
        <DrawerLink
          href="/"
          name="Current Requests"
          iconComponent={<DashboardIcon />}
        />
        <DrawerLink
          href="/processed"
          name="Processed Requests"
          iconComponent={<AssignmentIcon />}
        />
        {currentUser?.role === "Admin" && (
          <DrawerLink
            href="/users"
            name="Users"
            iconComponent={<GroupIcon />}
          />
        )}
      </List>
    </Drawer>
  );
}
