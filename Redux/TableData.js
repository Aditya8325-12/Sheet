import { createSlice } from "@reduxjs/toolkit";
import React from "react";
const initialState = Array.from({ length: 1000 }, () =>
  Array.from({ length: 26 }, () => ({
    value: "",
    align: "end",
    fontsize: 20,
    texttype: "text",
    width: 10,
  }))
);

const tableDataSlice = createSlice({
  name: "tableData",
  initialState,
  reducers: {
    UpdateTableData(state, action) {
      const { rowIndex, colIndex, value } = action.payload;

      state[rowIndex][colIndex] = {
        ...state[rowIndex][colIndex],
        value: value,
        width: value.length,
      };
    },
    increaseFontSize(state, action) {
      const { rowIndex, colIndex } = action.payload;
      state[rowIndex][colIndex].fontsize += 1;
    },
    decreaseFontSize(state, action) {
      const { rowIndex, colIndex } = action.payload;
      state[rowIndex][colIndex].fontsize -= 1;
    },
    changeAlignment(state, action) {
      const { rowIndex, colIndex, newAlignment } = action.payload;
      state[rowIndex][colIndex].align = newAlignment;
    },
    changeTextType(state, action) {
      const { rowIndex, colIndex, newTextType } = action.payload;
      state[rowIndex][colIndex].texttype = newTextType;
    },
  },
});

export const {
  UpdateTableData,
  increaseFontSize,
  decreaseFontSize,
  changeAlignment,
  changeTextType,
} = tableDataSlice.actions;

export default tableDataSlice.reducer;
