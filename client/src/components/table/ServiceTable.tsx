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
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Geoservice, SearchParameters } from "../../types";
import { visuallyHidden } from "@mui/utils";
import { ServiceRow } from "./ServiceRow";
import { TablePaginationActions } from "./TablePaginationActions";
import { DEFAULTCHUNKSIZE, RESPONSESTATE, BREAKPOINT600 } from "src/constants";
import { useViewport } from "src/custom/ViewportHook";
import { PlaceholderWidget } from "./PlaceholderUI";
import "../../styles.css";

type TableProps = {
  updateSearchParameters: (parameter: Partial<SearchParameters>) => void;
  docs: Geoservice[];
  responseState: RESPONSESTATE;
  total: number;
  currentApiPage: number;
  setRowsPerPage: (size: number) => void;
  tablePage: number;
  setTablePage: (page: number) => void;
  rowsPerPage: number;
};

type Order = "asc" | "desc";

export const ServiceTable = ({
  updateSearchParameters,
  docs,
  responseState,
  total,
  currentApiPage,
  tablePage,
  setTablePage,
  setRowsPerPage,
  rowsPerPage,
}: TableProps) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [tableRef, setTableReference] = useState<any>();

  const { width } = useViewport();

  const theme = useTheme();

  const scrollToTop = () => tableRef && tableRef.scrollIntoView();

  const displayedRecordsStart =
    currentApiPage * DEFAULTCHUNKSIZE + tablePage * rowsPerPage;
  const displayedRecordsEnd = displayedRecordsStart + rowsPerPage;

  const handleChangePageForward = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const processedResults = rowsPerPage * newPage;
    if (processedResults >= DEFAULTCHUNKSIZE && processedResults <= total) {
      updateSearchParameters({ page: currentApiPage + 1 });
      setTablePage(0);
    } else {
      setTablePage(newPage);
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
      updateSearchParameters({ page: currentApiPage - 1 });
      setTablePage(Math.abs(pagesBeforeReload) - 1);
    } else {
      setTablePage(newPage);
    }
    scrollToTop();
  };

  const handleSetPageZero = () => {
    if (currentApiPage > 0) {
      // Reset results
      updateSearchParameters({ page: 0 });
    }
    // Reset UI is sufficent
    setTablePage(0);
    scrollToTop();
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setTablePage(0);
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
      handleRequestSort(event, property.toLocaleLowerCase());
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
      backgroundColor: theme.palette.primary.main,
      padding: "0 1px",
      textAlign: "center",
    },
  }));
  const LeftAlignedTableCell = styled(TableCell)(() => ({
    "&": {
      backgroundColor: theme.palette.primary.main,
      padding: 8,
      textAlign: "left",
      color: theme.palette.secondary.main,
    },
  }));

  switch (responseState) {
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
          sx={{
            cursor: "pointer",
            overflowX: "auto",
            marginTop: "50px",
          }}
        >
          <Table stickyHeader aria-label="sticky table" ref={setTableReference}>
            <TableHead>
              <TableRow>
                <CenteredTableCell></CenteredTableCell>
                <LeftAlignedTableCell>Title</LeftAlignedTableCell>
                {width > BREAKPOINT600 && (
                  <LeftAlignedTableCell>Abstract</LeftAlignedTableCell>
                )}
                {["Provider", "Service", "Metaquality"].map(
                  (col_header, index) => {
                    const commonCasedHeader =
                      col_header.charAt(0).toUpperCase() +
                      col_header.slice(1).toLocaleLowerCase();
                    return (
                      <>
                        <CenteredTableCell
                          key={index}
                          sortDirection={orderBy === col_header ? order : false}
                        >
                          <TableSortLabel
                            sx={{
                              "& .MuiTableSortLabel-icon": {
                                color: "white !important",
                              },
                              "& .MuiTableSortLabel-root": {
                                color: "white !important",
                              },
                            }}
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
                  }
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? sortedData.slice(
                    tablePage * rowsPerPage,
                    tablePage * rowsPerPage + rowsPerPage
                  )
                : sortedData
              ).map((row, index) => (
                <ServiceRow
                  row={row}
                  index={index}
                  page={tablePage}
                  total={total}
                  mobileMode={width < BREAKPOINT600}
                />
              ))}
            </TableBody>
            <TableFooter
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 20,
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              <TableRow>
                <TablePagination
                  sx={{ width: "100%" }}
                  rowsPerPageOptions={[20, 50, 100, 200]}
                  colSpan={6}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={tablePage}
                  labelDisplayedRows={({
                    from,
                    to,
                    count,
                    page,
                  }): React.ReactNode => {
                    return width > BREAKPOINT600
                      ? `${displayedRecordsStart}–${Math.min(
                          total,
                          displayedRecordsEnd
                        )} of ${count !== -1 ? count : `more than ${to}`}`
                      : "";
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
            </TableFooter>
          </Table>
        </TableContainer>
      );

    default:
      return <PlaceholderWidget placeholderText="Webservice suchen..." />;
  }
};
