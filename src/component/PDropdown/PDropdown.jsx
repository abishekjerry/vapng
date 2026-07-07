import React, { useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField
} from "@mui/material";

import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";

const PDropdown = ({
  name = "",
  label,
  value,
  onChange,
  options = [],
  required = false,
  error = false,
  helperText = "",
  width = "",
  mt = 0.4,
  multiple = false,
  flag = "",
  disabled = false,
  readOnly = false
}) => {

  const internalValue = useMemo(() => {
    if (value !== undefined && value !== null && value !== "") return value;
    const selectedOption = options.find(opt => opt.selected);
    return selectedOption ? selectedOption.value : "";
  }, [options, value]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === internalValue) || null,
    [options, internalValue]
  );
  // const selectedOption = useMemo(
  //   () => options.find((o) => o.value === value) || null,
  //   [options, value]
  // );

  const baseSx = {
    width: width ? `${width}%` : Labels.fontSize.xxxxl,
    mt,

    "& .MuiInputLabel-root": {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.label,
      color: "#9e9e9e",
      top: "0px",
      "&.Mui-focused": { color: "#62BCD8" },
      "&.Mui-error": { color: "#d32f2f" },
      "&.Mui-disabled": { color: "#bdbdbd" },
    },

    "& .MuiInputLabel-shrink": {
      color: "#62BCD8",
      fontWeight: 600,
      fontSize: "12px",
      transform: "translate(14px, -6px) scale(1)"
    },

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fcfbfd",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.input,
      color: "#424242",
      minHeight: "52px",

      "& fieldset": {
        borderColor: helperText ? "#d32f2f" : "#ccc",
        borderWidth: "1.5px"
      },

      "&:hover fieldset": {
        borderColor: "#42A8C8"
      },

      "&.Mui-focused fieldset": {
        borderColor: "#ccc",
        borderWidth: "1.5px",
        boxShadow: "0 0 0 3px rgba(98,188,216,0.15)"
      },
    },

    "& .MuiFormHelperText-root": {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.error,
      color: CommonColors.textError,
      marginLeft: "2px",
      marginTop: "4px"
    }
  };

  // Shared TextField renderer
  const renderTextField = (params) => (
    <TextField
      {...params}
      label={label}
      required={required}
      error={!!helperText}
      helperText={helperText}
    />
  );

  if (flag === Labels.flag.auto) {
    return (
      <Autocomplete
        options={options}
        value={selectedOption}
        disableClearable
        disabled={readOnly}
        //disableClearable={!selectedOption}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        onChange={(e, newValue) =>
          onChange({
            target: {
              name,
              value: newValue?.value,
              label: newValue?.label
            }
          })
        }
        sx={baseSx}
        renderInput={renderTextField}
      />
    );
  }

  // Normal Select Mode (No clear icon)
  return (
    <FormControl
      fullWidth
      size="small"
      required={required}
      error={!!helperText}
      sx={baseSx}
      disabled={readOnly}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        value={internalValue}
        label={label}
        name={name}
        onChange={(e) => {
          const selected = options.find(
            (opt) => opt.value === e.target.value
          );
          onChange({
            target: {
              name: name,
              value: e.target.value,
              label: selected?.label || ""
            }
          });
        }}
      >
        {!disabled && (
          <MenuItem value="">
            <em>-- Choose --</em>
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PDropdown;