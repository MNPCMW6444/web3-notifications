import { Grid } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";

const NavBar = () => {
  return (
    <Grid
      height="100%"
      width="100%"
      container
      direction="column"
      justifyContent="space-between"
      alignContent="center"
      wrap="nowrap"
    >
      <Grid item width="100%" overflow="scroll" height="100%">
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </Grid>
    </Grid>
  );
};

export default NavBar;
