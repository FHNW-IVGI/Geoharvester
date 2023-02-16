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

type StatisticsProps = {
  total: number;
};

type ResultProps = {
  docs: string[][];
  fields: string[];
};

export const StatisticsBox = ({ total }: StatisticsProps) => (
  <div id="results-statisticsarea">
    <Chip label={`Results: ${total}`} variant="outlined" />
  </div>
);

export const ResultArea = ({ docs, fields }: ResultProps) => {
  if (docs.length < 2) {
    return <div>No Data</div>;
  }

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
            {docs.length ? (
              docs.map((doc, index) => (
                <TableRow key={index}>
                  {doc.map((cell) => (
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
    </div>
  );
};
