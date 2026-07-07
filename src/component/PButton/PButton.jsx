import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { FontFamily } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";
import CircularProgress from "@mui/material/CircularProgress";
export default function PButton({
  label,
  onClick,
  width,
  height,
  children,
  color = "primary",
  font = FontFamily.medium,
  size = "medium",
  variant = "contained",
  disabled = false,
  startIcon = null,
  endIcon = null,
  disableRipple = false,
  fullWidth = false,
  gradient = false,
  type = "button",
  rounded = "md",
  shadow = true,
  sx = {},
  loading = false
}) {

  const theme = useTheme();

  const gradientBackground =
    CommonColors.gradientBackgrounds?.[color] ||
    "linear-gradient(to right, #4e54c8, #8f94fb)";

  //   const solidColor =
  //     theme.palette[color]?.main || CommonColors.primary;
  const solidColor = color === "primary" ? CommonColors.primary : color;

  const radiusMap = {
    sm: "8px",
    md: "12px",
    lg: "20px",
    xl: "30px",
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disableRipple={disableRipple}
      variant={variant}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        width: width,
        height: height,
        cursor: "pointer",
        textTransform: "none",
        fontFamily: font,
        fontWeight: 600,

        fontSize:
          size === "small"
            ? "0.8rem"
            : size === "large"
              ? "1rem"
              : "0.9rem",

        borderRadius: radiusMap[rounded],

        color:
          variant === "contained" || gradient
            ? theme.palette.common.white
            : solidColor,

        background: gradient
          ? gradientBackground
          : variant === "contained"
            ? solidColor
            : "transparent",

        border: variant === "outlined" ? `1px solid ${solidColor}` : "none",

        boxShadow:
          shadow && variant === "contained"
            ? "0px 4px 12px rgba(0,0,0,0.15)"
            : "none",

        transition: "all 0.3s ease",

        "&:hover": {
          background: gradient
            ? gradientBackground
            : variant === "contained"
              ? solidColor
              : "rgba(0,0,0,0.04)",
          boxShadow:
            shadow && variant === "contained"
              ? "0px 6px 16px rgba(0,0,0,0.2)"
              : "none",
        },

        "&:disabled": {
          background: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled,
          boxShadow: "none",
          cursor: "not-allowed",
        },

        ...sx,
      }}
    >
      {loading && (
        <CircularProgress
          size={18}
          color="inherit"
          sx={{ mr: 1 }}
        />
      )}
      {label || children}
    </Button>
  );
}