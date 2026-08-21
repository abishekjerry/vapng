import { FaHome, FaBuilding, FaFileInvoice, FaGavel, FaBook } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../App.css";
import Logo from '../../utils/assets/Navbar/Logo.svg'
import { Labels } from "../../utils/constants/labels";
import PNavbar from "../../component/PNavbar/PNavbar";
import PSidebar from "../../component/PSidebar/PSidebar";
import { labelRoutes } from "../../navigations/labelRoutes";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../utils/constants/language";
import { useSelector } from "react-redux";

function PageLayout() {
  const navigate = useNavigate();
  const { getLabel } = useLanguage();
  const [openMenu, setOpenMenu] = useState(null);
  const [isDashborad, setIsDashborad] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userName, userType, menuId } = useSelector((state) => state.userDetails.user);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      icon: <FaHome size={20} />,
      name: getLabel("lbl149"),
      route: labelRoutes.dashboard,
      menuId: 0,
    },
    {
      icon: <FaBuilding size={20} />,
      name: getLabel("lbl11"),
      route: labelRoutes.eqDashboard,
      menuId: 1,
    },
    {
      icon: <FaGavel size={20} />,
      name: "E-Bidding",
      route: labelRoutes.eqDashboard,
      menuId: 2,
    },
    {
      icon: <FaBook size={20} />,
      name: "E-Catalogue",
      route: labelRoutes.eqDashboard,
      menuId: 3,
    },
    ...(userType?.toLowerCase() === Labels.userType.agency
      ? [
        {
          icon: <FaFileInvoice size={20} />,
          name: getLabel("lbl150"),
          route: labelRoutes.report,
          menuId: 4,
        },
      ]
      : []),
  ];

  const location = useLocation();

  const findTitle = (items, menuId) => {
    for (let item of items) {
      if (item.menuId === menuId) return item.name;
      if (item.children) {
        for (let child of item.children) {
          if (child.menuId === menuId) return child.name;
        }
      }
    }
    return "";
  };

  const title = findTitle(menuItems, menuId);
  const user = {
    name: userName,
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
          menuId={menuId}
        />

        <div className="main-content">
          <div className="page-content">
            <Outlet />
          </div>

          {/* <div className="footer">
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
          </div> */}
        </div>

      </div>

    </div>
  );
}

export default PageLayout;