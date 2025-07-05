import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RowData {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

interface DataState {
  rows: RowData[];
}

const initialState: DataState = {
  rows: [
    {
      id: '1',
      name: 'Saba Ahmad',
      email: 'saba123@gmail.com',
      age: 23,
      role: 'Frontend Developer',
    },
    {
      id: '2',
      name: 'Ravi Kumar',
      email: 'ravi123@gmail.com',
      age: 25,
      role: 'Frontend Developer',
    },
  ],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<RowData>) => {
      state.rows.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<RowData>) => {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) state.rows[index] = action.payload;
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
    setRows: (state, action: PayloadAction<RowData[]>) => {
      state.rows = action.payload;
    },
  },
});

export const { addRow, updateRow, deleteRow, setRows } = dataSlice.actions;
export default dataSlice.reducer;
