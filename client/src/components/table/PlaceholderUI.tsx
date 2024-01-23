import { Typography, useTheme } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { FormattedMessage } from "react-intl";

export const PlaceholderWidget = ({
  placeholderText,
}: {
  placeholderText?: string;
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flex: 1,
      }}
    >
      {placeholderText ? (
        <Typography
          variant="h3"
          component="h3"
          color={theme.palette.info.light}
        >
          {placeholderText}
        </Typography>
      ) : (
        <div>
          <Typography
            variant="h5"
            component="h3"
            color={theme.palette.info.light}
          >
            <FormattedMessage id="placeholder.text" defaultMessage="Suche..." />
          </Typography>
          <LinearProgress sx={{ width: 300 }} />
        </div>
      )}
    </div>
  );
};
