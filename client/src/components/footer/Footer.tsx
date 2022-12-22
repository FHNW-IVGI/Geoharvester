import { Paper } from "@mui/material";
import "./Footer.css";

export const Footer = ({ status }: { status: string }) => (
  <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
    <div className="footer-bar">
      <p className="footer-text">
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
    </div>
  </Paper>
);
