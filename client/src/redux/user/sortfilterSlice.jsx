import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  filterdData: [],
  activeFilters: [], // store the array of server-side filters
  activeSort: "", // store the server-side sort string (e.g., 'price_asc')
  variantMode: false,
};

const sortfilterSlice = createSlice({
  name: "sortfilterSlice",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filterdData = action.payload;
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = action.payload;
    },
    setActiveSort: (state, action) => {
      state.activeSort = action.payload;
    },
    setVariantModeOrNot: (state, action) => {
      state.variantMode = action.payload;
    },
  },
});

export const {
  setData,
  setFilteredData,
  setActiveFilters,
  setActiveSort,
  setVariantModeOrNot,
} = sortfilterSlice.actions;
export default sortfilterSlice.reducer;
