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

export default function NavDrawer(props: {
  open: boolean;
  onClose: () => void;
}) {
  const { onClose, open } = props;

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
          name="DashBoard"
          iconComponent={<DashboardIcon />}
        />
        <DrawerLink
          href="/logs"
          name="Logs"
          iconComponent={<AssignmentIcon />}
        />
      </List>
    </Drawer>
  );
}
