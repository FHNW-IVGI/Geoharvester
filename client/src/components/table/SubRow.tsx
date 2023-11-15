import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  Button,
  Tooltip,
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
  const rowsToInclude = [
    "name",
    "contact",
    "abstract",
    "tree",
    "group",
    "keywords",
    "metadata",
    "endpoint",
  ];

  console.log(row);

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

  const StyledTableRow = styled(TableRow)(() => ({
    "&": {
      backgroundColor: "#fdfdfd",
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
          <Box
            sx={{
              margin: mobileMode ? 0 : 1,
              // padding: mobileMode ? "15px -5px 5px 15px" : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: mobileMode ? -70 : -10,
              }}
            >
              {rowsToInclude.map((prop) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div style={{ width: 180 }}>
                    <p
                      style={{
                        width: 140,
                        color: "#909090",
                        margin: "0 24px 0 78px",
                      }}
                    >
                      {`${
                        prop.charAt(0).toUpperCase() +
                        prop.slice(1).toLocaleLowerCase()
                      }:`}
                    </p>
                  </div>

                  <div
                    style={{
                      color: "#909090",
                      display: "flex",
                      wordBreak: "break-word",
                    }}
                  >
                    <p style={{ margin: 2 }}>{row[prop as keyof Geoservice]}</p>
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>
                  <p
                    style={{
                      width: 140,
                      color: "#909090",
                      margin: "0 50px 0 78px",
                    }}
                  >
                    Mapgeo:
                  </p>
                </div>
                <div
                  style={{
                    color: "#909090",
                    display: "flex",
                    wordBreak: "break-word",
                    marginLeft: -90,
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
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>
                  <p
                    style={{
                      width: 140,
                      marginLeft: -24,
                      color: "#909090",
                      margin: "0 50px 0 78px",
                    }}
                  >
                    Legend:
                  </p>
                </div>
                <div
                  style={{
                    color: "#909090",
                    display: "flex",
                    wordBreak: "break-word",
                    marginLeft: -90,
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
                </div>
              </div>
              <div
                style={{
                  marginLeft: 200,
                  marginTop: 12,
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Button
                  variant="outlined"
                  style={{ marginRight: 30, marginLeft: -24 }}
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
              </div>
            </div>
          </Box>
        </Collapse>
      </TableCell>
    </StyledTableRow>
  );
};
