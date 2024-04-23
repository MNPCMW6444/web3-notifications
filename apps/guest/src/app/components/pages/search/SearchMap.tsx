import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Grid } from "@mui/material";
import {
  Btn,
  findMe,
  PrimaryText,
  SearchContext,
  ServerContext,
} from "@w3notif/shared-react";

import LocationOnIcon from "../../../../../../../libs/shared-react/src/components/listings-parts/location.svg";

const customIcon = L.icon({
  iconUrl: LocationOnIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface SearchMapProps {
  setMap: Dispatch<SetStateAction<boolean>>;
}

const SearchMap = ({ setMap: sm }: SearchMapProps) => {
  const { query, setQuery } = useContext(SearchContext);
  const [map, setMap] = useState<L.Map>();
  const [pinLocation, setPinLocation] = useState<L.LatLng>();
  const [circleRadius, setCircleRadius] = useState<number>();
  const [myLocation, setMyLocation] = useState({
    lat: 40.71908450000001,
    lng: -74.0712621,
  });
  const [interactionMode, setInteractionMode] = useState("DEFAULT");
  const [radiusSelectionInProgress, setRadiusSelectionInProgress] =
    useState(false);
  const server = useContext(ServerContext);

  const setAsync = useCallback(async () => {
    if (
      query.params.location &&
      "address" in query.params.location &&
      "radius" in query.params.location &&
      server
    ) {
      const { data } = await server.axiosInstance.get(
        "api/geo/getLocation/" + query.params.location.address,
      );
      setPinLocation(new LatLng(data.lat, data.lng));
      setCircleRadius(query.params.location.radius);
      setInteractionMode("DONE");
    }
  }, [query.params.location, server]);

  useEffect(() => {
    if (!pinLocation && !circleRadius) {
      if (
        query.params.location &&
        "lat" in query.params.location &&
        "radius" in query.params.location
      ) {
        setPinLocation(
          new LatLng(query.params.location.lat, query.params.location.long),
        );
        setCircleRadius(query.params.location.radius);
        setInteractionMode("DONE");
      }
      setAsync();
    }
  }, [query, circleRadius, pinLocation, setAsync]);

  useEffect(() => {
    findMe().then((l) => l && setMyLocation({ lat: l.lat, lng: l.lng }));
  }, []);

  useEffect(() => {
    const initialMap = L.map("smap", {
      center: [myLocation.lat, myLocation.lng],
      zoom: 13,
    });

    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 25,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "Map data ©2022 Google",
    }).addTo(initialMap);

    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, [myLocation]);

  useEffect(() => {
    if (!map) return;

    const clearLayers = () => {
      map.eachLayer((layer) => {
        if (
          (layer as unknown as L.Map) !== map &&
          layer.options.attribution !== "Map data ©2022 Google"
        ) {
          map.removeLayer(layer);
        }
      });
    };

    if (interactionMode === "DEFAULT") {
      clearLayers();
      setRadiusSelectionInProgress(false);
    }

    if (interactionMode === "DONE" || interactionMode === "PIN_PLACEMENT") {
      clearLayers();
      if (pinLocation) {
        const tempMarker = L.marker([pinLocation.lat, pinLocation.lng], {
          icon: customIcon,
          opacity: interactionMode === "PIN_PLACEMENT" ? 0.5 : 1,
        }).addTo(map);

        if (circleRadius !== undefined || interactionMode === "DONE") {
          tempMarker.setOpacity(1);
          L.circle([pinLocation.lat, pinLocation.lng], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: circleRadius || 1,
          }).addTo(map);
          setRadiusSelectionInProgress(false);
        }
      }
    }

    const onClick = (e: L.LeafletMouseEvent) => {
      if (interactionMode === "PIN_PLACEMENT") {
        if (!pinLocation) {
          setPinLocation(e.latlng);
          setRadiusSelectionInProgress(true);
        } else if (circleRadius === undefined) {
          const radius = pinLocation.distanceTo(e.latlng);
          setCircleRadius(radius);
          setInteractionMode("DONE");
        }
      }
    };

    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
    };
  }, [map, pinLocation, circleRadius, interactionMode]);

  const reset = () => {
    setPinLocation(undefined);
    setCircleRadius(undefined);
    setInteractionMode("DEFAULT");
    setRadiusSelectionInProgress(false);
  };

  const enablePinPlacement = () => {
    setInteractionMode("PIN_PLACEMENT");
  };

  return (
    <Grid
      container
      direction="column"
      width="100%"
      height="100%"
      wrap="nowrap"
      justifyContent="space-between"
    >
      <Grid
        container
        width="100%"
        justifyContent="space-around"
        paddingTop="15px"
      >
        <Grid item>
          <Btn
            onClick={enablePinPlacement}
            disabled={interactionMode !== "DEFAULT"}
          >
            Pin
          </Btn>
        </Grid>
        <Grid item>
          <Btn onClick={reset}>Reset</Btn>
        </Grid>
        <Grid item>
          <Btn
            disabled={!pinLocation || !circleRadius}
            onClick={() =>
              circleRadius &&
              pinLocation &&
              setQuery((q) => {
                sm(false);
                return {
                  ...q,
                  params: {
                    ...q.params,
                    location: {
                      lat: pinLocation.lat,
                      long: pinLocation.lng,
                      radius: circleRadius || 1,
                    },
                  },
                };
              })
            }
          >
            Finish
          </Btn>
        </Grid>
      </Grid>

      {radiusSelectionInProgress && (
        <Grid item>
          <PrimaryText>Select radius by clicking on the map again</PrimaryText>
        </Grid>
      )}

      <Grid item width="100%" height="90%">
        <div
          id="smap"
          style={{ height: "100%", width: "100%", overflow: "hidden" }}
        />
      </Grid>
    </Grid>
  );
};

export default SearchMap;
