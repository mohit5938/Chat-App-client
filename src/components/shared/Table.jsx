"use client"

import React, { useState } from "react"

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"


const Table = ({ row = [], 
  column = [], 
  heading, rowHeight = 52, 
  pageSize = 5, }) => {

//  paging 
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(row.length / pageSize)

  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize
  const paginatedRows = row.slice(startIndex, endIndex)

  return (
    <div className="w-full  rounded-lg border bg-white">
      {/* Heading */}
      {heading && (
        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold">{heading}</h2>
        </div>
      )}

      <ShadTable >
        {/* Table Head */}
        <TableHeader>
          <TableRow className="bg-muted">
            {column.map((col) => (
              <TableHead
                key={col.key}
                className={col.align === "center" ? "text-center" : ""}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {paginatedRows.length ? (
            paginatedRows.map((item, index) => (
              <TableRow
                key={index}
                style={{ height: rowHeight }}
                className="hover:bg-muted/50"
              >
                {column.map((col) => (
                  <TableCell
                    key={col.key}
                    className={col.align === "center" ? "text-center" : ""}
                  >
                    {/* Custom Render Support */}
                    {col.render
                      ? col.render(item)
                      : typeof item[col.key] === "object"
                        ? JSON.stringify(item[col.key])
                        : item[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={column.length}
                className="h-24 text-center text-muted-foreground"
              >
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadTable>


      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )
      }



    </div>

    
 
  )
}

export default Table
