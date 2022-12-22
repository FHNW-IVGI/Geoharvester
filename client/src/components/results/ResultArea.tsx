import "./results.css";
import { List, ListItem } from "@mui/material";

type ResultProps = {
  results: string[];
};

export const ResultArea = ({ results }: ResultProps) => {
  console.log(results);
  return (
    <div id="results-resultarea">
      <List>
        {results.length ? (
          results.map((result, index) => (
            <ListItem key={index}>- {result}</ListItem>
          ))
        ) : (
          <div />
        )}
      </List>
    </div>
  );
};
