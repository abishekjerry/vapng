import { FontFamily, FontSize } from "./fonts";
import { CommonColors } from "./colors";

export const FormControlBaseStyle = ({ width = "100%", mt = 0.4, helperText = false, sx = {}, backgroundColor = "#fcfbfd", }) => ({
  width: width,
  mt,

  // Label
  "& .MuiInputLabel-root": {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.label,
    color: "#9e9e9e",
    top: "0px",
    "&.Mui-focused": { color: "#62BCD8" },
    "&.Mui-error": { color: "#d32f2f" },
    "&.Mui-disabled": { color: "#bdbdbd" },
  },

  // Floating label
  "& .MuiInputLabel-shrink": {
    color: "#62BCD8",
    fontWeight: 600,
    fontSize: "12px",
    transform: "translate(14px, -4px) scale(1)",
  },

  // Input / Select / DatePicker
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.input,
    color: "#424242",
    minHeight: "52px",

    "& fieldset": {
      borderColor: helperText ? "#d32f2f" : "#ccc",
      borderWidth: "1.5px",
    },

    "&:hover fieldset": {
      borderColor: "#42A8C8",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#62BCD8",
      borderWidth: "1.5px",
      boxShadow: "0 0 0 3px rgba(98,188,216,0.15)",
    },

    "&.Mui-error fieldset": {
      borderColor: "#d32f2f",
    },

    "&.Mui-disabled": {
      backgroundColor: "#f9f9f9",

      "& fieldset": {
        borderColor: "#e0e0e0",
      },
    },

    "&.MuiInputBase-multiline": {
      height: "auto",
      minHeight: "120px",
      alignItems: "flex-start",
    },
  },

  // Input text
  "& .MuiInputBase-input": {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.input,
    padding: "0 14px",
  },

  // Textarea
  "& textarea": {
    display: "block",
    padding: "12px 14px",
    lineHeight: "1.6",
  },

  // Notched outline
  "& .MuiOutlinedInput-notchedOutline": {
    top: 0,

    "& legend": {
      maxWidth: "100%",
      fontSize: "12px",
      padding: "0 4px",
    },
  },

  // Helper text
  "& .MuiFormHelperText-root": {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.error,
    color: CommonColors.textError,
    marginLeft: "2px",
    marginTop: "4px",
  },

  // Chip
  "& .MuiChip-root": {
    height: "22px",
    fontSize: "11px",
    fontFamily: FontFamily.bold,
    backgroundColor: "#62BCD8",
    color: "#fff",
    borderRadius: "6px",

    "& .MuiChip-deleteIcon": {
      color: "rgba(255,255,255,0.7)",
      fontSize: "14px",

      "&:hover": {
        color: "#fff",
      },
    },
  },

  // Mobile
  "@media (max-width: 600px)": {
    width: "100% !important",

    "& .MuiOutlinedInput-root": {
      minHeight: "46px",
      height: "46px",
    },
  },

  // Component-specific override
  ...sx,
});