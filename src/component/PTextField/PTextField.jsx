import React, { useState } from "react";
import {
    TextField,
    IconButton,
    InputAdornment
} from "@mui/material";
import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { Labels } from "../../utils/constants/labels";
import { FontFamily, FontSize } from "../../utils/constants/fonts";

export default function PTextField({
    inputRef,
    flag,
    label = "",
    value = "",
    onChange,
    onKeyPress,
    onKeyUp,
    onBlur,
    disabled = false,
    name = "",
    helperText = "",
    type = "text",
    multiline = false,
    rows = 1,
    variant = "outlined",
    inputProps = {},
    startIcon,
    width = "100%",
    min,
    max,
    sx = {},
    placeHolder = ""
}) {
    const isPassword = flag === Labels.flag.password;
    const [showPassword, setShowPassword] = useState(false);
    const handleToggleVisibility = () => {
        setShowPassword(prev => !prev);
    };
    const baseSx = {
        width,
        mt: 0.4,
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fff",

            "& fieldset": {
                borderColor: helperText ? "#d32f2f" : "#ccc",
            },

            "&:hover fieldset": {
                borderColor: "#62BCD8",
            },

            "&.Mui-focused fieldset": {
                borderColor: "#62BCD8",
            },
        },
        "& .MuiInputLabel-root": {
            fontFamily: FontFamily.bold,
            fontSize: FontSize.textField.label,
        },
        "& .MuiInputLabel-shrink": {
            color: "#62BCD8",
            fontWeight: 600,
            fontSize: "12px",
            transform: "translate(14px, -6px) scale(1)"
        },
        ...sx
    };

    return (
        <TextField
            placeholder={placeHolder}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
            type={isPassword && !showPassword ? "password" : type}
            inputRef={inputRef}
            multiline={multiline}
            rows={rows}
            disabled={disabled}
            helperText={helperText || " "}
            error={!!helperText}
            variant={variant}
            sx={baseSx}
            inputProps={{ ...inputProps, min, max }}
            InputProps={{
                startAdornment: startIcon && (
                    <InputAdornment position="start">
                        {startIcon}
                    </InputAdornment>
                ),
                endAdornment: isPassword && (
                    <InputAdornment position="end">
                        <IconButton onClick={handleToggleVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}