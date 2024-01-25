import { ColumnDef } from "@tanstack/react-table";

export const UserTableColumns: ColumnDef<any, any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (data: any) => {
      return <span>{`${data.row.original.firstName} ${data.row.original.lastName} `}</span>;
    },
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: (data: any) => {
      return <span>{data.row.original.email}</span>;
    },
  },

  {
    accessorKey: "role",
    header: "Access Level",
    cell: (data: any) => {
      return <span>{data.row.original.role}</span>;
    },
  },
  // You can follow the structure to display other data such as country and status
];
