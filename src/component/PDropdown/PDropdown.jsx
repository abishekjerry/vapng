import { useEffect, useMemo, useRef } from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Autocomplete, TextField } from "@mui/material";
import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";
import { FormControlBaseStyle } from "../../utils/constants/styles";

const PDropdown = ({ name = "", label, value = "", onChange, options = [], required = false, helperText = "",
  width = "", mt = 0.4, flag = "", disabled = false, readOnly = false, sx = {} }) => {
  const defaultValueRef = useRef("");
  // Set selected:true value into parent state dynamically
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      defaultValueRef.current = value;
      return;
    }
    const selectedOption = options.find(
      option => option.selected === true
    );
    if (!selectedOption) {
      return;
    }
    // Prevent repeated onChange calls
    if (defaultValueRef.current === selectedOption.value) {
      return;
    }
    defaultValueRef.current = selectedOption.value;
    onChange({
      target: {
        name,
        value: selectedOption.value,
        label: selectedOption.label
      }
    });
  }, [options, value, name, onChange]);

  // Use state value, otherwise selected:true value
  const internalValue = useMemo(() => {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
    const selectedOption = options.find(option => option.selected);
    return selectedOption?.value || "";
  }, [value, options]);

  const selectedOption = useMemo(() =>
    options.find(option => option.value === internalValue) || null,
    [options, internalValue]
  );

  const baseSx = FormControlBaseStyle({ width: width ? `${width}%` : "100%", mt, helperText, sx, });
  
  const renderTextField = params => (
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
        getOptionLabel={option => option?.label || ""}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name,
              value: newValue?.value,
              label: newValue?.label
            }
          });
        }}
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
      disabled={readOnly}
      sx={baseSx}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={internalValue}
        label={label}
        name={name}
        onChange={event => {
          const selected = options.find(
            option => option.value === event.target.value
          );
          onChange({
            target: {
              name: name,
              value: selected.value,
              label: selected?.label
            }
          });
        }}
      >
        {!disabled && (
          <MenuItem value=""> <em>-- Choose --</em> </MenuItem>
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