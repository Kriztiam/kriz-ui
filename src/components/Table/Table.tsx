"use client";

import styles from "./Table.module.css";
import { isValidElement, useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Ellipsis from "@/assets/img/icons/Ellipsis.svg";
import Pen from "@/assets/img/icons/Pen.svg";
import Sort from "@/assets/img/icons/Sort.svg";
import SortDown from "@/assets/img/icons/SortDown.svg";
import SortUp from "@/assets/img/icons/SortUp.svg";
import Trash from "@/assets/img/icons/Trash.svg";

interface TableDataRow {
  [key: string]: string | number | React.ReactNode;
}

/** To use checkboxSelection, rowEditFunction and rowDeleteFunction you need to provide an unique id: string | number; for each object in the tableData. */
export default function Table({
  tableData,
  tableHeadLabels = Object.keys(tableData[0]),
  denseTable,
  searchTerm,
  checkboxSelection,
  setSelectedTableRows,
  rowEditFunction,
  rowDeleteFunction,
}: {
  tableData: {
    id?: string | number;
    [key: string]: string | number | React.ReactElement | undefined;
  }[];
  tableHeadLabels?: string[];
  denseTable?: boolean;
  searchTerm?: string;
  checkboxSelection?: boolean;
  setSelectedTableRows?: React.Dispatch<
    React.SetStateAction<(string | number)[] | null>
  >;
  rowEditFunction?: (id: string | number) => void;
  rowDeleteFunction?: (id: string | number) => void;
}) {
  const rowDataKeys = Object.keys(tableData[0]);

  const [sortedColumn, setSortedColumn] = useState<number | null>(null);
  const [descendingOrder, setDescendingOrder] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState<(string | number)[]>(
    []
  );

  function extractText(element: React.ReactNode): string {
    if (typeof element === "string" || typeof element === "number") {
      return element.toString();
    }
    if (isValidElement(element)) {
      const reactElement = element as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return extractText(reactElement.props.children);
    }
    return "";
  }

  function extractNumericValue(value: string | number): number {
    return typeof value === "number" ? value : parseFloat(value);
  }

  function compareValues(
    a: TableDataRow,
    b: TableDataRow,
    sortedColumn: number | null,
    descendingOrder: boolean
  ): number {
    if (sortedColumn === null) return 0;

    const key = rowDataKeys[sortedColumn];
    const aValue = extractText(a[key]);
    const bValue = extractText(b[key]);

    const aNumeric = extractNumericValue(aValue);
    const bNumeric = extractNumericValue(bValue);

    if (descendingOrder) {
      if (!isNaN(aNumeric) && !isNaN(bNumeric)) {
        return aNumeric > bNumeric ? -1 : aNumeric < bNumeric ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    } else {
      if (!isNaN(aNumeric) && !isNaN(bNumeric)) {
        return aNumeric < bNumeric ? -1 : aNumeric > bNumeric ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    }
  }

  const filteredAndSortedRows = tableData
    .filter((item: TableDataRow) => {
      if (!searchTerm || searchTerm === "") return true;
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    })
    .sort((a, b) => compareValues(a, b, sortedColumn, descendingOrder));

  const handleSort = (columnNumber: number) => {
    if (sortedColumn === columnNumber) {
      setDescendingOrder(!descendingOrder);
    } else {
      setSortedColumn(columnNumber);
      setDescendingOrder(false);
    }
  };

  const handleSelectAll = () => {
    const isAllSelected =
      filteredAndSortedRows.length > 0 &&
      selectedRowsIds.length === filteredAndSortedRows.length;
    setSelectedRowsIds(
      isAllSelected ? [] : filteredAndSortedRows.map((row) => row.id ?? "")
    );
  };

  const handleRowSelect = (rowId: string | number) => {
    setSelectedRowsIds((selectedRows) =>
      selectedRows.includes(rowId)
        ? selectedRows.filter((id) => id !== rowId)
        : [...selectedRows, rowId]
    );
  };

  useEffect(() => {
    if (setSelectedTableRows) {
      setSelectedTableRows(selectedRowsIds);
    }
  }, [selectedRowsIds, setSelectedTableRows]);

  return (
    <table
      className={[styles.Table, denseTable && styles.TableDense]
        .filter(Boolean)
        .join(" ")}
    >
      <thead>
        <tr>
          {checkboxSelection && (
            <th scope="col">
              <label>
                <input
                  type="checkbox"
                  checked={
                    filteredAndSortedRows.length > 0 &&
                    selectedRowsIds.length === filteredAndSortedRows.length
                  }
                  onChange={handleSelectAll}
                />
                <span>Select all rows</span>
              </label>
            </th>
          )}

          {tableHeadLabels.map((element, i) => (
            <th scope="col" key={element}>
              <button type="button" onClick={() => handleSort(i)}>
                {element}
                {sortedColumn === i ? (
                  descendingOrder ? (
                    <SortDown />
                  ) : (
                    <SortUp />
                  )
                ) : (
                  <Sort />
                )}
              </button>
            </th>
          ))}

          {(rowEditFunction || rowDeleteFunction) && (
            <th scope="col">
              <Ellipsis />
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {filteredAndSortedRows.map((row, rowIndex) => {
          const hasId = row.id !== undefined;
          const isRowSelected = hasId && selectedRowsIds.includes(row.id!);

          return (
            <tr key={`row-${rowIndex}`}>
              {checkboxSelection && hasId && (
                <td>
                  <label>
                    <input
                      type="checkbox"
                      checked={isRowSelected}
                      onChange={() => handleRowSelect(row.id!)}
                    />
                    <span>Select row</span>
                  </label>
                </td>
              )}

              {rowDataKeys.map((headerKey) => (
                <td key={`row-${rowIndex}-${headerKey}`}>{row[headerKey]}</td>
              ))}

              {(rowEditFunction || rowDeleteFunction) && hasId && (
                <td>
                  {rowEditFunction && (
                    <Button
                      color="hsl(var(--colorInfo))"
                      onClick={() => rowEditFunction(row.id!)}
                    >
                      <Pen />
                    </Button>
                  )}
                  {rowDeleteFunction && (
                    <Button
                      color="hsl(var(--colorError))"
                      onClick={() => rowDeleteFunction(row.id!)}
                    >
                      <Trash />
                    </Button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
