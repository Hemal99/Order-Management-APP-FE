import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentValues } from "../redux/Slices/requestFormSlice";
import axiosInstance from "../utils/axios";
import moment from "moment";

function LogItem(props: {
  date: string;
  name: string;
  log: string;
}): JSX.Element {
  return (
    <Box sx={{ mb: 2, display: "grid", gridTemplateColumns: "25% 20% 55%" }}>
      <Typography>{props.date}</Typography>
      <Typography>{props.name}</Typography>
      <Box sx={{ display: "flex" }}>
        <Typography>Status Changed to </Typography>
        <Typography sx={{ fontWeight: 600, ml: "1ch" }}>
          {" "}
          {props.log}
        </Typography>
      </Box>
    </Box>
  );
}

function CompletedOrderView({}) {
  const values = useSelector(selectCurrentValues);
  console.log(values._id);

  const [logs, setLogs] = React.useState([]);

  useEffect(() => {
    (async () => {
      const response = await axiosInstance.get(
        `/user/get-logs-by-request-id/${values._id}`
      );
      console.log(response);
      setLogs(response.data);
    })();
  }, []);

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 5 }}>
        Change Logs
      </Typography>
      <hr></hr>
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: "25% 20% 55%",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>Date / Time</Typography>
        <Typography sx={{ fontWeight: 600 }}>User Name</Typography>
        <Typography sx={{ fontWeight: 600 }}>Log</Typography>
      </Box>
      <Box sx={{ mt: 2, mb: 10 }}>
        <div>
          {logs.map((log: any, i) => (
            <LogItem
              key={i}
              date={moment(log.createdAt)
                .tz("Asia/Dubai")
                .format("DD MMM YYYY [at] hh mm A")}
              name={log.user.firstName + " " + log.user.lastName}
              log={log.currentStatus}
            />
          ))}
        </div>
      </Box>
    </>
  );
}

export default CompletedOrderView;
