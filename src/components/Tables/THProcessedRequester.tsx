import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export const RequesterColumnsProcessed: ColumnDef<any, any>[] = [
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
    enableGlobalFilter: false,
  },
  {
    accessorKey: "reqId",
    header: "Req ID",
    cell: (data: any) => {
      return (
        <span>{data.row.original.reqId.match(/\d+/)[0].padStart(4, "0")}</span>
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
    enableGlobalFilter: false,
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: (data: any) => {
      return <span>{data.row.original.sellingPrice}</span>;
    },
    enableGlobalFilter: false,
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
    enableGlobalFilter: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (data: any) => {
      return <span>{data.row.original.status}</span>;
    },
    enableGlobalFilter: false,
  },
];
