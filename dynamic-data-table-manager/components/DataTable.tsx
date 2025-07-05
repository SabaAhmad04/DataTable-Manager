'use client';

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setSearch, setTheme } from '@/redux/uiSlice';
import { setRows, updateRow, deleteRow, RowData } from '@/redux/dataSlice';
import ManageColumnsModal from './ManageColumnsModal';
import { importCSV, exportCSV } from '@/utils/csvHelpers';

const DataTable = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.data.rows);
  const columns = useSelector((state: RootState) =>
    state.ui.columns.filter((col) => col.visible)
  );
  const searchTerm = useSelector((state: RootState) => state.ui.search);
  const currentTheme = useSelector((state: RootState) => state.ui.theme);

  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (colKey: string) => {
    if (sortBy === colKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(colKey);
      setSortDir('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
    setCurrentPage(1);
  };

  const handleEditClick = (rowId: string) => {
    setEditRowId(rowId);
    const currentRow = rows.find((r) => r.id === rowId);
    if (currentRow) setEditFormData({ ...currentRow });
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    dispatch(updateRow(editFormData as RowData));
    setEditRowId(null);
  };

  const handleDelete = (rowId: string) => {
    if (confirm('Are you sure you want to delete this row?')) {
      dispatch(deleteRow(rowId));
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const filteredRows = useMemo(() => {
    const filtered = rows.filter((row) =>
      Object.values(row).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [rows, searchTerm, sortBy, sortDir]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      {/* 🔍 Search + Manage Columns + Theme Toggle */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-3 py-2 border rounded-md w-full md:w-1/3 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              dispatch(setTheme(currentTheme === 'dark' ? 'light' : 'dark'))
            }
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm"
          >
            {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Manage Columns
          </button>
        </div>
      </div>

      {/* 📥 Import & 📤 Export */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                const imported = await importCSV(file);
                dispatch(setRows(imported));
              } catch (err) {
                alert('Error importing CSV');
              }
            }
          }}
          className="text-sm file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded file:border-0"
        />
        <button
          onClick={() => exportCSV(rows, columns.map((c) => c.key))}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* 🧾 Data Table */}
      <div className="overflow-auto rounded-md shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left font-semibold border-b border-gray-300 dark:border-gray-600 cursor-pointer select-none"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortBy === column.key && (
                    <span className="ml-1 text-xs">
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold border-b border-gray-300 dark:border-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200"
                  >
                    {editRowId === row.id ? (
                      <input
                        value={editFormData[column.key] ?? ''}
                        onChange={(e) => handleEditChange(e, column.key)}
                        className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      row[column.key] ?? '-'
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 text-sm">
                  {editRowId === row.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 mr-2 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(row.id)}
                        className="text-blue-600 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-300">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ⚙️ Modal */}
      <ManageColumnsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default DataTable;
