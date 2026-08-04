import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./PCard.css";
import { CommonColors } from "../../utils/constants/colors";
import CircularProgress from "@mui/material/CircularProgress";
export default function PCard({
  title,
  icon,          // ✅ new (optional)
  rightAction,   // ✅ new (optional)
  onBackClick,
  children,
  className = "",
  color,
  collapsible = false,   // 👈 new
  isOpen = true,         // 👈 new
  onToggle,
  readOnly = false,
  loading = false,
}) {
  return (
    <div className={`pcard-container ${className}`}>

      {title && (
        <div
          className={`pcard-header ${icon || rightAction ? "text-white px-3 py-2 d-flex justify-content-between align-items-center" : ""}`}
          style={
            icon || rightAction
              ? { margin: "-15px -15px 10px -15px", backgroundColor: color || "#1565C0", cursor: collapsible ? "pointer" : "default" }
              : {}
          }
          onClick={collapsible ? onToggle : undefined}
        >
          <div className="d-flex align-items-center gap-2">
            {!icon && <div className="pcard-side" />}
            {icon && icon}
            <h2 className={`pcard-title ${icon || rightAction ? "text-white mb-0" : ""}`}> {title} </h2>
          </div>
          {(rightAction || onBackClick) ? (
            <div className="pcard-side pcard-back-button-wrapper">
              {rightAction ? (
                <div onClick={(e) => e.stopPropagation()}>
                  {rightAction}
                </div>
              ) : onBackClick ? (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackClick();
                  }}
                  className={icon || rightAction ? "text-white" : "pcard-back-button"}
                >
                  <ArrowBackIcon />
                </IconButton>
              ) : null}
            </div>
          ) : (
            <div className="pcard-side" />
          )}
        </div>
      )}
      <div className="pcard-content" style={{ pointerEvents: readOnly || loading ? "none" : "auto", opacity: readOnly || loading ? 0.7 : 1 }}>
        {collapsible ? isOpen && children : children}

        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255,255,255,0.5)",
              zIndex: 9999,
              borderRadius: "8px",
            }}
          >
            <CircularProgress size={35} />
          </div>
        )}
      </div>
    </div>
  );
}