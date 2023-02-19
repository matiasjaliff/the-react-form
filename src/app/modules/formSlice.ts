import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Document {
  url: string | null;
  name: string | null;
  data: string | null;
}

export interface DataState {
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  companyName: string;
  creationDate: string;
  document: Document;
  [key: string]: string | Document;
}

const initialState: DataState = {
  firstName: "",
  lastName: "",
  idNumber: "",
  email: "",
  companyName: "",
  creationDate: "",
  document: {
    url: null,
    name: null,
    data: null,
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
