import React, { useState } from "react";
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
  PROVIDERTYPE,
  RESPONSESTATE,
  SERVICE,
} from "src/constants";
import LinearProgress from "@mui/material/LinearProgress";

type TableProps = {
  docs: Geoservice[];
  responseState: RESPONSESTATE;
  fields: string[];
  offset: number;
  total: number;
  page: number;
  currentApiPage: number;
  setOffset: (offset: number) => void;
  setRowsPerPage: (size: number) => void;
  setPage: (page: number) => void;
  rowsPerPage: number;
  triggerSearch: (
    searchString: string | undefined,
    servicetype: SERVICE | undefined,
    provider: PROVIDERTYPE | undefined,
    pageIndex: number
  ) => void;
  servicetypeState: SERVICE;
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
  currentApiPage,
  page,
  setPage,
  setRowsPerPage,
  rowsPerPage,
  triggerSearch,
  servicetypeState,
  providerState,
  searchStringState,
}: TableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [tableRef, setTableReference] = useState<any>();

  const theme = useTheme();

  const scrollToTop = () => tableRef && tableRef.scrollIntoView();

  const displayedRecordsStart =
    currentApiPage * DEFAULTCHUNKSIZE + page * rowsPerPage;
  const displayedRecordsEnd = displayedRecordsStart + rowsPerPage;

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
    scrollToTop();
  };
  const handleChangePageBackward = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const processedResults = Math.abs(rowsPerPage * newPage);
    const pagesBeforeReload = DEFAULTCHUNKSIZE / rowsPerPage;

    if (
      processedResults <= DEFAULTCHUNKSIZE * currentApiPage &&
      processedResults > 0
    ) {
      triggerSearch(
        searchStringState,
        servicetypeState,
        providerState,
        currentApiPage - 1
      );
      setPage(Math.abs(pagesBeforeReload) - 1);
    } else {
      setPage(newPage);
    }
    scrollToTop();
  };

  const handleSetPageZero = () => {
    if (currentApiPage > 0) {
      triggerSearch(searchStringState, servicetypeState, providerState, 0);
    }
    setPage(0);
    scrollToTop();
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

  const CenteredTableCell = styled(TableCell)(() => ({
    "&": {
      backgroundColor: theme.palette.secondary.main,
      padding: "0 1px",
      textAlign: "center",
      color: "white",
    },
  }));
  const LeftAlignedTableCell = styled(TableCell)(() => ({
    "&": {
      backgroundColor: theme.palette.secondary.main,
      padding: 8,
      textAlign: "left",
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

  const columns = ["title", "abstract", "provider", "service", "metaquality"];

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
          <Table stickyHeader aria-label="sticky table" ref={setTableReference}>
            <TableHead>
              <TableRow>
                <CenteredTableCell></CenteredTableCell>
                {columns.map((col_header, index) => {
                  const commonCasedHeader =
                    col_header.charAt(0).toUpperCase() +
                    col_header.slice(1).toLocaleLowerCase();
                  return index < 2 ? (
                    <LeftAlignedTableCell key={index}>
                      {commonCasedHeader}
                    </LeftAlignedTableCell>
                  ) : (
                    <>
                      <CenteredTableCell
                        key={index}
                        sortDirection={orderBy === col_header ? order : false}
                      >
                        <TableSortLabel
                          style={{ color: "white" }}
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
                              + ro
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </CenteredTableCell>
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
                <ServiceRow row={row} index={index} page={page} total={total} />
              ))}
            </TableBody>
            <StyledTableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[20, 50, 100, 200]}
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
                    return `${displayedRecordsStart}–${Math.min(
                      total,
                      displayedRecordsEnd
                    )} of ${count !== -1 ? count : `more than ${to}`}`;
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
                      displayedRecordsStart={displayedRecordsStart}
                      displayedRecordsEnd={displayedRecordsEnd}
                      handleSetPageZero={handleSetPageZero}
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
