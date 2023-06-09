import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableFooter,
  TablePagination,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Fab,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Geoservice } from "../../types";
import { visuallyHidden } from "@mui/utils";
import { ServiceRow } from "./ServiceRow";
import { TablePaginationActions } from "./TablePaginationActions";
import {
  DEFAULTCHUNKSIZE,
  DEFAULTPAGE,
  DEFAULTROWSPERPAGE,
  PROVIDERTYPE,
  RESPONSESTATE,
  SERVICETYPE,
} from "src/constants";
import LinearProgress from "@mui/material/LinearProgress";

type TableProps = {
  docs: Geoservice[];
  responseState: RESPONSESTATE;
  fields: string[];
  offset: number;
  total: number;
  page: number;
  placeholderText: string;
  currentApiPage: number;
  initialTotal: number;
  setOffset: (offset: number) => void;
  setInitialTotal: (total: number) => void;
  setRowsPerPage: (size: number) => void;
  setPage: (page: number) => void;
  rowsPerPage: number;
  triggerSearch: (
    searchString: string | undefined,
    servicetype: SERVICETYPE | undefined,
    provider: PROVIDERTYPE | undefined,
    pageIndex: number
  ) => void;
  servicetypeState: SERVICETYPE;
  providerState: PROVIDERTYPE;
  searchStringState: string;
};

type Order = "asc" | "desc";

export const ServiceTable = ({
  docs,
  responseState,
  fields,
  offset,
  total,
  placeholderText,
  currentApiPage,
  setInitialTotal,
  page,
  setPage,
  initialTotal,
  setRowsPerPage,
  rowsPerPage,
  triggerSearch,
  servicetypeState,
  providerState,
  searchStringState,
}: TableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  const theme = useTheme();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - docs.length) : 0;

  const handleChangePageForward = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const processedResults = rowsPerPage * newPage;
    if (processedResults >= DEFAULTCHUNKSIZE && processedResults <= total) {
      setPage(0);
      triggerSearch(
        searchStringState,
        servicetypeState,
        providerState,
        currentApiPage + 1 //
      );
    } else {
      setPage(newPage);
    }
  };
  const handleChangePageBackward = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const processedResults = Math.abs(rowsPerPage * newPage);
    const pagesBeforeReload = DEFAULTCHUNKSIZE / rowsPerPage;

    // 100 / 100 = 1, 100 / 50  = 2

    console.log("processedResults", processedResults); // Rows * page
    console.log("currentApiPage", currentApiPage);
    console.log("pagesBeforeReload", Math.abs(pagesBeforeReload));
    console.log("newPage", newPage); // -1
    console.log("-----");
    if (
      processedResults <= DEFAULTCHUNKSIZE * currentApiPage &&
      processedResults > 0
    ) {
      console.log("newcall");
      triggerSearch(
        searchStringState,
        servicetypeState,
        providerState,
        currentApiPage - 1
      );
      setPage(Math.abs(pagesBeforeReload) - 1);
    } else {
      console.log("skip");
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(DEFAULTPAGE);
  };

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

  const StyledTableCell = styled(TableCell)(() => ({
    "&": {
      backgroundColor: theme.palette.secondary.main,
      padding: 8,
      textAlign: "center",
      color: "white",
    },
  }));

  const StyledTableFooter = styled(TableFooter)(() => ({
    "&": {
      left: 0,
      bottom: 0,
      zIndex: 2,
      position: "sticky",
      backgroundColor: "white",
    },
  }));

  const PlaceholderWidget = ({
    placeholderText,
  }: {
    placeholderText?: string;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flex: 1,
      }}
    >
      {placeholderText ? (
        <Typography variant="h3" component="h3" color="#C0C0C0">
          {placeholderText}
        </Typography>
      ) : (
        <div>
          <Typography variant="h5" component="h3" color="#C0C0C0">
            Suche...
          </Typography>
          <LinearProgress style={{ width: 300 }} />
        </div>
      )}
    </div>
  );

  const columns = ["TITLE", "ABSTRACT", "OWNER", "SERVICETYPE", "METAQUALITY"];

  switch (responseState) {
    case RESPONSESTATE.UNINITIALIZED:
      return <PlaceholderWidget placeholderText="Webservice suchen..." />;
    case RESPONSESTATE.EMPTY:
      return <PlaceholderWidget placeholderText="Keine Treffer..." />;
    case RESPONSESTATE.ERROR:
      return <PlaceholderWidget placeholderText="Error..." />;
    case RESPONSESTATE.WAITING:
      return <PlaceholderWidget />;
    case RESPONSESTATE.SUCCESS:
      return (
        <TableContainer
          component={Paper}
          sx={{ cursor: "pointer", overflowX: "auto" }}
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
                                : "sorted ascending"}{" "}
                              + ro
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
              {(rowsPerPage > 0
                ? sortedData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : sortedData
              ).map((row, index) => (
                <ServiceRow row={row} index={index} />
              ))}
            </TableBody>
            <StyledTableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    20,
                    50,
                    100,
                    { label: "All", value: -1 },
                  ]}
                  colSpan={6}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  labelDisplayedRows={({
                    from,
                    to,
                    count,
                    page,
                  }): React.ReactNode => {
                    console.log(
                      "currentApiPage:",
                      currentApiPage,
                      "page",
                      page,
                      "rows",
                      rowsPerPage
                    );
                    console.log(
                      currentApiPage * DEFAULTCHUNKSIZE + page * rowsPerPage
                    );
                    return `${
                      currentApiPage * DEFAULTCHUNKSIZE + page * rowsPerPage
                    }–${
                      currentApiPage * DEFAULTCHUNKSIZE +
                      page * rowsPerPage +
                      rowsPerPage
                    } of ${count !== -1 ? count : `more than ${to}`}`;
                  }}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  onPageChange={() => null}
                  ActionsComponent={(props) => (
                    <TablePaginationActions
                      handleChangePageForward={handleChangePageForward}
                      handleChangePageBackward={handleChangePageBackward}
                      currentApiPage={currentApiPage}
                      {...props}
                    />
                  )}
                />
              </TableRow>
            </StyledTableFooter>
          </Table>
        </TableContainer>
      );

    default:
      return <PlaceholderWidget placeholderText="Webservice suchen..." />;
  }
};
