import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Geoservice } from "../../types";

import {
  getArcgisproWFS,
  getArcgisproWMS,
  getArcgisproWMTS,
  getQgisWFS,
  getQgisWMS,
  getQgisWMTS,
} from "../../requests";
import DownloadIcon from "@mui/icons-material/Download";

export const SubRow = ({
  row,
  open,
  index,
  mobileMode,
}: {
  row: Geoservice;
  open: boolean;
  index: number;
  mobileMode: boolean;
}) => {
  const rowsToInclude = mobileMode
    ? ["name", "contact", "abstract", "keywords", "metadata"]
    : [
        "name",
        "contact",
        "abstract",
        "tree",
        "group",
        "keywords",
        "metadata",
        "endpoint",
      ];

  const routeObjectBuilder = () => {
    if (!row || !row.service) {
      return {
        arcgis_handler: () => "error",
        qgis_handler: () => "error",
      };
    }

    return row.service.includes("WFS")
      ? {
          arcgis_handler: () => getArcgisproWFS(row),
          qgis_handler: () => getQgisWFS(row),
        }
      : row.service.includes("WMS")
      ? {
          arcgis_handler: () => getArcgisproWMS(row),
          qgis_handler: () => getQgisWMS(row),
        }
      : {
          arcgis_handler: () => getArcgisproWMTS(row),
          qgis_handler: () => getQgisWMTS(row),
        };
  };

  const tableMargin = mobileMode ? "0 0px 0 78px" : "0 0px 0 40px";

  const StyledTableRow = styled(TableRow)(() => ({
    "&": {
      backgroundColor: "#fdfdfd",
    },
  }));

  const LeftAlignedTableCell = styled(TableCell)(() => ({
    "&": {
      borderBottom: "none",
      padding: 0,
      color: "#909090",
    },
  }));
  const FillerTableCell = styled(TableCell)(() => ({
    "&": {
      borderBottom: "none",
      padding: 0,
      width: mobileMode ? 24 : 50,
    },
  }));

  return (
    <StyledTableRow key={index}>
      <TableCell
        style={{
          textAlign: "left",
          padding: 0,
          boxShadow: "inset 0px 0px 6px 0px rgba(0, 0, 0, 0.15)",
        }}
        colSpan={mobileMode ? 5 : 6}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <TableContainer>
            <Table>
              <TableBody>
                {rowsToInclude.map((prop) => (
                  <TableRow>
                    <FillerTableCell></FillerTableCell>
                    <LeftAlignedTableCell style={{ width: "80px" }}>
                      {`${
                        prop.charAt(0).toUpperCase() +
                        prop.slice(1).toLocaleLowerCase()
                      }:`}
                    </LeftAlignedTableCell>
                    <LeftAlignedTableCell
                      colSpan={2}
                      style={{
                        width: "100%",
                        display: "flex",
                        wordBreak: "break-word",
                      }}
                    >
                      {row[prop as keyof Geoservice]}
                    </LeftAlignedTableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <FillerTableCell></FillerTableCell>
                  <LeftAlignedTableCell style={{ width: "80px" }}>
                    Mapgeo:
                  </LeftAlignedTableCell>
                  <LeftAlignedTableCell
                    colSpan={2}
                    style={{
                      display: "flex",
                      wordBreak: "break-word",
                    }}
                  >
                    <Tooltip title={row.preview} arrow>
                      <Button
                        style={{ padding: 0 }}
                        variant="text"
                        onClick={() => window.open(row.preview)}
                        disabled={
                          row.preview === "n.a." ||
                          row.preview === null ||
                          row.preview === ""
                        }
                      >
                        Service in MapGeo öffnen
                      </Button>
                    </Tooltip>
                  </LeftAlignedTableCell>
                </TableRow>
                <TableRow>
                  <FillerTableCell />
                  <LeftAlignedTableCell>Legend:</LeftAlignedTableCell>
                  <LeftAlignedTableCell
                    colSpan={2}
                    style={{
                      display: "flex",
                      wordBreak: "break-word",
                    }}
                  >
                    <Tooltip title={row.legend} arrow>
                      <Button
                        onClick={() => window.open(row.legend)}
                        style={{ padding: 0 }}
                        disabled={
                          row.legend === "n.a." ||
                          row.legend === null ||
                          row.legend === ""
                        }
                      >
                        Legende öffnen
                      </Button>
                    </Tooltip>
                  </LeftAlignedTableCell>
                </TableRow>
                <TableRow>
                  <FillerTableCell />
                  <LeftAlignedTableCell></LeftAlignedTableCell>

                  <LeftAlignedTableCell colSpan={2}>
                    <Button
                      variant="outlined"
                      style={{
                        marginRight: mobileMode ? 16 : 30,
                        marginTop: mobileMode ? 6 : 1,
                        marginBottom: mobileMode ? 6 : 1,
                      }}
                      onClick={routeObjectBuilder().arcgis_handler}
                      startIcon={<DownloadIcon />}
                    >
                      {mobileMode ? "ArcGIS" : "For ArcGIS Pro"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={routeObjectBuilder().qgis_handler}
                      startIcon={<DownloadIcon />}
                    >
                      {mobileMode ? "QGIS" : " For QGIS"}
                    </Button>
                  </LeftAlignedTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </TableCell>
    </StyledTableRow>
  );
};
