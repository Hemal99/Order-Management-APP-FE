import React from "react";
import axios from "../../utils/axios"; // Corrected import statement

export default function Auth({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  axios.interceptors.request.use(
    function (config) {
      config.headers["Authorization"] =
        "Bearer " + sessionStorage.getItem("accessToken");
      return config;
    },
    null,
    { synchronous: true }
  );

  return <>{children}</>;
}
