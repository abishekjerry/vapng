import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CommonColors } from "../../utils/constants/colors";

const PScroll = () => {
        const [showUp, setShowUp] = useState(false);
        const [showDown, setShowDown] = useState(false);
        useEffect(() => {
                let container;
                let timer;

                const setupScroll = () => {
                        container = document.querySelector(".main-content");

                        if (!container) {
                                timer = setTimeout(setupScroll, 100);
                                return;
                        }

                        const handleScroll = () => {
                                setShowUp(container.scrollTop > 10);

                                setShowDown(
                                        container.scrollTop + container.clientHeight <
                                        container.scrollHeight - 10
                                );
                        };

                        handleScroll();
                        container.addEventListener("scroll", handleScroll);

                        return () => {
                                container?.removeEventListener("scroll", handleScroll);
                        };
                };

                const cleanup = setupScroll();
                return () => {
                        clearTimeout(timer);
                        if (typeof cleanup === "function") {
                                cleanup();
                        }
                };
        }, []);

        const scrollToTop = () => {
                const container = document.querySelector(".main-content");
                container?.scrollTo({ top: 0, behavior: "smooth", });
        };

        const scrollToBottom = () => {
                const container = document.querySelector(".main-content");
                container?.scrollTo({ top: container.scrollHeight, behavior: "smooth", });
        };

        return (
                <Box sx={{ position: "fixed", right: 24, bottom: 24, display: "flex", flexDirection: "column", gap: 1.2, zIndex: 99999, }}>
                        {showUp && (
                                <IconButton onClick={scrollToTop} aria-label="Scroll to top"
                                        sx={{
                                                width: 42,
                                                height: 42,
                                                backgroundColor: "#fff",
                                                color: CommonColors.grey.main,
                                                border: "1px solid #e0e0e0",
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                                transition: "all 0.25s ease",

                                                "&:hover": {
                                                        backgroundColor: "#fff",
                                                        transform: "translateY(-3px)",
                                                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.22)",
                                                },

                                                "&:active": {
                                                        transform: "scale(0.92)",
                                                },
                                        }}
                                >
                                        <KeyboardArrowUpIcon sx={{ fontSize: 26 }} />
                                </IconButton>
                        )}

                        {showDown && (
                                <IconButton onClick={scrollToBottom} aria-label="Scroll to bottom"
                                        sx={{
                                                width: 42,
                                                height: 42,
                                                backgroundColor: "#fff",
                                                color: CommonColors.grey.main,
                                                border: "1px solid #e0e0e0",
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                                transition: "all 0.25s ease",

                                                "&:hover": {
                                                        backgroundColor: "#fff",
                                                        transform: "translateY(3px)",
                                                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.22)",
                                                },

                                                "&:active": {
                                                        transform: "scale(0.92)",
                                                },
                                        }}
                                >
                                        <KeyboardArrowDownIcon sx={{ fontSize: 26, }} />
                                </IconButton>
                        )}
                </Box>
        );
};
export default PScroll;