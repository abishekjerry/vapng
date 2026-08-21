import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { Tooltip } from "@mui/material";
import { CommonColors } from "../../utils/constants/colors";
import PButton from "../PButton/PButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { userDetails } from "../../redux/actionType/actionType";

const PDashboardCard = ({ title, value, icon, subtitle, route, onClick, menuId, showNavIcon = false,
  fileName, onFileUpload, onFileDownload, iconBoxSize = 45, iconSize = 22, titleSize = 14, valueSize = 22,
  iconBg = "linear-gradient(135deg, #7CA6F6, #A8C8FC)", iconColor = "#ffffff", bgColor = "#ffffff",
}) => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const dispatch = useDispatch();
  const handleOnClick = () => {
    if (onClick && !fileName) {
      onClick();
    }
    if (route) {
      dispatch({
        type: userDetails,
        payload: {
          menuId: menuId,
        },
      });
      navigate(route);
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
        style={{
          cursor: route ? "pointer" : "default",
          background: bgColor,
        }}
      >
        {showNavIcon && route && (
          <div className="nav-icon">
            <FaArrowRight />
          </div>
        )}

        <div className="card-top">
          {!fileName && (
            <div
              className="icon-box"
              style={{
                width: iconBoxSize,
                height: iconBoxSize,
                background: iconBg,
                color: iconColor,
              }}
            >
              {icon &&
                React.cloneElement(icon, {
                  size: 300,
                })}
            </div>
          )}

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
        {fileName && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: 95
              }}
            >
              <PButton
                label="Download"
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDownload?.(fileName);
                }}
                width={270}
                startIcon={<DownloadIcon />}
                style={{ cursor: "pointer" }}
                color={CommonColors.grey.main}
              />

              <PButton
                label="Upload"
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                width={270}
                startIcon={<CloudUploadIcon />}
                style={{ cursor: "pointer" }}
                color={CommonColors.green.main}
                disabled={uploadedFileName}
              />
            </div>
            {/* Filename at bottom */}
            {uploadedFileName && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "14px",
                  right: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#718096",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0,
                  }}
                  title={uploadedFileName}
                >
                  {uploadedFileName}
                </span>

                <Tooltip title="Cancel">
                  <CloseIcon
                    fontSize="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFileName("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      color: "#94a3b8",
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              </div >
            )}
            {/* Hidden file chooser */}
            <input ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadedFileName(file.name);
                  onFileUpload?.(file);
                }
              }}
            />
          </>
        )}
      </div >
    </>
  );
};

export default PDashboardCard;