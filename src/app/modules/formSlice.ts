import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Document {
  url: string | null;
  name: string | null;
}

interface DataState {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  document: Document;
  [key: string]: string | Document;
}

const initialState: DataState = {
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  document: {
    url: null,
    name: null,
  },
};

export const formSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateInput: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      state.document = action.payload;
    },
    reset: (state) => {
      console.log("Reset");
      for (const key in initialState) {
        if (Object.prototype.hasOwnProperty.call(initialState, key)) {
          state[key] = initialState[key];
        }
      }
    },
  },
});

export const { updateInput, updateDocument, reset } = formSlice.actions;

export default formSlice.reducer;
