import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const REQUEST_URL = process.env.NEXT_PUBLIC_REQUEST_URL;
// console.log("REQUEST_URL", REQUEST_URL);
export const getAsset = createAsyncThunk("asset/getAsset", async () => {
  // const response = await fetch("http://localhost:3000/api/asset");
  const response = await fetch(`${REQUEST_URL}/asset`);
  const assetData = await response.json();
  // console.log(assetData.res[0]);
  return assetData.res[0];
});

const assetSlice = createSlice({
  name: "assets",
  initialState: {
    assetData: [],
    assetLoading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getAsset.pending, (state) => {
      state.assetLoading = true;
    });
    builder.addCase(getAsset.fulfilled, (state, { payload }) => {
      state.assetLoading = false;
      state.assetData = payload;
    });
    builder.addCase(getAsset.rejected, (state, error) => {
      state.assetLoading = true;
      console.log(error);
    });
  },
});

export default assetSlice.reducer;
