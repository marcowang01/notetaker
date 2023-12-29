"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { labels, Entry } from "@/types/notes"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Entry>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="date" />
    ),
    cell: ({ row }) => {
      const rawDate: string = row.getValue("date");
      const dateObj = new Date(rawDate);
      
      // Format the date to MM/DD/YY and time to 24-hour format HH:MM
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }) + ' ' + dateObj.toLocaleTimeString("en-US", {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
  
      return <div className="w-[120px] font-light">{formattedDate}</div>;
    },
    enableSorting: true,
    enableHiding: false,
    sortDescFirst: true,
  },  
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="content" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)
      const allColors = "border-gray-600 border-gray-400 border-orange-400"
      return (
        <div className="flex space-x-2">
          {label && 
            <Badge variant="outline" className={cn(`font-light`, allColors, label.color)}>
              {label.label}
            </Badge>
          }
          <span className="w-[600px] truncate font-light">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value: string | string[]) => {
      // value is the search string in search bar or array of strings in filter dropdown
      // If value is an array of strings, compare each element with row.original.label
      if (Array.isArray(value)) {
        const label = row.original.label;
        if (typeof label === 'string') {
          return value.every(word => label.toLowerCase().includes(word.toLowerCase()));
        }
      }
      // If value is a string, check if it's contained in the title
      else if (typeof value === 'string') {
        const title = row.getValue(id);
        if (typeof title === 'string') {
          return title.toLowerCase().includes(value.toLowerCase());
        }
      }
    
      return false; // Return false for non-matching types or if no match found
    },
    enableHiding: false,
    sortDescFirst: false,
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     )

  //     if (!priority) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
