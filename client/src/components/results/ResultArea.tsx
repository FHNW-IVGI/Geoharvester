import "./results.css";
import { List, ListItem } from "@mui/material";

type StatisticsProps = {
  stats: {
    term: string;
    count: number;
  }[];
};

type ResultProps = {
  results: string[];
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
  return (
    <div id="results-resultarea">
      <List>
        {results.length ? (
          results.map((result, index) => (
            <ListItem key={index}>- {`${result[0]} - ${result[1]}`}</ListItem>
          ))
        ) : (
          <div />
        )}
      </List>
    </div>
  );
};
