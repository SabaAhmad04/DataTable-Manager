'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  toggleColumn,
  addColumn,
} from '@/redux/uiSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ManageColumnsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.ui.columns);
  const [newColumn, setNewColumn] = useState('');

  const handleToggle = (key: string) => {
    dispatch(toggleColumn(key));
  };

  const handleAddColumn = () => {
    if (!newColumn.trim()) return;

    const key = newColumn.trim().toLowerCase().replace(/\s+/g, '_');

    // Avoid duplicate keys
    if (columns.some((col) => col.key === key)) {
      alert('Column already exists!');
      return;
    }

    dispatch(
      addColumn({
        key,
        label: newColumn.trim(),
        visible: true,
      })
    );

    setNewColumn('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-[90%] md:w-[400px] shadow-lg relative">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Manage Columns</h2>

        {/* Column checkboxes */}
        <div className="mb-4 max-h-48 overflow-y-auto">
          {columns.map((col) => (
            <label key={col.key} className="flex items-center mb-2 text-sm dark:text-white">
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => handleToggle(col.key)}
                className="mr-2"
              />
              {col.label}
            </label>
          ))}
        </div>

        {/* Add new column */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="New column name"
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            className="flex-grow px-2 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={handleAddColumn}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ManageColumnsModal;
