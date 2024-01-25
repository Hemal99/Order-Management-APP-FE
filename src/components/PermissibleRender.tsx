import React from "react";
import Unauthorized from "../views/unauthorized.view";

function PermissibleRender(props: {
  userPermissions?: string;
  requiredPermissions: string;
  children: React.ReactNode;
}) {
  const { children, userPermissions, requiredPermissions } = props;

  if (!children || !userPermissions || !requiredPermissions) {
    return <Unauthorized />;
  }

  if (userPermissions.includes(requiredPermissions)) {
    return <>{children}</>;
  } else {
    return <Unauthorized />;
  }
}

export default PermissibleRender;
