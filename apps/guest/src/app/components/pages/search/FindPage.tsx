import { CircularProgress, Grid } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AssetCard,
  Btn,
  ListingPage,
  MICO,
  PrimaryText,
  ServerContext,
} from "@w3notif/shared-react";
import { SearchContext } from "@w3notif/shared-react";
import { Asset } from "@w3notif/shared";
import { ResultsMap } from "@w3notif/shared-react";
import { useLocation } from "react-router-dom";
import { LocationOn, Tune } from "@mui/icons-material";

const FindPage = () => {
  const { setSearch, results, setResults, setQuery, fetch } =
    useContext(SearchContext);
  const [selectedListing, setSelectedListing] = useState<Asset>();
  const [mapMode, setMapMode] = useState(false);

  const server = useContext(ServerContext);

  const useQuery = () => {
    const location = useLocation();
    return useMemo(
      () => new URLSearchParams(location.search),
      [location.search],
    );
  };

  const query = useQuery();

  const fetchAsset = useCallback(
    async (id: string) => {
      const res = await server?.axiosInstance.get("api/search/single/" + id);
      res && setSelectedListing(res.data);
    },
    [server?.axiosInstance],
  );

  useEffect(() => {
    !results && fetch();
  }, [results, fetch]);

  useEffect(() => {
    const id = query.get("space");
    if (id) {
      fetchAsset(id);
    } else setSelectedListing(undefined);
  }, [query, fetchAsset, setResults]);

  return selectedListing ? (
    <ListingPage space={selectedListing} />
  ) : (
    <Grid
      container
      direction="column"
      width="100%"
      height="calc(100vh - 100px)"
      alignItems="center"
      rowSpacing={4}
      paddingTop="20px"
      overflow="scroll"
      wrap="nowrap"
    >
      {results ? (
        results.length > 0 ? (
          <>
            <Grid item width="100%" height="90px" padding="5% 5% 0">
              <Grid
                item
                container
                width="100%"
                height="100%"
                alignItems="center"
                wrap="nowrap"
                borderRadius="35px"
                boxShadow="1px 2px #bababa"
                onClick={() => {
                  setSearch(true);
                  setResults(undefined);
                }}
              >
                <Grid item width="10%" paddingLeft="5%">
                  <MICO>
                    <LocationOn />
                  </MICO>
                </Grid>
                <Grid item width="80%" paddingLeft="5%">
                  <PrimaryText>Click to open search</PrimaryText>
                </Grid>
                <Grid item width="10%">
                  <MICO>
                    <Tune />
                  </MICO>
                </Grid>
              </Grid>
            </Grid>
            {mapMode ? (
              <Grid item width="100%" height="calc(100% - 100px)">
                <ResultsMap setMap={setMapMode} assets={results} />
              </Grid>
            ) : (
              <>
                <Grid item>
                  <Btn onClick={() => setMapMode(true)}>Map View</Btn>
                </Grid>
                {results.map((asset) => (
                  <Grid item width="100%" key={asset._id.toString()}>
                    <AssetCard asset={asset} />
                  </Grid>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            <Grid item width="100%" padding="5% 5% 0">
              <PrimaryText>No Spaces found for selected filters</PrimaryText>
            </Grid>
            <Grid item width="100%" padding="5% 5% 0">
              <Btn
                onClick={() => {
                  setQuery({
                    config: {},
                    params: {},
                  });
                  setResults(undefined);
                  setSearch(true);
                }}
              >
                Re-Search
              </Btn>
            </Grid>
          </>
        )
      ) : (
        <Grid
          height="calc(96vh - 60px)"
          item
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default FindPage;
