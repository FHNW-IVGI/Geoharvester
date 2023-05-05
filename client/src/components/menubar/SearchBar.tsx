import { useState, useEffect } from "react";
import {
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Button,
  Stack,
  Toolbar,
  styled,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { getData } from "../../requests";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles.css";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ProviderList = ["KT_AI", "KT_AR", "KT_AG", "KT_BL", "KT_BS", "KT_BE", "KT_GE", "KT_GL", "KT_GR", "KT_JU", "KT_SG", "KT_SH", 
"KT_SO", "KT_SZ", "KT_TG", "KT_TI", "KT_UR", "KT_ZG", "KT_ZH", "KT_VD", "KT_FR", "FL_LI", "Geodienste", "Bund"]
const ServiceList = ["WFS", "WMS", "WMTS"]

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

export const SearchBar = ({
  setSearchResult,
  setPlaceholderText,
}: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");
  const [servicetype, setService] = useState("");
  const [provider, setProvider] = useState("");

  const triggerSearch = async () => {
    await getData(searchString)
      .then((res) => {
        const { data } = res;
        setSearchResult(data);
      })
      .catch((e) => {
        console.error(e);
        setSearchResult([]); // Fallback on error
      });
    setPlaceholderText("Keine Treffer :(");
  };

  // useEffect(() => {
  //   console.log({ servicetype });
  //   return () => {
  //     triggerFilter();
  //   };
  // }, [servicetype]);

  // useEffect(() => {
  //   console.log({ provider });
  //   return () => {
  //     triggerFilter();
  //   };
  // }, [provider]);

  const handleChangeService = (event: SelectChangeEvent) => {
    setService(event.target.value);
    triggerFilter()
  };

  const handleChangeProvider = (event: SelectChangeEvent) => {
    setProvider(event.target.value);
    triggerFilter()

  };

  const triggerFilter = async () => {
    await getData(searchString, servicetype, provider) 
      .then((res) => {
        const { data } = res;
        setSearchResult(data);
      })
      .catch((e) => {
        console.error(e);
        setSearchResult([]); // Fallback on error
      });
      setPlaceholderText("Keine Treffer :(");
    };

  const SearchButton = styled(Button)(({}) => ({
    color: "#101010",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#F0F0F0",
    },
  }));
  
  return (
    <Toolbar
      variant="dense"
      style={{
        backgroundColor: "#ffdcc5",
        borderBottom: " 1px solid rgb(189, 189, 189)",
      }}
    >
      <div id="search">
        <div style={{ width: "15vw" }}></div>
        <div style={{ width: "70vw" }}>
          <FormControl
            sx={{
              m: 1,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",

              backgroundColor: "#ffdcc5",
            }}
            variant="standard"
          >
            <OutlinedInput
              autoFocus
              autoComplete="off"
              id="webservicesearch"
              type="outlined"
              placeholder="Webservice suchen..."
              value={searchString}
              style={{
                width: 600,
                height: 40,
                backgroundColor: "white",
              }}
              onChange={(e) => setSearchString(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
              startAdornment={
                <SearchIcon style={{ marginLeft: -8, marginRight: 6 }} />
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearchString("")}
                  >
                    <CancelIcon style={{ marginRight: -14, marginLeft: -8 }} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <SearchButton
              id="search-button"
              size="small"
              onClick={triggerSearch}
              sx={{
                fontSize: 14,
                backgroundColor: "white",
              }}
              type="submit"
              variant="outlined"
              aria-label="search"
              // color="white"
            >
              {"Suchen"}
            </SearchButton>
          </FormControl>
        </div>
        <div>
          <Stack direction="row" >
          <FormControl variant="standard" sx={{ marginTop: -1, marginRight:1, marginBottom:1,  marginLeft:2.8, minWidth: 120 }}>
            <InputLabel id="input-service-label">Service Type</InputLabel>
            <Select
              defaultValue={""}
              labelId="select-service-label"
              id="select-service"
              value={servicetype}
              onChange={handleChangeService}
              label="Service Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ServiceList.map((servicetype) => {
                return (
                  <MenuItem 
                    key={servicetype}
                    value={servicetype}>{servicetype}
                  </MenuItem>
                  );
                })}
            </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ marginTop: -1, marginRight:1, marginBottom:1,  marginLeft:1, minWidth: 120 }}>
            <InputLabel id="input-provider-label">Provider</InputLabel>
            <Select
              defaultValue={""}
              labelId="select-provider-label"
              id="select-provider"
              value={provider}
              onChange={handleChangeProvider}
              label="Provider"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ProviderList.map((provider) => {
                return (
                  <MenuItem 
                    key={provider}
                    value={provider}>{provider}
                  </MenuItem>
                  );
                })}
            </Select>
        </FormControl>
        </Stack>  
        </div>
      </div>
    </Toolbar>
  );
};