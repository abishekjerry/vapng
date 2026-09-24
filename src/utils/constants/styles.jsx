import { FontFamily, FontSize } from "./fonts";
import { CommonColors } from "./colors";

export const FormControlBaseStyle = ({ width = "100%", mt = 0.4, helperText = false, sx = {}, backgroundColor = "#fcfbfd", }) => ({
  width,
  mt,

  "& .MuiInputLabel-root": {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.input,
    color: "#9e9e9e",
    top: "0px",
    zIndex: 3,

    "&.Mui-focused": {
      color: "#62BCD8",
    },

    "&.Mui-error": {
      color: "#d32f2f",
    },

    "&.Mui-disabled": {
      color: "#bdbdbd",
    },
  },

  // Floating / top label
  "& .MuiInputLabel-shrink": {
    color: "#62BCD8",
    fontWeight: 600,
    fontSize: "12px",
    transform: "translate(12px, -8px) scale(1)",
    zIndex: 3,
    padding: "0 3px !important",
    backgroundColor: "transparent",
    boxShadow: "none !important",
  },

  "& .MuiOutlinedInput-root": {
    position: "relative",
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
    },

    "&.Mui-error fieldset": {
      borderColor: "#d32f2f",
    },

    "&.Mui-disabled": {
      backgroundColor,

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

  "& .MuiInputBase-input": {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.textField.input,
  },

  "& .MuiInputBase-inputMultiline": {
    padding: "0 !important",
  },

  "& textarea": {
    display: "block",
    padding: "0 !important",
    lineHeight: "1.6",
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

      "&:hover": {
        color: "#fff",
      },
    },
  },

  "@media (max-width: 600px)": {
    width: "100% !important",

    "& .MuiOutlinedInput-root": {
      minHeight: "46px",
      height: "46px",
    },
  },

  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
    WebkitBoxShadow: `0 0 0 1000px ${backgroundColor} inset !important`,
    WebkitTextFillColor: "#424242 !important",
    caretColor: "#424242 !important",
    transition: "background-color 5000s ease-in-out 0s !important",
  },

  ...sx,
})