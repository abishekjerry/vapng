import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    Grid,
    Button,
    Divider,
    Avatar
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import EventIcon from "@mui/icons-material/Event";
import PGrid from "../../component/PGrid/PGrid";
import PCard from "../../component/PCard/PCard";
import PTypography from "../../component/PTypography/PTypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import PButton from "../../component/PButton/PButton";
import { labelRoutes } from "../../navigations/labelRoutes";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../utils/constants/language";
import { Dashboard_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { toast } from "../../utils/commonFunction/common";

const EnquirySuccess = () => {
    const { state } = useLocation();
    const { getLabel } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formDataList, setFormDataList] = useState({
        clientInfo: [],
        enquiryDetails: []
    });

    const id = state?.id > 0 ? state.id : 0;
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await PostApi(Dashboard_API.GetDetails, {
                Enquiryid: id,
            });
            setFormDataList(prev => ({
                ...prev,
                clientInfo: response.enqClientinfo,
                enquiryDetails: response.enqProjectinfo
            }));
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };
    const data = [
        { label: "Enquiry Id", value: formDataList.clientInfo?.enqUId || "-", icon: <DescriptionIcon /> },
        { label: getLabel("lbl42"), value: formDataList.enquiryDetails?.projectNo || "-", icon: <FolderIcon /> },
        { label: getLabel("lbl28"), value: formDataList.clientInfo?.client || "-", icon: <PersonIcon /> },
        { label: getLabel("lbl09"), value: formDataList.clientInfo?.country || "-", icon: <PublicIcon /> },
        { label: "Estimated Delivery Date", value: formDataList.enquiryDetails?.estdate || "-", icon: <EventIcon /> }
    ];

    const handleSubmit = async (e) => {
        navigate(labelRoutes.projectEnquiry, {
            state: { id: state.id }
        });
    };
    const handleBack = async () => {
        navigate(labelRoutes.eqDashboard, {
            state: { id: 0 }
        });
    };

    return (


        <PCard>
            <PGrid container className={Labels.margin.mb3}>
                <PTypography
                    labelText={"Enquiry Created Successfully!"}
                    flag={Labels.fontFlags.subHeader}
                    color={CommonColors.blue.main}
                    weight={FontWeight.bold}
                />
                <PTypography
                    labelText={"Your enquiry has been successfully setup and your nominated suppliers have been notified."}
                    flag={Labels.fontFlags.smallText}
                    color={CommonColors.grey.main}
                    weight={FontWeight.bold}
                />
            </PGrid>


            <Divider sx={{ mb: 3 }} />

            {/* Job Summary */}
            <PGrid container className={Labels.margin.mb3}>
                <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-center">
                    <PTypography
                        labelText={"Job Summary"}
                        flag={Labels.fontFlags.header}
                        color={CommonColors.black.main}
                        weight={FontWeight.bold}
                    />
                </PGrid>
            </PGrid>
            <PGrid container className={Labels.margin.mb3}>
                <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-center">
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2, mb: 3, width: "100%", maxWidth: "500px" }} >
                        {data.map((item, index) => (
                            <React.Fragment key={index}>
                                <PGrid container className="align-items-center" sx={{ py: 1.5 }}>
                                    <PGrid item xs={12} sm={12} md={1}>
                                        {item.icon}
                                    </PGrid>
                                    <PGrid item xs={12} sm={12} md={6}>
                                        <PTypography labelText={item.label} weight={FontWeight.bold} />
                                    </PGrid>

                                    <PGrid item xs={12} sm={12} md={5}>
                                        <PTypography
                                            labelText={item.value}
                                            weight={FontWeight.bold}
                                            color={CommonColors.grey.main}
                                        />
                                    </PGrid>
                                </PGrid>
                                {index !== data.length - 1 && <Divider sx={{ mb: 1 }} />}
                            </React.Fragment>
                        ))}
                    </Card>
                </PGrid>
            </PGrid>



            {/* Info Box */}
            <Box
                sx={{
                    background: "#e6f7ed",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >
                <CheckCircleIcon sx={{ color: "#22c55e" }} />
                <PTypography
                    labelText={"We'll notify you via email once suppliers respond to your enquiry."}
                    weight={FontWeight.bold}
                    color={CommonColors.grey.main}
                />
            </Box>

            {/* Buttons */}
            <PGrid container className={Labels.margin.mb3}>
                <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-center gap-2" >
                    <PButton
                        label={"View Project Page"}
                        variant="contained"
                        color={CommonColors.blue.main}
                        onClick={(e) => handleSubmit(e)}
                        width={200}
                        startIcon={<FolderIcon></FolderIcon>}

                    />

                    <PButton
                        label={"View All Jobs"}
                        variant="outlined"
                        onClick={(e) => handleBack()}
                        width={200}
                        startIcon={<EventIcon></EventIcon>}
                    />
                </PGrid>
            </PGrid>
        </PCard>
    );
};

export default EnquirySuccess;