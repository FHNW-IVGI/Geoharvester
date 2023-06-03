import { TableRow, TableCell, Collapse, Box, Button, Tooltip } from "@mui/material";
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
}: {
  row: Geoservice;
  open: boolean;
  index: number;
}) => {
  const rowsToInclude = [
    "NAME",
    "CONTACT",
    "ABSTRACT",
    "TREE",
    "GROUP",
    "KEYWORDS",
    "METADATA",
    "SERVICELINK",
  ];


  const routeObjectBuilder = () => {
    if (!row || !row.SERVICETYPE) {
      return {
        arcgis_handler: () => "error",
        qgis_handler: () => "error",
      };
    }

    return row.SERVICETYPE.includes("WFS")
      ? {
          arcgis_handler: () => getArcgisproWFS(row),
          qgis_handler: () => getQgisWFS(row),
        }
      : row.SERVICETYPE.includes("WMS")
      ? {
          arcgis_handler: () => getArcgisproWMS(row),
          qgis_handler: () => getQgisWMS(row),
        }
      : {
          arcgis_handler: () => getArcgisproWMTS(row),
          qgis_handler: () => getQgisWMTS(row),
        };
  };

  const openUrlMapgeo = () => {
    if (row.MAPGEO === "n.a." || row.MAPGEO === null || row.MAPGEO === "") {
  } else {
    window.open(row.MAPGEO);
  }};

  const openUrlLegend = () => {
    if (row.LEGEND === "n.a." || row.LEGEND === null || row.LEGEND === "") {
    }else {
    window.open(row.LEGEND);
  }};

  const StyledTableRow = styled(TableRow)(({}) => ({
    "&": {
      backgroundColor: "#fdfdfd",
    },
  }));

  return (
    <StyledTableRow key={index}>
      <TableCell
        style={{
          paddingBottom: 0,
          paddingTop: 0,
          boxShadow: "inset 0px 0px 6px 0px rgba(0, 0, 0, 0.15)",
        }}
        colSpan={6}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {rowsToInclude.map((prop) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{}}>
                    <p
                      style={{
                        width: 140,
                        color: "#909090",
                        margin: "0 50px 0 78px",
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
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{}}>
                    <p 
                    style={{
                        width: 140,
                        color: "#909090",
                        margin: "0 50px 0 78px",
                      }}
                    >Mapgeo:
                    </p>
                  </div>
                  <div
                    style={{
                      color: "#909090",
                      display: "flex",
                      wordBreak: "break-word",
                    }}
                  >
                    <Tooltip title={row.MAPGEO} arrow>
                      <a onClick={openUrlMapgeo} style={{ margin: 2}}>Service in MapGeo öffnen</a>
                    </Tooltip>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{}}>
                    <p 
                    style={{
                        width: 140,
                        color: "#909090",
                        margin: "0 50px 0 78px",
                      }}
                    >Legend:
                    </p>
                  </div>
                  <div
                    style={{
                      color: "#909090",
                      display: "flex",
                      wordBreak: "break-word",
                    }}
                  >
                    <Tooltip title={row.LEGEND} arrow>
                      <a onClick={openUrlLegend} style={{ margin: 2}}>Legende öffnen</a>
                    </Tooltip>
                  </div>
                </div>
              <div
                style={{
                  marginLeft: 270,
                  marginTop: 12,
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Button
                  variant="outlined"
                  style={{ marginRight: 30 }}
                  onClick={routeObjectBuilder().arcgis_handler}
                  startIcon={<DownloadIcon />}
                >
                  For ArcGIS Pro
                </Button>
                <Button
                  variant="outlined"
                  onClick={routeObjectBuilder().qgis_handler}
                  startIcon={<DownloadIcon />}
                >
                  For QGIS
                </Button>
              </div>
            </div>
          </Box>
        </Collapse>
      </TableCell>
    </StyledTableRow>
  );
};
