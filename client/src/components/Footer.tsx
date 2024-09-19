import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

export const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        textAlign: "center",
      }}
    >
      <FormattedMessage
        id="footer.impressum"
        defaultMessage="© 2024 GeoHarvester | Ein Projekt in Zusammenarbeit mit dem Institut Geomatik, FHNW und swisstopo"
      />
    </Box>
  );
};
