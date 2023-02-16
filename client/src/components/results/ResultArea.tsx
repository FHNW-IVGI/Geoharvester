import "./results.css";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TablePagination from '@mui/material/TablePagination';

type StatisticsProps = {
  stats: {
    term: string;
    count: number;
  }[];
};

type ResultProps = {
  data: string[][];
  fields: string[];
};

export const StatisticsBox = ({ stats }: StatisticsProps) =>
  stats && stats.length ? (
    <div id="results-statisticsarea">
      {stats.map((entry) => (
        <Chip label={`${entry.term}: ${entry.count}`} variant="outlined" />
      ))}
    </div>
  ) : (
    <div></div>
  );

export const ResultArea = ({ data, fields }: ResultProps) => {
  if (data.length < 2) {
    return <div>No Data (yet)</div>;
  }

// export const UrlLink(props) {
//   return <a href={props.name}>MapGeo Permalink</a>;
// } 

// export default function EnhancedTable() {
  // const [order, setOrder] = React.useState<Order>('asc');
  // const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
  // const [selected, setSelected] = React.useState<readonly string[]>([]);
  // const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);

// const handleRequestSort = (
//   event: React.MouseEvent<unknown>,
//   property: keyof Data,
// ) => {
//   const isAsc = orderBy === property && order === 'asc';
//   setOrder(isAsc ? 'desc' : 'asc');
//   setOrderBy(property);
// };

// const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//   if (event.target.checked) {
//     const newSelected = rows.map((n) => n.name);
//     setSelected(newSelected);
//     return;
//   }
//   setSelected([]);
// };

// const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
//   const selectedIndex = selected.indexOf(name);
//   let newSelected: readonly string[] = [];

//   if (selectedIndex === -1) {
//     newSelected = newSelected.concat(selected, name);
//   } else if (selectedIndex === 0) {
//     newSelected = newSelected.concat(selected.slice(1));
//   } else if (selectedIndex === selected.length - 1) {
//     newSelected = newSelected.concat(selected.slice(0, -1));
//   } else if (selectedIndex > 0) {
//     newSelected = newSelected.concat(
//       selected.slice(0, selectedIndex),
//       selected.slice(selectedIndex + 1),
//     );
//   }

//   setSelected(newSelected);
// };

// const [page, setPage] = React.useState(0);
// const [rowsPerPage, setRowsPerPage] = React.useState(5);

// const handleChangePage = (event: unknown, newPage: number) => {
//   setPage(newPage);
// };

// const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//   setRowsPerPage(parseInt(event.target.value, 10));
//   setPage(0);
// };

// const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
//   setDense(event.target.checked);
// };

// const isSelected = (name: string) => selected.indexOf(name) !== -1;

// Avoid a layout jump when reaching the last page with empty rows.
// const emptyRows =
//   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <div id="results-table">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {fields.length ? (
                fields.map((field) => <TableCell>{field}</TableCell>)
              ) : (
                <TableCell>.</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length ? (
              data.map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell) => (
                    <TableCell>{cell}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
    </div>
  );
};
// }