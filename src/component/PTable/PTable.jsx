import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TableContainer,
  Box,
  Checkbox, Tooltip
} from "@mui/material";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";

const PTable = ({ columns, rows, onClick, isChecked = false, showCheckbox = false, onValidationChange, selectedRows = [], disabled = false, showHeader = true, showPagination = true, bgColor = false }) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isPageLoad = useRef(false);

  // Parent Select All
  const handleRowSelect = (row) => {
    let update;
    if (row.itemNumber) {
      const isSame = selectedRows.some(item => item.itemNumber === row.itemNumber && item.supplierId === row.supplierId);
      const filtered = selectedRows.filter(item => item.itemNumber !== row.itemNumber);
      update = isSame ? filtered : [...filtered, row];
    } else {
      const exists = selectedRows.some(item => item.supplierId === row.supplierId);
      update = exists
        ? selectedRows.filter(item => item.supplierId !== row.supplierId)
        : [...selectedRows, { supplierId: row.supplierId, suppliername: row.suppliername }];
    }
    onValidationChange?.(update);
  };

  const isSelected = (data) => {
    if (data.itemNumber) {
      return selectedRows.some(item => item.itemNumber === data.itemNumber && item.supplierId === data.supplierId);
    }
    return selectedRows.some(item => item.supplierId === data.supplierId);
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Show only selected rows when global checkbox checked
  const filteredRows = isChecked ? rows.filter(row => selectedRows.some(sel => sel.supplierId === row.supplierId)) : (Array.isArray(rows) ? rows : []);

  const renderText = (value) => {
    const text = value == null || value === 0 ? "" : typeof value === "number" ? value.toFixed(2) : String(value);
    return <Tooltip title={text}><span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span></Tooltip>;
  };

  const renderCell = (col, data, rowIndex, meta = {}) => {
    const content = col.render ? col.render(data, rowIndex) : renderText(data[col.field]);
    if (showCheckbox && meta.isFirstCol) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox
            size="small"
            checked={disabled ? false : isSelected(data)}
            onChange={() => handleRowSelect(data)}
            disabled={disabled}
          />
          {content}
        </Box>
      );
    }
    return content;
  };

  const renderRow = (row, index) => (
    <TableRow
      key={row.supplierID ?? index}
      onClick={() => onClick?.(row)}
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:hover": { backgroundColor: "#f1f5f9" },
        backgroundColor: index % 2 ? "#f9fafb" : "#fff"
      }}
    >
      {columns.map((col, i) => (
        <TableCell
          key={i}
          sx={{
            fontSize: Labels.fontSize.xs,
            color: CommonColors.pTable.darkGrey,
            py: 1.8,
            whiteSpace: "nowrap",
            cursor: "pointer"
          }}
        >
          {renderCell(col, row, index, { isFirstCol: i === 0 })}
        </TableCell>
      ))}
    </TableRow>
  );

  const renderGroup = (group, index) => (
    <React.Fragment key={`group-${index}`}>
      <TableRow>
        <TableCell
          colSpan={columns.length}
          sx={{
            background: "#fbfcff",
            fontWeight: 700,
            fontSize: "16px"
          }}
        >
          {group.subTitle}
        </TableCell>
      </TableRow>

      {group.items?.map((item, i) => (

        <TableRow
          key={`item-${index}-${i}`}
          onClick={() => onClick?.(item)}
          sx={{
            cursor: onClick ? "pointer" : "default",
            backgroundColor: item.isCalculateId && item.supplierId === item.isCalculateId ? "#BCCDDE" : i % 2 ? "#f9fafb" : "#fff",
            // "&:hover": {
            //   backgroundColor: `${item.supplierId === item.isCalculateId ? "#BCCDDE" : "#f1f5f9" } !important`,
            // },
          }}
        >
          {columns.map((col, cIndex) => {
            if (col.rowSpan && i !== 0) return null;
            return (
              <TableCell key={cIndex} rowSpan={col.rowSpan ? group.items.length : 1}
                sx={{
                  fontSize: Labels.fontSize.xs, py: 1.8,
                  verticalAlign: "middle", borderLeft: col.rowSpan ? "1px solid #e5e7eb" : "",
                  backgroundColor: col.rowSpan ? "#fff" : "",
                }}
              >
                {renderCell(col, item, item.rowId, { isFirstCol: cIndex === 0 })}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </React.Fragment>
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ mt: 3, borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
      <TableContainer>
        <Table>
          {/* HEADER */}
          {showHeader && (
            <TableHead>
              <TableRow sx={{ background: "#f8fafc" }}>
                {columns.map((col, i) => (
                  <TableCell key={i} sx={{ fontWeight: 500, fontSize: Labels.fontSize.xs, color: CommonColors.pTable.violet, py: 2, textWrap: Labels.rap.nowrap }}>
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          {/* BODY */}
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" align="center" sx={{ py: 3, fontSize: Labels.fontSize.xxs, color: CommonColors.pTable.darkGrey }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, i) => row.isSubTitle ? renderGroup(row, i) : renderRow(row, i))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {showPagination && (
        <Box sx={{ borderTop: "1px solid #e2e8f0" }}>
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              ".MuiTablePagination-toolbar": {
                px: 2,
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: "48px",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontSize: "13px",
                color: "#64748b",
                mb: 0,
                mt: 0,
              },
              ".MuiTablePagination-select": {
                paddingTop: "0px",
                paddingBottom: "0px",
              },
              ".MuiTablePagination-actions": {
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default PTable;