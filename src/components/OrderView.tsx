import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentValues } from "../redux/Slices/requestFormSlice";
import { selectCurrentUserRole } from "../redux/Slices/authSlice";
import moment from "moment-timezone";

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
  const role = useSelector(selectCurrentUserRole);

  // function convertImageToBase64(imageUrl: any) {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d")!;

  //   console.log("this runs");

  //   const img = new Image();
  //   img.crossOrigin = "Anonymous";
  //   img.onload = function () {
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img, 0, 0, img.width, img.height);

  //     const base64String = canvas.toDataURL("image/png");

  //     const imageContainer = document.getElementById("imageContainer")!;
  //     imageContainer.innerHTML = `<img src="${base64String}" alt="Converted Image">`;
  //   };

  //   // Set the image source to the provided URL
  //   img.src = imageUrl;
  // }

  // useEffect(() => {
  //   convertImageToBase64(values.image);
  // }, [values]);

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 5 }}>
        Request ID : {values.reqId.match(/\d+/)[0].padStart(4, "0")}
      </Typography>
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={1} columnSpacing={10}>
          <Grid item xs={5}>
            {role !== "Requester" && (
              <ViewAttribute
                attribute="Requester Name"
                value={
                  values.requester.firstName + " " + values.requester.lastName
                }
              />
            )}
            <ViewAttribute
              attribute="Product Name"
              value={values.productName}
            />
            <ViewAttribute attribute="Qunatity" value={values.quantity} />
            <ViewAttribute attribute="Code Number" value={values.codeNumber} />
            <ViewAttribute
              attribute="Selling Price"
              value={values.sellingPrice}
            />
            <ViewAttribute attribute="Comments" value={values.Comments} />
            <ViewAttribute attribute="Current status" value={values.status} />
            <ViewAttribute
              attribute="Order Created at"
              value={moment(values.createdAt)
                .tz("Asia/Dubai")
                .format("DD MMM YYYY [at] hh mm A")}
            />
            {(values.status == "In-Transit" ||
              values.status == "Shipment-Arrived" ||
              values.status == "Goods-In-Warehouse") && (
              <ViewAttribute attribute="ETA" value={values.eta} />
            )}
          </Grid>
          <Grid item xs={6} sx={{ display: "flex" }}>
            <Typography sx={{ mr: 3 }}>Image :</Typography>
            <Box
              sx={{
                height: "160px",
                width: "360px",
                textAlign: "center",
              }}
              id="imageContainer"
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
