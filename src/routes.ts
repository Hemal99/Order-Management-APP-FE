import Home from "./views/home.view";

const routes = [
  {
    path: "/",
    element: Home,
    name: "Home",
    roles: ["Admin", "Requester"],
  },
];

export default routes;
