
import { Box, Checkbox } from "@mui/material";
import PTypography from "../../component/PTypography/PTypography";
import PGrid from "../../component/PGrid/PGrid";
import PDropdown from "../../component/PDropdown/PDropdown";
import { Labels } from "../../utils/constants/labels";
import React, { useState, useEffect } from "react";
import { FontWeight } from "../../utils/constants/fonts";
import PCard from "../../component/PCard/PCard";
import { CommonColors } from "../../utils/constants/colors";
import PButton from "../../component/PButton/PButton";
import PStepper from "../../component/PStepper/PStepper";
import { getEnquirySteps, getOptionLabel, isSuccess, toast } from "../../utils/commonFunction/common";
import { useLanguage } from "../../utils/constants/language";
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SendIcon from "@mui/icons-material/Send";
import BusinessIcon from "@mui/icons-material/Business";
import SaveIcon from "@mui/icons-material/Save";
import { Dashboard_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { getClientInfo, getEnquiryDetails, getLineneItems } from "../../utils/constants/summary";
import { labelRoutes } from "../../navigations/labelRoutes";
import UpdateLineItems from "./updateLineItems";
import { PDraftDialog } from "../../component/PDialog/PDraftDialog";
import { useSelector } from "react-redux";

const Review = () => {
    const { getLabel } = useLanguage();
    const enquirySteps = getEnquirySteps(getLabel);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [allowRedirect, setAllowRedirect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(0); // first item open by default
    const [openDraft, setOpenDraft] = useState();
    const { userID } = useSelector((state) => state.userDetails.user);

    const [formDataList, setFormDataList] = useState({
        clientInfo: [],
        enquiryDetails: [],
        lineItems: [],
        suppliers: [],
    });

    const [openUpdateLineItems, setOpenUpdateLineItems] = useState(false);
    const [formData, setFormData] = useState({});

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
            const supplierColor = ["success", "info", "primary", "warning"];
            const suppliers = response.supplierinfo.map((item, index) => ({
                name: item.suppliername,
                color: supplierColor[index % supplierColor.length]
            }));

            setFormDataList(prev => ({
                ...prev,
                suppliers: suppliers,
                lineItems: response.enqlineItems,
                clientInfo: response.enqClientinfo,
                enquiryDetails: response.enqProjectinfo
            }));
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    const clientInfo = getClientInfo({}, {}, {}, getLabel, getOptionLabel, formDataList.clientInfo);
    const enquiryDetails = getEnquiryDetails({}, {}, {}, getLabel, getOptionLabel, formDataList.enquiryDetails);
    const lineItems = getLineneItems({}, {}, getLabel, getOptionLabel, formDataList.lineItems);

    const handleOpen = (data = {}) => {
        setFormData(data);
        setOpenUpdateLineItems(true);
    };
    const handleEdit = (step, enquiryId = null) => {
        const data = formDataList.lineItems.find(item => item.enqdetailsId === enquiryId);
        if (step === 3 && data) {
            handleOpen(data);
            return;
        }
        const routeMap = {
            1: labelRoutes.clientInfo,
            2: labelRoutes.enquiryDetails,
            3: labelRoutes.lineItems,
            4: labelRoutes.suppliers
        };
        const route = routeMap[step] || labelRoutes.home;
        navigate(route, {
            state: { id: state.id }
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await PostApi(`${Dashboard_API.EnqReview}?enqId=${id}&createdBy=${userID}`);
            if (isSuccess(response)) {
                navigate(labelRoutes.enquirySuceess, {
                    state: { id: state.id }
                });
            }
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }

    }
    const handleExitDraft = () => {
        setOpenDraft(true);
    };
    return (
        <>
            <Box sx={{ px: 3, py: 3 }}>
                <PGrid container className={Labels.margin.mb3} >
                    <PStepper steps={enquirySteps} activeStep={4} allowRedirect={allowRedirect}></PStepper>
                </PGrid>
                <PGrid container className={Labels.margin.mb4} >
                    <PGrid item xs={12} sm={12} md={12}>

                        {/*Client Info*/}
                        <PGrid item xs={12} sm={12} md={12} className={Labels.margin.mb4}>
                            <PCard
                                title={`Step 1: ${getLabel("lbl25")}`}
                                icon={<PersonIcon />}
                                color={CommonColors.blue.dark}
                                rightAction={<PButton label="Edit" variant="outlined" size="small" startIcon={<EditIcon />}
                                    onClick={(e) => handleEdit(1)}
                                    sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.1)" } }}
                                />
                                }>
                                <PGrid container className="g-4">

                                    {clientInfo.map((item, i) => (

                                        <PGrid item xs={12} md={6} xl={3} key={i}>
                                            <PGrid className={`border-start border-${item.color} ps-2 mt-2`}>
                                                <PTypography
                                                    labelText={item.label}
                                                    weight={FontWeight.bold}
                                                />
                                                <PTypography
                                                    labelText={item.value}
                                                    color={CommonColors.grey.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                        </PGrid>
                                    ))}

                                </PGrid>
                            </PCard>
                        </PGrid>

                        {/*Enquiry Details*/}
                        <PGrid item xs={12} sm={12} md={12} className={Labels.margin.mb4}>
                            <PCard
                                title={`Step 2: ${getLabel("lbl21")}`}
                                icon={<AssignmentIcon />}
                                color={CommonColors.blue.main}
                                rightAction={<PButton label="Edit" variant="outlined" size="small" startIcon={<EditIcon />}
                                    onClick={(e) => handleEdit(2)}
                                    sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.1)" } }}
                                />
                                }>
                                <PGrid container className="g-4">
                                    {enquiryDetails.map((item, i) => (
                                        <PGrid item xs={12} md={6} xl={3} key={i}>
                                            <PGrid className={`bg-light p-3 rounded border-start border-${item.color}`} style={{ borderLeftWidth: "6px" }}>
                                                <PTypography
                                                    labelText={item.label}
                                                    weight={FontWeight.bold}
                                                />
                                                <PTypography
                                                    labelText={item.value}
                                                    color={CommonColors.grey.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                        </PGrid>
                                    ))}
                                </PGrid>
                            </PCard>
                        </PGrid>
                        {/*Line items*/}
                        <PGrid item xs={12} sm={12} md={12} className={Labels.margin.mb4}>
                            <PCard
                                title={`Step 3: ${getLabel("lbl22")}`}
                                icon={< ListAltIcon />}
                                color={CommonColors.green.main}
                                rightAction={<PButton label="Add" variant="outlined" size="small" startIcon={<AddIcon />}
                                    onClick={(e) => handleEdit(3)}
                                    sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.1)" } }}
                                />
                                }>
                                {lineItems.map((item, index) => (
                                    <PCard key={index} className="bg-light mt-3" title={item.itemTitle}
                                        icon={<Inventory2Icon />} color={CommonColors.yellow.main} collapsible
                                        isOpen={open === index} onToggle={() => setOpen(index)}
                                        rightAction={
                                            <PButton
                                                label="Edit"
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation(), handleEdit(3, item.enquiryId)
                                                }}
                                                sx={{
                                                    color: "#fff",
                                                    borderColor: "#fff",
                                                    "&:hover": {
                                                        borderColor: "#fff",
                                                        backgroundColor: "rgba(255,255,255,0.1)"
                                                    }
                                                }}

                                            />
                                        }
                                    >
                                        <PGrid container className="g-4">
                                            {item.items.map((field, i) => (
                                                <PGrid item xs={12} md={6} xl={3} key={i}>
                                                    <PGrid className="p-2 border rounded">
                                                        <PTypography labelText={field.label} weight={FontWeight.bold} />
                                                        <PTypography
                                                            labelText={field.value}
                                                            color={CommonColors.grey.main}
                                                            weight={FontWeight.bold}
                                                        />
                                                    </PGrid>
                                                </PGrid>
                                            ))}
                                        </PGrid>
                                    </PCard>
                                ))}
                            </PCard>
                        </PGrid>
                        {/* Suppliers */}
                        <PGrid item xs={12} sm={12} md={12} className={Labels.margin.mb4}>
                            <PCard
                                title={`Step 4: ${getLabel("lbl23")}`}
                                icon={<LocalShippingIcon />}
                                color={CommonColors.yellow.main}
                                rightAction={<PButton label="Edit" variant="outlined" size="small" startIcon={<EditIcon />}
                                    onClick={(e) => handleEdit(4)}
                                    sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.1)" } }}
                                />
                                }>
                                <PGrid container className="g-3">
                                    {formDataList.suppliers.map((item, index) => (
                                        <PGrid item xs={6} md={3} key={index}>
                                            <PGrid className={`border border-${item.color} shadow-sm text-center p-3 rounded`}>
                                                <BusinessIcon className={`text-${item.color} mb-2`} />
                                                <PTypography
                                                    labelText={item.name}
                                                    color={CommonColors.grey.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                        </PGrid>
                                    ))}
                                </PGrid>
                            </PCard>
                        </PGrid>

                        <PGrid container className="d-flex align-items-center justify-content-between">
                            <PGrid item xs={12} sm={6} md={6}>
                                <PButton
                                    label={getLabel("lbl37")}
                                    variant="outlined"
                                    onClick={(e) => handleExitDraft(e)}
                                    width={180}
                                    startIcon={<SaveIcon />}
                                />
                            </PGrid>
                            <PGrid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                className="d-flex justify-content-end gap-2"
                            >
                                <PButton
                                    label={getLabel("lbl127")}
                                    variant="contained"
                                    color={CommonColors.green.main}
                                    onClick={(e) => handleSubmit(e, true)}
                                    width={180}
                                    startIcon={<SendIcon />}
                                />
                            </PGrid>
                        </PGrid>

                    </PGrid>
                </PGrid>
            </Box >

            <UpdateLineItems
                open={openUpdateLineItems}
                onClose={() => setOpenUpdateLineItems(false)}
                data={formData}
                refreshSummary={fetchData}
            />
            <PDraftDialog
                open={openDraft}
                onClose={() => setOpenDraft(false)}
                onSave={handleSubmit}
                onDelete={handleSubmit}
            />
        </>
    );
};

export default Review;