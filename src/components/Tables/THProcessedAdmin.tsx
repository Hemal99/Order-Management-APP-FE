import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export const AdminColumnsProcessed: ColumnDef<any, any>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: (data: any) => {
      return (
        <span>
          {moment(data.row.original.createdAt).format("DD MMM YYYY ")}
        </span>
      );
    },
  },

  {
    accessorKey: "productName",
    header: "Product Name",
    cell: (data: any) => {
      return <span>{data.row.original.productName}</span>;
    },
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: (data: any) => {
      return <span>{data.row.original.quantity}</span>;
    },
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: (data: any) => {
      return <span>{data.row.original.sellingPrice}</span>;
    },
  },
  {
    accessorKey: "codeNumber",
    header: "Code",
    cell: (data: any) => {
      return <span>{data.row.original.codeNumber}</span>;
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

  // You can follow the structure to display other data such as country and status
];
