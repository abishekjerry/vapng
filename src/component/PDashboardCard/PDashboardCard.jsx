import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const PDashboardCard = ({
  title,
  value,
  icon,
  subtitle,
  route,
  onClick, 
  showNavIcon = false,
  iconBoxSize = 45,
  iconSize = 22,
  titleSize = 14,
  valueSize = 22,
  iconBg = "linear-gradient(135deg, #7CA6F6, #A8C8FC)",
  iconColor = "#ffffff",
  bgColor = "#ffffff",
}) => {

  const navigate = useNavigate();

  const handleOnClick = () => {
  if (onClick) {
    onClick(); // 👉 filter function
  }

  if (route) {
    navigate(route); // 👉 navigation
  }
};

  return (
    <>
      <style>{`
        .dashboard-card {
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: 0.3s ease;
          position: relative;
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.08);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .icon-box {
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card-title {
          color: #a0aec0;
          margin: 0;
        }

        .card-value {
          font-weight: 700;
          color: #2d3748;
          margin: 5px 0 0 0;
        }

        .card-subtext {
          font-size: 13px;
          margin-top: 12px;
          color: #48bb78;
        }

        .nav-icon {
          position: absolute;
          right: 15px;
          top: 15px;
          color: #94a3b8;
        }
      `}</style>

      <div
        className="dashboard-card"
        onClick={handleOnClick}
        style={{ cursor: route ? "pointer" : "default", background: bgColor }}
      >
        {showNavIcon && route && (
          <div className="nav-icon">
            <FaArrowRight />
          </div>
        )}

        <div className="card-top">
          <div
            className="icon-box"
            style={{
              width: iconBoxSize,
              height: iconBoxSize,
              background: iconBg,
              color: iconColor,
              //fontSize: iconSize
            }}
          >
            {React.cloneElement(icon, { size : 300})}
          </div>

          <div>
            <p className="card-title" style={{ fontSize: titleSize }}>
              {title}
            </p>
            <h3 className="card-value" style={{ fontSize: valueSize }}>
              {value}
            </h3>
          </div>
        </div>

        {subtitle && <p className="card-subtext">{subtitle}</p>}
      </div>
    </>
  );
};

export default PDashboardCard;