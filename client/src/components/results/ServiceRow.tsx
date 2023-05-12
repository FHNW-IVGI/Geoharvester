import { useState } from "react";
import {
  IconButton,
  TableRow,
  TableCell,
  Icon,
  Tooltip,
  styled,
} from "@mui/material";
import { Geoservice } from "../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SubRow } from "./SubRow";
import "../../styles.css";

export const ServiceRow = ({
  row,
  index,
}: {
  row: Geoservice;
  index: number;
}) => {
  const [open, setOpen] = useState(false);

  const getIcon = () => {
    const target =
      row.OWNER === "Bund" ? "ch" : row.OWNER.slice(3, 5).toLocaleLowerCase();
    return `/cantonIcons/${target}.svg`;
  };

  const StyledTableCell = styled(TableCell)(({}) => ({
    "&": {
      width: 120,
      padding: 8,
      textAlign: "center",
    },
  }));

  const abstract =
    row && row.ABSTRACT && row.ABSTRACT.length > 450
      ? `${row.ABSTRACT.slice(0, 450)}...`
      : row.ABSTRACT;

  const metaquality = 60;
  const qualitynum = `chart x-${metaquality}`;

  return (
    <>
      <TableRow key={index} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ color: "#ffa05f" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>{row.TITLE}</TableCell>
        <TableCell>{abstract}</TableCell>
        <StyledTableCell>
          <Tooltip title={row.OWNER}>
            <Icon>
              <img src={getIcon()} height={25} width={25} />
            </Icon>
          </Tooltip>
        </StyledTableCell>
        <StyledTableCell>{row.SERVICETYPE}</StyledTableCell>
        <StyledTableCell>
          <Tooltip title={metaquality}>
            <div id="metaqual" className={qualitynum}>
                <p className="percentage">{metaquality}</p>
            </div>
          </Tooltip>
        </StyledTableCell>
      </TableRow>
      <SubRow row={row} open={open} index={index} />
    </>
  );
};
