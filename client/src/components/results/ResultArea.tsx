import "./results.css";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

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
        <div>{`${entry.term}: ${entry.count}`}</div>
      ))}
    </div>
  ) : (
    <div></div>
  );

export const ResultArea = ({ data, fields }: ResultProps) => {
  if (data.length < 2) {
    return <div>No Data</div>;
  }

  return (
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
              <TableRow>
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
  );
};
