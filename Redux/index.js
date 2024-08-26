import { configureStore } from "@reduxjs/toolkit";
import tableDataSlice from "./TableData";
import React from "react";

const store = configureStore({
  reducer: {
    tData: tableDataSlice,
  },
});

export default store;
