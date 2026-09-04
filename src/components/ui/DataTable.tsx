import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { EmptyState, TableSkeleton } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filterSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  enableSelection?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  compact?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchKeys,
  filterSlot,
  actionsSlot,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search filters or add a new record.',
  onRowClick,
  pageSize = 10,
  enableSelection = false,
  selectedIds = [],
  onSelectionChange,
  compact = false,
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Search Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lower = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = item[k];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(lower);
        });
      }
      return Object.values(item).some(
        (val) => val !== undefined && val !== null && String(val).toLowerCase().includes(lower)
      );
    });
  }, [data, searchTerm, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / currentPageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    return sortedData.slice(start, start + currentPageSize);
  }, [sortedData, currentPage, currentPageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCurrent = paginatedData.map(keyExtractor);
      const union = Array.from(new Set([...selectedIds, ...allCurrent]));
      onSelectionChange?.(union);
    } else {
      const allCurrent = new Set(paginatedData.map(keyExtractor));
      onSelectionChange?.(selectedIds.filter((id) => !allCurrent.has(id)));
    }
  };

  const handleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(keyExtractor(item)));

  return (
    <div className={cn('w-full rounded-lg border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-sm', className)}>
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-[#292B30]">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full h-8.5 rounded-md border border-slate-300 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:border-[#292B30] dark:bg-[#101113] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500 transition-all"
            />
          </div>
          {filterSlot}
        </div>
        {actionsSlot && <div className="flex items-center gap-2">{actionsSlot}</div>}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton rows={currentPageSize} cols={columns.length + (enableSelection ? 1 : 0)} />
        ) : paginatedData.length === 0 ? (
          <div className="p-8">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-table-cell">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-[#292B30] dark:bg-[#131417] text-slate-600 dark:text-slate-400 font-semibold text-xs tracking-wider uppercase select-none">
                {enableSelection && (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      'px-4 py-3 font-semibold transition-colors',
                      col.sortable && 'cursor-pointer hover:text-slate-900 dark:hover:text-slate-200',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className
                    )}
                  >
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5',
                        col.align === 'center' && 'justify-center',
                        col.align === 'right' && 'justify-end'
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {sortKey === col.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#202227]">
              {paginatedData.map((item, idx) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'transition-colors text-slate-800 dark:text-slate-200',
                      onRowClick && 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-[#1D1F23]/60',
                      isSelected && 'bg-blue-50/40 dark:bg-blue-950/20',
                      compact ? 'h-10' : 'h-12'
                    )}
                  >
                    {enableSelection && (
                      <td className="w-10 px-4 py-2" onClick={(e) => handleSelectOne(id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-2 text-sm',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          col.className
                        )}
                      >
                        {col.render ? col.render(item) : item[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-[#292B30] text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-semibold text-slate-700 dark:text-slate-300">{(currentPage - 1) * currentPageSize + 1}</strong> to{' '}
              <strong className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(currentPage * currentPageSize, totalItems)}
              </strong>{' '}
              of <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalItems}</strong> entries
            </span>
            <select
              value={currentPageSize}
              onChange={(e) => {
                setCurrentPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Rows per page"
              className="ml-2 rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-300 focus:outline-none"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-[#292B30] hover:bg-slate-100 dark:hover:bg-[#1D1F23] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-[#292B30] hover:bg-slate-100 dark:hover:bg-[#1D1F23] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
