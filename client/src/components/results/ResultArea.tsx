import { useState } from "react";
import {
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  Chip,
  Collapse,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";

import { Geoservice } from "../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { visuallyHidden } from "@mui/utils";

type TableProps = {
  docs: Geoservice[];
  fields: string[];
  total: number;
};

type Order = "asc" | "desc";

const CollapsibleRow = ({
  row,
  open,
  index,
}: {
  row: Geoservice;
  open: boolean;
  index: number;
}) => {
  const rowsToInclude = [
    "NAME",
    "CONTACT",
    "TREE",
    "GROUP",
    "KEYWORDS",
    "METADATA",
    "SERVICELINK",
    "MAPGEO",
    "LEGEND",
  ];

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  return (
    <StyledTableRow key={index}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {rowsToInclude.map((prop, index) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{}}>
                    <p
                      style={{
                        width: 140,
                        color: "#909090",
                        margin: "0 50px 0 78px",
                      }}
                    >
                      {`${
                        prop.charAt(0).toUpperCase() +
                        prop.slice(1).toLocaleLowerCase()
                      }:`}
                    </p>
                  </div>

                  <div
                    style={{
                      color: "#909090",
                      display: "flex",
                      wordBreak: "break-word",
                    }}
                  >
                    <p style={{ margin: 2 }}>{row[prop as keyof Geoservice]}</p>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </Collapse>
      </TableCell>
    </StyledTableRow>
  );
};

const ResultRow = ({ row, index }: { row: Geoservice; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={index} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.TITLE}</TableCell>
        <TableCell>{row.ABSTRACT}</TableCell>
        <TableCell>{row.OWNER}</TableCell>
        <TableCell>{row.SERVICETYPE}</TableCell>
      </TableRow>
      <CollapsibleRow row={row} open={open} index={index} />
    </>
  );
};

export const ResultArea = ({ docs, fields, total }: TableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  if (docs.length < 1) {
    return <div />;
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
    order == "asc"
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    "&": {
      backgroundColor: "#F7F7F7",
    },
  }));

  return (
    <div
      style={{
        flex: "1 1 auto",
        display: "flex",
      }}
    >
      {docs.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "80vh", cursor: "pointer" }}
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
                          active={orderBy === col_header}
                          direction={orderBy === col_header ? order : "asc"}
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
                <ResultRow row={row} index={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div />
      )}
    </div>
  );
};
