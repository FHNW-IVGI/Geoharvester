import "./results.css";
import {
  TableContainer,
  ListItem,
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
  results: string[][];
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

export const ResultArea = ({ results }: ResultProps) => {
  if (results.length < 2) {
    return <div>No Data</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          <TableHead></TableHead>
          {results.length ? (
            results.map((row, index) => (
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
