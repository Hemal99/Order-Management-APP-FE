import React from "react";
import {
  Container,
  Typography,
  Box,
  InputLabel,
  Grid,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentValues } from "../redux/Slices/requestFormSlice";

function ViewAttribute(props: {
  attribute: string;
  value: string;
}): JSX.Element {
  return (
    <Box sx={{ mb: 2, display: "grid", gridTemplateColumns: "30% 10% 60%" }}>
      <Typography>{props.attribute}</Typography>
      <Typography>:</Typography>
      <Typography sx={{ fontWeight: "600" }}>{props.value}</Typography>
    </Box>
  );
}

function OrderView({}) {
  const values = useSelector(selectCurrentValues);
  console.log(values);

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 5 }}>
        Viewing Order
      </Typography>
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={1} columnSpacing={10}>
          <Grid item xs={5}>
            <ViewAttribute
              attribute="Product Name"
              value={values.productName}
            />
            <ViewAttribute attribute="Qunatity" value={values.quantity} />
            <ViewAttribute attribute="Code Number" value={values.codeNumber} />
            <ViewAttribute attribute="Price" value={values.sellingPrice} />
            <ViewAttribute attribute="Comments" value={values.Comments} />
            <ViewAttribute attribute="Current status" value={values.status} />
          </Grid>
          <Grid item xs={6} sx={{ display: "flex" }}>
            <Typography sx={{ mr: 3 }}>Image :</Typography>
            <Box
              sx={{
                height: "160px",
                width: "360px",
                textAlign: "center",
              }}
            >
              <img
                src={values.image}
                alt="product"
                style={{ height: "100%" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OrderView;
