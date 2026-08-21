import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import FooterLogo from "../../utils/assets/images/FooterLogo.png";
import { userDetails } from "../../redux/actionType/actionType";

function PSidebar({ sidebarOpen, menuItems, navigate, openMenu, setOpenMenu, setIsDashborad, Logo, menuId }) {
  const dispatch = useDispatch();
  const handleMenuClick = (item) => {
    dispatch({
      type: userDetails,
      payload: {
        menuId: item.menuId,
      },
    });
    navigate(item.route);
    setIsDashborad(item.menuId === 0);
  };
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
            <div key={item.menuId}>
              <Tooltip title={!sidebarOpen ? item.name : ""} placement="right" arrow>
                <div className={`nav-item ${menuId === item.menuId ? "active" : ""}`} onClick={() => handleMenuClick(item)}>
                  {item.icon}
                  {sidebarOpen && <span>{item.name}</span>}
                </div>
              </Tooltip>

              {item.children && openMenu === item.name && (
                <div className="submenu">
                  {item.children.map((sub) => (
                    <div key={sub.name} className="submenu-item" onClick={() => navigate(sub.route)}>
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