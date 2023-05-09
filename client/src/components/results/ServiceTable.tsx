import { useState } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Geoservice } from "../../types";
import { visuallyHidden } from "@mui/utils";

import { ServiceRow } from "./ServiceRow";

type TableProps = {
  docs: Geoservice[];
  fields: string[];
  total: number;
  placeholderText: string;
};

type Order = "asc" | "desc";

export const ServiceTable = ({
  docs,
  fields,
  total,
  placeholderText,
}: TableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  const StyledTableCell = styled(TableCell)(() => ({
    "&": {
      backgroundColor: "#ffa05f",
      padding: 8,
      textAlign: "center",
      color: "white",
    },
  }));

  if (docs.length < 1) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "86vh",
        }}
      >
        <Typography variant="h3" component="h3" color="#C0C0C0">
          {placeholderText}
        </Typography>
      </div>
    );
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const sortedData = docs.sort((a: Geoservice, b: Geoservice) =>
    order === "asc"
      ? a[orderBy as keyof Geoservice] > b[orderBy as keyof Geoservice]
        ? 1
        : -1
      : a[orderBy as keyof Geoservice] < b[orderBy as keyof Geoservice]
      ? 1
      : -1
  );

  const columns =
    fields && fields.length > 1
      ? fields
      : Object.keys(docs[0]).filter((key) =>
          ["TITLE", "ABSTRACT", "OWNER", "SERVICETYPE"].includes(key)
        ) || [];

  return (
    <>
      {docs.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "95vh", cursor: "pointer" }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Σ={total}</StyledTableCell>
                {columns.map((col_header, index) => {
                  const commonCasedHeader =
                    col_header.charAt(0).toUpperCase() +
                    col_header.slice(1).toLocaleLowerCase();
                  return index < 2 ? (
                    <StyledTableCell key={index}>
                      {commonCasedHeader}
                    </StyledTableCell>
                  ) : (
                    <>
                      <StyledTableCell
                        key={index}
                        sortDirection={orderBy === col_header ? order : false}
                      >
                        <TableSortLabel
                          style={{ color: "white", textAlign: "center" }}
                          active={true}
                          direction={orderBy === col_header ? order : "desc"}
                          onClick={createSortHandler(col_header)}
                        >
                          {commonCasedHeader}
                          {orderBy === col_header ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </StyledTableCell>
                    </>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row, index) => (
                <ServiceRow row={row} index={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
