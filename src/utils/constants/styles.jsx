import { FontFamily, FontSize } from "../constants/fonts";
import { CommonColors } from "../constants/colors";

export const FormControlBaseStyle = (width = "100%", mt = 0.4) => ({
  width: width ? `${width}%` : "100%",
  mt,

  "& .MuiInputLabel-root": {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.label,
    color: "#9e9e9e",

    "&.Mui-focused": {
      color: "#62BCD8",
    },

    "&.Mui-error": {
      color: "#d32f2f",
    },

    "&.Mui-disabled": {
      color: "#bdbdbd",
    },

    "& .MuiInputLabel-shrink": {
      color: "#62BCD8",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: 1.2,
      transform: "translate(14px, -6px) scale(1)",
    },

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fcfbfd",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.input,
      color: "#424242",

      minHeight: "55px",
      height: "52px",

      "& fieldset": {
        borderColor: "#ccc",
        borderWidth: "1.5px",
      },

      "&:hover fieldset": {
        borderColor: "#42A8C8",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#ccc",
        borderWidth: "1.5px",
        boxShadow: "0 0 0 3px rgba(98,188,216,0.15)",
      },

      "&.Mui-error fieldset": {
        borderColor: "#d32f2f",
      },

      "&.Mui-disabled": {
        backgroundColor: "#f9f9f9",
        "& fieldset": { borderColor: "#e0e0e0" },
      },

      "&.MuiInputBase-multiline": {
        height: "auto",
        minHeight: "120px",
        alignItems: "flex-start",
      },
    },

    "& .MuiInputBase-input": {
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
    },

    "& textarea": {
      display: "block",
      padding: "12px 14px",
      lineHeight: "1.6",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      top: 0,
    },

    "& .MuiOutlinedInput-notchedOutline legend": {
      maxWidth: "100%",
      fontSize: "12px",
      padding: "0 4px",
    },

    "& .MuiFormHelperText-root": {
      fontFamily: FontFamily.bold,
      fontSize: FontSize.textField.error,
      color: CommonColors.textError,
      marginLeft: "2px",
      marginTop: "4px",
    },

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
        "&:hover": { color: "white" },
      },
    },

    "@media (max-width: 600px)": {
      width: "100% !important",

      "& .MuiOutlinedInput-root": {
        minHeight: "46px",
        height: "46px",
      },
    },
  }
});