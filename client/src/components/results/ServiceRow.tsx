import { useState } from "react";
import { IconButton, TableRow, TableCell, Icon, Tooltip } from "@mui/material";
import { Geoservice } from "../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { SubRow } from "./SubRow";

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

  return (
    <>
      <TableRow key={index} onClick={() => setOpen(!open)}>
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
        <TableCell>
          <Tooltip title={row.OWNER}>
            <Icon>
              <img src={getIcon()} height={25} width={25} />
            </Icon>
          </Tooltip>
        </TableCell>
        <TableCell>{row.SERVICETYPE}</TableCell>
      </TableRow>
      <SubRow row={row} open={open} index={index} />
    </>
  );
};
