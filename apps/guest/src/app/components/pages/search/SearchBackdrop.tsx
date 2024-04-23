import {
  ClickAwayListener,
  Grid,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import {
  axiosErrorToaster,
  Btn,
  CloseButton,
  MICO,
  PrimaryText,
  renderDropdown,
  SearchContext,
  ServerContext,
} from "@w3notif/shared-react";
import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AssetType, format } from "@w3notif/shared";
import SearchMap from "./SearchMap";
import { SearchOutlined } from "@mui/icons-material";

const defaultCities = ["Tel Aviv, Israel", "New York, NY, USA"];

const SearchBackdrop = () => {
  const { query, setQuery, fetch } = useContext(SearchContext);
  const server = useContext(ServerContext);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const textFieldRef = useRef<ElementRef<typeof TextField>>(null);
  const [map, setMap] = useState(false);

  const fetchSuggestions = useCallback(
    async (value: string) => {
      try {
        setSuggestions([...defaultCities]);
        setSuggestions([
          ...new Set([
            ...defaultCities,
            ...((
              await server?.axiosInstance.get(
                `/api/geo/autocomplete-address/${value}`,
              )
            )?.data?.map(
              ({ description }: { description: string }) => description,
            ) || []),
          ]),
        ]);
      } catch (e) {
        axiosErrorToaster(e);
      }
    },
    [server?.axiosInstance],
  );

  useEffect(() => {
    if (
      query.params.location &&
      "address" in query.params.location &&
      query.params.location.address.length > 0 &&
      open
    ) {
      fetchSuggestions(query.params.location.address);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query, fetchSuggestions, open]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery((p) => ({
      ...p,
      params: {
        ...p.params,
        location: {
          ...(p.params.location || { radius: 0 }),
          address: suggestion,
        },
      },
    }));
    setOpen(false);
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return map ? (
    <SearchMap setMap={setMap} />
  ) : (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      rowSpacing={4}
      height="100%"
    >
      <Grid item height="5%" />
      <Grid item container columnSpacing={4}>
        <Grid item width="1%" />
        <Grid item width="14%">
          <CloseButton
            sx={{
              bgcolor: (theme) => theme.palette.background.default,
              border: (theme) =>
                "1px solid " + theme.palette.primary.contrastText,
              width: "50%",
              height: "50%",
            }}
            onClick={fetch}
          />
        </Grid>
        <Grid item width="10%" />
        <Grid item width="55%">
          <PrimaryText variant="h5">Adjust your w3notif:</PrimaryText>
        </Grid>
        <Grid item width="20%" />
      </Grid>
      <Grid item container columnSpacing={2} alignItems="center" wrap="nowrap">
        <Grid width="5%" />
        <Grid item width="45%">
          <PrimaryText variant="h4">Where to?</PrimaryText>
        </Grid>
        <Grid item width="15%">
          <PrimaryText>-or-</PrimaryText>
        </Grid>
        <Grid item width="35%">
          <Btn onClick={() => setMap(true)}>mark on map</Btn>
        </Grid>
      </Grid>
      <Grid item container columnSpacing={2} alignItems="center" wrap="nowrap">
        <Grid width="10%" />
        {/* <Grid item width="40%">
          <PrimaryText>Address: </PrimaryText>
        </Grid>*/}
        <Grid
          item
          width="80%"
          borderRadius="30px"
          border="1px solid #BABABA"
          container
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item width="11%">
            <MICO>
              <SearchOutlined />
            </MICO>
          </Grid>
          <Grid item width="99%">
            <TextField
              variant="standard"
              ref={textFieldRef}
              placeholder="Search w3notif places…"
              fullWidth
              value={
                (query.params.location &&
                  "address" in query.params.location &&
                  query.params.location.address) ||
                (query.params.location && "lat" in query.params.location
                  ? "Pinned Location"
                  : "")
              }
              onChange={(e) => {
                setQuery((p) => ({
                  ...p,
                  params: {
                    ...p.params,
                    location: {
                      ...(p.params.location || { radius: 0 }),
                      address: e.target.value,
                    },
                  },
                }));
                setOpen(true);
              }}
            />
            {open && (
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    marginTop: "8px",
                    width: "inherit",
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </MenuItem>
                  ))}
                </Paper>
              </ClickAwayListener>
            )}
          </Grid>
        </Grid>
      </Grid>
      {query.params.location && (
        <Grid
          item
          container
          columnSpacing={2}
          alignItems="center"
          wrap="nowrap"
        >
          <Grid width="5%" />
          <Grid item width="40%">
            <PrimaryText>Radius: (m)</PrimaryText>
          </Grid>
          <Grid item>
            <TextField
              value={query.params.location?.radius || 0}
              onChange={(e) =>
                setQuery((p) =>
                  p.params.location
                    ? {
                        ...p,
                        params: {
                          ...p.params,
                          location: {
                            ...p.params.location,
                            radius: parseInt(e.target.value),
                          },
                        },
                      }
                    : p,
                )
              }
              type="number"
            />
          </Grid>
        </Grid>
      )}
      <Grid item container columnSpacing={2} alignItems="center" wrap="nowrap">
        <Grid width="5%" />
        <Grid item width="40%">
          <PrimaryText>Minimum Price: </PrimaryText>
        </Grid>
        <Grid item>
          <TextField
            value={query.params.minPricePerMonth}
            onChange={(e) =>
              setQuery((p) => ({
                ...p,
                params: {
                  ...p.params,
                  minPricePerMonth: parseInt(e.target.value),
                },
              }))
            }
            type="number"
          />
        </Grid>
      </Grid>
      <Grid item container columnSpacing={2} alignItems="center" wrap="nowrap">
        <Grid width="5%" />
        <Grid item width="40%">
          <PrimaryText>Maximum Price: </PrimaryText>
        </Grid>
        <Grid item>
          <TextField
            value={query.params.maxPricePerMonth}
            onChange={(e) =>
              setQuery((p) => ({
                ...p,
                params: {
                  ...p.params,
                  maxPricePerMonth: parseInt(e.target.value),
                },
              }))
            }
            type="number"
          />
        </Grid>
      </Grid>
      <Grid item container columnSpacing={2} alignItems="center" wrap="nowrap">
        <Grid width="5%" />
        <Grid item width="40%">
          <PrimaryText>Space Type: </PrimaryText>
        </Grid>
        <Grid item>
          {renderDropdown(
            query,
            (_, value) => {
              setQuery((p) => ({
                ...p,
                params: { ...p.params, asset_type: value as AssetType },
              }));
            },
            ["params", "asset_type"],
            "Type: ",
            Object.values(AssetType).map((value) => ({
              value,
              label: format(value),
            })),
          )}
        </Grid>
      </Grid>
      {/*TODO amenities*/}
      {/*TODO map*/}
      <Grid item>
        <Btn onClick={fetch}>Find a place</Btn>
      </Grid>
    </Grid>
  );
};

export default SearchBackdrop;
