import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "25px",
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        textAlign: "center",
      }}
    >
      © 2023 GeoHarvester | Ein Projekt in Zusammenarbeit mit dem Institut
      Geomatik, FHNW und swisstopo
    </Box>
  );
};
