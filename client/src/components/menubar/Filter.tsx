import { FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { PROVIDERLIST, SERVICELIST } from "src/constants";
import "../../styles.css";

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

type FilterProps = {
  handleChangeService: (event: SelectChangeEvent) => void;
  handleChangeProvider: (event: SelectChangeEvent) => void;
  provider: string;
  servicetype: string;
};

export const Filter = ({
  handleChangeService,
  handleChangeProvider,
  provider,
  servicetype,
}: FilterProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
        width: 500,
      }}
    >
      <FormControl
        variant="outlined"
        sx={{
          minWidth: 140,
          marginRight: 3,
        }}
      >
        <Select
          autoComplete="off"
          labelId="select-provider-label"
          id="select-provider"
          value={provider}
          onChange={handleChangeProvider}
          style={{
            backgroundColor: "white",
            textAlign: "center",
            height: 32,
            color: "#007CC3",
          }}
        >
          {PROVIDERLIST.map((provider) => {
            return (
              <MenuItem key={provider} value={provider}>
                {provider}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        sx={{
          minWidth: 140,
        }}
      >
        <Select
          autoComplete="off"
          defaultValue={""}
          labelId="select-service-label"
          id="select-service"
          value={servicetype}
          onChange={handleChangeService}
          style={{
            backgroundColor: "white",
            textAlign: "center",
            height: 32,
            color: "#007CC3",
          }}
        >
          {SERVICELIST.map((servicetype) => {
            return (
              <MenuItem key={servicetype} value={servicetype}>
                {servicetype}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <div style={{ width: 20 }} />
    </div>
  );
};
