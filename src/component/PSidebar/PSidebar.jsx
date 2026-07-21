import React from "react";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import FooterLogo from "../../utils/assets/images/FooterLogo.png";
function PSidebar({
  sidebarOpen,
  menuItems,
  navigate,
  openMenu,
  setOpenMenu,
  setIsDashborad,
  Logo
}) {
  const location = useLocation();

  return (
    <div className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      {/* Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "16px 0",
        }}
      >
        <img
          src={FooterLogo}
          alt="Footer Logo"
          style={{
            width: 60,
            height: 71,
            objectFit: "contain",
          }}
        />
      </div>


      {/* Menu */}
      <nav className="sidebar-nav">
        <div className="menu-section">
          {menuItems.map((item) => (
            <div key={item.name}>

              {/* Main Menu */}
              <Tooltip
                title={!sidebarOpen ? item.name : ""}
                placement="right"
                arrow
              >
                <div
                  className={`nav-item ${location.pathname === item.route ? "active" : ""}`}
                  onClick={() => {
                    //   if (item.children) {
                    //     setOpenMenu(openMenu === item.name ? null : item.name);
                    //   } else {
                    navigate(item.route);
                    setIsDashborad(item.name === "Dashboard");
                    //}
                  }}
                >

                  {item.icon}
                  {sidebarOpen && <span>{item.name}</span>}
                </div>
              </Tooltip>


              {/* Submenu */}
              {item.children && openMenu === item.name && (
                <div className="submenu">
                  {item.children.map((sub) => (
                    <div
                      key={sub.name}
                      className="submenu-item"
                      onClick={() => navigate(sub.route)}
                    >
                      {sidebarOpen && sub.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default PSidebar;