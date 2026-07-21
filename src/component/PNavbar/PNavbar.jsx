import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Avatar,
  Typography,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import { Language } from "@mui/icons-material";
import { Labels } from "../../utils/constants/labels";
import { useNavigate } from "react-router-dom";
import Logo from "../../utils/assets/Navbar/Logo.svg";
import { labelRoutes } from "../../navigations/labelRoutes";
import PTypography from "../PTypography/PTypography";
import { FaBars } from "react-icons/fa";
import { FontWeight } from "../../utils/constants/fonts";
import { CommonColors } from "../../utils/constants/colors";
import { useLanguage } from "../../utils/constants/language";
const PNavbar = ({
  name = "User",
  email = "",
  avatar = "",
  notificationCount = 0,
  title = "",
  toggleSidebar
}) => {

  const navigate = useNavigate();
  const { getLabel, changeLanguage, language } = useLanguage();

  const [menuState, setMenuState] = useState({
    anchorEl: null,
    type: null
  });

  const open = Boolean(menuState.anchorEl);

  const handleOpenMenu = (event, type) => {
    setMenuState({
      anchorEl: event.currentTarget,
      type
    });
  };

  const handleCloseMenu = () => {
    setMenuState({
      anchorEl: null,
      type: null
    });
  };

  const handleLogout = () => {
    handleCloseMenu();
    localStorage.clear();
    navigate(labelRoutes.home, { replace: true });
  };

  const selectedStyle = {
    "&.Mui-selected": {
      backgroundColor: "#1976d2",
      color: "#fff"
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#1565c0"
    }
  };
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "0px solid #f1f5f9",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          position: "relative",
          minHeight: 50
        }}
      >

        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={toggleSidebar}>
            <FaBars size={20} />
          </IconButton>

          {/* <Box className="mt-1">
            <img src={Logo} alt="Logo" style={{ height: 55, width: 60 }} />
          </Box> */}
        </Box>

        {/* CENTER SECTION */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            margin: "3px"
          }}
        >
          <PTypography
            labelText={
              title == ""
                ? ""
                : title !== "Dashboard"
                  ? `${title} - ${getLabel("lbl01")}`
                  : getLabel("lbl01")
            }
            flag={Labels.fontFlags.subHeader}
            color={CommonColors.red.main}
            weight={FontWeight.bold}
            style={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
          />
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* NOTIFICATION */}
          <IconButton
            sx={{
              border: "1px solid #e2e8f0",
              color: "#64748b",
              "&:hover": { bgcolor: "#f8fafc" }
            }}
          >
            <Badge
              badgeContent={notificationCount}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#e30613",
                  color: "#fff"
                }
              }}
            >
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* LANGUAGE */}
          <IconButton
            onMouseEnter={(e) => handleOpenMenu(e, "language")}
            sx={{
              border: "1px solid #e2e8f0",
              color: "#64748b",
              "&:hover": { bgcolor: "#f8fafc" }
            }}
          >
            <Language fontSize="small" />
          </IconButton>



          {/* PROFILE */}
          <Paper
            onClick={(e) => handleOpenMenu(e, "profile")}
            onMouseEnter={(e) => handleOpenMenu(e, "profile")}
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              pl: 0.5,
              pr: 2,
              py: 0.5,
              borderRadius: "50px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              "&:hover": { bgcolor: "#f8fafc" }
            }}
          >
            <Avatar
              alt={name}
              src={avatar || ""}
              sx={{ width: 40, height: 40 }}
            >
               <img src={Logo} alt="Logo" style={{ height: 55, width: 60 }} />
              {/* {!avatar && name ? name.charAt(0).toUpperCase() : ""} */}
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {name}
              </Typography>

              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                {email}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Toolbar>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={menuState.anchorEl}
        open={open && menuState.type === "profile"}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{ onMouseLeave: handleCloseMenu, sx: { mt: 1.5 } }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* LANGUAGE MENU */}
      <Menu
        anchorEl={menuState.anchorEl}
        open={open && menuState.type === "language"}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        PaperProps={{
          onMouseLeave: handleCloseMenu,
          sx: { width: 140, mt: 1.5 }
        }}
      >
        <MenuItem selected={language === Labels.language.en} sx={selectedStyle} onClick={() => { changeLanguage(Labels.language.en) }}>EN</MenuItem>
        <MenuItem selected={language === Labels.language.id} sx={selectedStyle} onClick={() => { changeLanguage(Labels.language.id) }}>ID</MenuItem>
        <MenuItem selected={language === Labels.language.kr} sx={selectedStyle} onClick={() => { changeLanguage(Labels.language.kr) }}>KR</MenuItem>
        <MenuItem selected={language === Labels.language.jp} sx={selectedStyle} onClick={() => { changeLanguage(Labels.language.jp) }}>JP</MenuItem>
        <MenuItem selected={language === Labels.language.cn} sx={selectedStyle} onClick={() => { changeLanguage(Labels.language.ch) }}>CH (Traditional)</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default PNavbar;