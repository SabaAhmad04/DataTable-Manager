import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface UIState {
  columns: ColumnConfig[];
  theme: 'light' | 'dark';
  search: string;
}

const initialState: UIState = {
  columns: [
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'role', label: 'Role', visible: true },
  ],
  theme: 'light',
  search: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleColumn: (state, action: PayloadAction<string>) => {
      const col = state.columns.find((c) => c.key === action.payload);
      if (col) col.visible = !col.visible;
    },
    addColumn: (state, action: PayloadAction<ColumnConfig>) => {
      state.columns.push(action.payload);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    reorderColumns: (state, action: PayloadAction<ColumnConfig[]>) => {
      state.columns = action.payload;
    },
  },
});

export const { toggleColumn, addColumn, setTheme, setSearch, reorderColumns } = uiSlice.actions;
export default uiSlice.reducer;
