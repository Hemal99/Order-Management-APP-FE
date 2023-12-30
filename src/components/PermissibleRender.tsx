import React from "react";

function PermissibleRender(props: {
  userPermissions: string[];
  requiredPermissions: string;
  children: React.ReactNode;
  renderOtherwise: React.ReactNode;
}) {
  const { children, userPermissions, requiredPermissions, renderOtherwise } =
    props;

  if (!children || !userPermissions || !requiredPermissions) {
    return null;
  }

  if (userPermissions.includes(requiredPermissions)) {
    return children;
  }
  if (renderOtherwise) {
    return renderOtherwise;
  }
  return null;
}

export default PermissibleRender;
