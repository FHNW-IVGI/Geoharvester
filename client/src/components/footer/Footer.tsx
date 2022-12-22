import { Paper, Button } from "@mui/material";
import "./footer.css";

export const Footer = ({
  status,
  checkServerStatus,
}: {
  status: string;
  checkServerStatus: () => void;
}) => (
  <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
    <div id="footer-bar">
      <p id="footer-text">
        Server is
        <span
          style={{
            color: status === "running" ? "green" : "red",
            fontWeight: "bold",
            marginLeft: "6px",
          }}
        >
          {status}
        </span>
      </p>
      <Button id="footer-button" onClick={checkServerStatus}>
        Check
      </Button>
    </div>
  </Paper>
);
