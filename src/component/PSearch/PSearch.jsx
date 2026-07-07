import React from "react";
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

// ✅ Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "6px 12px",
    borderRadius: "16px",
    width: "280px",
    color: "#000",
    marginTop: "7px",
    border: "1px solid #ccc",
    transition: "border-color 0.2s",
    "&:hover": {
        borderColor: "#888",
    },
    "&:focus-within": {
        borderColor: "#1976d2",
        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
    },
}));

const IconWrapper = styled(Box)({
    marginRight: "8px",
    display: "flex",
    alignItems: "center",
    color: "#555",
});

const StyledInput = styled(InputBase)(({ theme }) => ({
    color: "#000",
    fontSize: "0.9rem",
    width: "100%",
    "& input::placeholder": {
        color: "#999",
        opacity: 1,
    },
}));

const PSearch = ({ value, onChange ,width , placeholder}) => {
    return (
        <SearchContainer sx={{width:width || 250, height: 50}}>
            <IconWrapper>
                <SearchIcon />
            </IconWrapper>
            <StyledInput placeholder={placeholder || "Search…"} value={value} onChange={onChange} fullWidth />
        </SearchContainer>
    );
};

export default PSearch;
