import { useEffect, useState } from "react";

import {
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Chip,
} from "@mui/material";
import { Geoservice } from "../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./results.css";

type StatisticsProps = {
  total: number;
};

type TableProps = {
  docs: Geoservice[];
  fields: string[];
};

export const StatisticsBox = ({ total }: StatisticsProps) => (
  <div id="results-statisticsarea">
    <Chip label={`Results: ${total}`} variant="outlined" />
  </div>
);

const ResultRow = ({ row, index }: { row: Geoservice; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <TableRow key={index}>
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
  );
};

export const ResultArea = ({ docs, fields }: TableProps) => {
  if (docs.length < 1) {
    return <div>No Data</div>;
  }

  // Pandas provide column headers, for Redis JSON Objects we have to get them from the JSON Object:
  const columns =
    fields && fields.length > 1
      ? fields
      : Object.keys(docs[0]).filter((key) =>
          ["TITLE", "ABSTRACT", "OWNER", "SERVICETYPE"].includes(key)
        ) || [];

  return (
    <div id="results-table">
      <TableContainer component={Paper} sx={{ maxHeight: "65vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map((col_header, index) => (
                <TableCell key={index}>{col_header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.map((row, index) => (
              <ResultRow row={row} index={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
// }
