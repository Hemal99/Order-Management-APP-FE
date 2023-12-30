import { ColumnDef } from "@tanstack/react-table";
import MoreOutlinedIcon from "@mui/icons-material/MoreOutlined";
import { IconButton } from "@mui/material";

export const Columns: ColumnDef<any, any>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: (data: any) => {
      return <span>{data.row.original.date}</span>;
    },
  },

  {
    accessorKey: "ItemName",
    header: "Item Name",
    cell: (data: any) => {
      return <span>{data.row.original.ItemName}</span>;
    },
  },

  {
    accessorKey: "qty",
    header: "Quantity",
    cell: (data: any) => {
      return <span>{data.row.original.qty}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (data: any) => {
      return <span>{data.row.original.price}</span>;
    },
  },
  {
    accessorKey: "CodeNumber",
    header: "Code",
    cell: (data: any) => {
      return <span>{data.row.original.CodeNumber}</span>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: (data: any) => {
      return (
        <img
          src={data.row.original.image}
          alt={data.row.original.image}
          style={{ width: "64px" }}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (data: any) => {
      return <span>{data.row.original.status}</span>;
    },
  },
  {
    header: "Actions",
    cell: () => {
      return (
        <IconButton aria-label="More" color="secondary" size="small">
          <MoreOutlinedIcon />
        </IconButton>
      );
    },
  },

  // You can follow the structure to display other data such as country and status
];
