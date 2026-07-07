import {
  FaHome,
  FaBuilding,FaFileInvoice 
} from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../App.css";
import Logo from '../../utils/assets/Navbar/Logo.svg'
import PTypography from "../../component/PTypography/PTypography";
import FooterLogo from "../../utils/assets/images/FooterLogo.png";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import PNavbar from "../../component/PNavbar/PNavbar";
import PSidebar from "../../component/PSidebar/PSidebar";
import { labelRoutes } from "../../navigations/labelRoutes";
import { FontWeight } from "../../utils/constants/fonts";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../utils/constants/language";
function PageLayout() {
  const navigate = useNavigate();
  const { getLabel } = useLanguage();
  const [openMenu, setOpenMenu] = useState(null);
  const [isDashborad, setIsDashborad] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      icon: <FaHome size={20} />,
      name: getLabel("lbl149"),
      route: labelRoutes.dashboard,
    },
    {
      icon: <FaBuilding size={20} />,
      name: getLabel("lbl11"),
      route: labelRoutes.eqDashboard,
    },
    {
      icon: <FaFileInvoice  size={20} />,
      name: getLabel("lbl150"),
      route: labelRoutes.report,
    }
  ];

  const location = useLocation();

  const findTitle = (items, pathname) => {
    for (let item of items) {
      if (item.route === pathname) return item.name;

      if (item.children) {
        for (let child of item.children) {
          if (child.route === pathname) return child.name;
        }
      }
    }
    return "";
  };

  const title = findTitle(menuItems, location.pathname);
  const user = {
    name: localStorage.getItem("user"),
    avatar: "",
    email: "", //localStorage.getItem("email"),
  };

  return (
    <div className="app-container">

      <PNavbar
        name={user.name}
        email={user.email}
        avatar={user.avatar}
        title={title}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="body-layout">

        <PSidebar
          sidebarOpen={sidebarOpen}
          menuItems={menuItems}
          navigate={navigate}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          setIsDashborad={setIsDashborad}
          Logo={Logo}
        />

        <div className="main-content">
          <div className="page-content">
            <Outlet />
          </div>

          <div className="footer">
            <img
              src={FooterLogo}
              alt={Labels.footerLogo}
              className="footer-logo"
            />
            <br />
            <PTypography
              labelText={`© ${new Date().getFullYear()} ${getLabel("lbl07")}`}
              flag={Labels.fontFlags.smallText}
              font={FontWeight.bold}
            />
          </div>
        </div>

      </div>

    </div>
  );
}

export default PageLayout;