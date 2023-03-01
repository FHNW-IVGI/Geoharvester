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
import { DataGrid } from "@mui/x-data-grid";
import { Geoservice } from "../../types";

type StatisticsProps = {
  total: number;
};

type TableProps = {
  docs: any[];
  headers: string[];
};

export const StatisticsBox = ({ total }: StatisticsProps) => (
  <div id="results-statisticsarea">
    <Chip label={`Results: ${total}`} variant="outlined" />
  </div>
);

export const ResultArea = ({ docs, headers }: TableProps) => {
  if (docs.length < 1 || !headers) {
    return <div>No Data</div>;
  }

  // Add any columns that you don`t want to display in the table.
  // Refer to src/types.ts for values

  const columnsToIgnore: string[] = [
    "MAX_ZOOM",
    "KEYWORDS",
    "BBOX",
    "UPDATE",
    "CENTER_LAT",
    "CENTER_LON",
    "MAPGEO",
    "GROUP",
    "id",
  ];

  const columns = headers
    .map((header, key) => {
      return header === "ABSTRACT" || header === "LEGEND"
        ? { field: header, headerName: header.toLowerCase(), width: 500 }
        : {
            field: header,
            headerName: header.toLowerCase(),
            width: 140,
          };
    })
    .filter((column) => !columnsToIgnore.includes(column.field));

  console.log(columns);

  return (
    <div id="results-table" style={{ height: 700 }}>
      <DataGrid
        rows={docs}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10, 20, 50, 100]}
        getRowHeight={() => "auto"}
      />
    </div>
  );
};
