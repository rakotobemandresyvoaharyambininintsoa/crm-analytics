"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];

  loading?: boolean;

  pageSize?: number;

  searchable?: boolean;

  onRowClick?: (row: T) => void;

  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  pageSize = 10,
  searchable = true,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // 🔎 SEARCH
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // ↕ SORT
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortAsc]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">

      {/* 🔎 SEARCH BAR */}
      {searchable && (
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border px-3 py-2 rounded-lg"
        />
      )}

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm min-w-[700px]">

          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() =>
                    col.sortable && toggleSort(String(col.key))
                  }
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </th>
              ))}

              {actions && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-10 text-gray-500"
                >
                  📭 Aucune donnée trouvée
                </td>
              </tr>
            ) : (
              paginatedData.map((row: any, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : row[col.key]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-3">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex items-center justify-between text-sm">
        <span>
          Page {page} / {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded flex items-center gap-1"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}