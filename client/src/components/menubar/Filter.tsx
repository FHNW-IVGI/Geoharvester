import {
  FormControl,
  useTheme,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { PROVIDER, SERVICE } from "src/constants";
import "../../styles.css";
import { getIcon } from "src/custom/getIcon";
import { SearchParameters } from "src/types";

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

type FilterProps = {
  handleChangeService: (event: SelectChangeEvent) => void;
  handleChangeProvider: (event: SelectChangeEvent) => void;
  searchParameters: SearchParameters;
  // provider: PROVIDER;
  // servicetype: SERVICE;
};

export const Filter = ({
  handleChangeService,
  handleChangeProvider,
  searchParameters,
}: // provider,
// servicetype,
FilterProps) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
        marginRight: 10,
      }}
    >
      <FormControl variant="outlined">
        <Select
          className="Dropdown"
          autoComplete="off"
          labelId="select-provider-label"
          id="select-provider"
          value={searchParameters.provider}
          onChange={handleChangeProvider}
          MenuProps={{
            PaperProps: {
              sx: {
                display: "flex",
                alignItem: "center",
                height: "80vh",
              },
            },
          }}
          style={{
            backgroundColor: theme.palette.secondary.main,
            textAlign: "center",
            height: 40,
            color: theme.palette.primary.main,
          }}
        >
          {(Object.values(PROVIDER) as PROVIDER[]).map((provider) => {
            return (
              <MenuItem
                key={provider}
                value={provider}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {provider !== PROVIDER.NONE && (
                  <img
                    alt="sourceIcon"
                    src={getIcon(provider)}
                    height={25}
                    width={25}
                    style={{ marginRight: 8 }}
                  />
                )}
                {provider}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl variant="outlined">
        <Select
          className="Dropdown"
          autoComplete="off"
          labelId="select-service-label"
          id="select-service"
          value={searchParameters.service}
          onChange={handleChangeService}
          style={{
            backgroundColor: theme.palette.secondary.main,
            textAlign: "center",
            height: 40,
            color: theme.palette.primary.main,
          }}
        >
          {(Object.values(SERVICE) as SERVICE[]).map((servicetype) => {
            return (
              <MenuItem key={servicetype} value={servicetype}>
                {servicetype === SERVICE.NONE ? "Alle Services" : servicetype}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
