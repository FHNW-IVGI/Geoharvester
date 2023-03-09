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
import { Geoservice } from "../../types";

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

export const ResultArea = ({ docs, fields }: TableProps) => {
  if (docs.length < 1) {
    return <div>No Data</div>;
  }

  // Pandas provide column headers, for Redis JSON Objects we have to get them from the JSON Object:
  const columns =
    fields && fields.length > 1
      ? fields
      : Object.keys(docs[0]).filter(
          (key) => !["id", "payload"].includes(key)
        ) || [];

  return (
    <div id="results-table">
      <TableContainer component={Paper} sx={{ maxHeight: "65vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((col_header, index) => (
                <TableCell key={index}>{col_header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.map((doc, index) => (
              <TableRow key={index}>
                {columns.map((column, key) => (
                  <TableCell key={key}>
                    {doc[column as keyof Geoservice]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
// }