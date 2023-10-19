import {
  FormControl,
  useTheme,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { PROVIDERTYPE, SERVICE } from "src/constants";
import "../../styles.css";
import { getIcon } from "src/custom/getIcon";

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

type FilterProps = {
  handleChangeService: (event: SelectChangeEvent) => void;
  handleChangeProvider: (event: SelectChangeEvent) => void;
  provider: PROVIDERTYPE;
  servicetype: SERVICE;
};

export const Filter = ({
  handleChangeService,
  handleChangeProvider,
  provider,
  servicetype,
}: FilterProps) => {
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
          value={provider}
          onChange={handleChangeProvider}
          style={{
            backgroundColor: theme.palette.secondary.main,
            textAlign: "center",
            height: 40,
            color: theme.palette.primary.main,
          }}
        >
          {(Object.values(PROVIDERTYPE) as PROVIDERTYPE[]).map((provider) => {
            return (
              <MenuItem key={provider} value={provider}>
                {provider !== PROVIDERTYPE.NONE && (
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
          value={servicetype}
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
