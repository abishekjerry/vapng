import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import { Labels } from "../../utils/constants/labels";
import PCard from "../PCard/PCard";
import PGrid from "../PGrid/PGrid";
import PTypography from "../PTypography/PTypography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import { useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PButton from "../PButton/PButton";
import { labelRoutes } from "../../navigations/labelRoutes";
import UpdateLineItems from "../../container/enquiry/updateLineItems";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { isSuccess, toast } from "../../utils/commonFunction/common";
import { LineItems_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { useLanguage } from "../../utils/constants/language";

export const PSummary = ({ sections = [], currentStep = 1, refreshSummary, duplicate = false, showFlag = true, lineItems = [] }) => {
    const { state } = useLocation();
    const { getLabel } = useLanguage();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(currentStep);
    const [activeItemIndex, setActiveItemIndex] = useState({ 3: 0 });
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const enquiryID = localStorage.getItem("enquiryID")
    const handleOpen = (data = {}) => {
        setFormData(data);
        setOpen(true);
    };

    const visibleSections = sections.filter(
        (section) => section.step <= currentStep
    );

    const handleEdit = (step, enquiryId = null) => {
        const data = lineItems.find(item => item.enqdetailsId === enquiryId);
        if (step === 3 && data) {
            handleOpen(data);
            return;
        }
        const routeMap = {
            1: labelRoutes.clientInfo,
            2: labelRoutes.enquiryDetails,
            4: labelRoutes.suppliers
        };
        const route = routeMap[step] || labelRoutes.home;
        navigate(route, {
            state: { id: state.id }
        });
    };
    const SummaryItem = ({ label, value }) => (
        <PGrid container className={Labels.margin.mb3}>
            {label === "" ? (
                <PGrid item xs={12} sm={12} md={12}>
                    <PTypography
                        labelText={value || "-"}
                        weight={FontWeight.bold}
                        color={CommonColors.grey.main}
                    />
                </PGrid>
            ) : (
                <>
                    <PGrid item xs={12} sm={12} md={6}>
                        <PTypography labelText={label} weight={FontWeight.bold} />
                    </PGrid>

                    <PGrid item xs={12} sm={12} md={6}>
                        <PTypography
                            labelText={value || "-"}
                            weight={FontWeight.bold}
                            color={CommonColors.grey.main}
                        />
                    </PGrid>
                </>
            )}
        </PGrid>
    );

    const handleDuplicate = async (step, data) => {
        try {
            const payload = {
                EnqdetailsId: data.enquiryId,
                EnqId: state.id,
                modifiedBy: parseInt(localStorage.getItem("agancyUserID")),
            };
            const response = await PostApi(LineItems_API.GetEnqDuplicate, payload);
            if (isSuccess(response)) {
                toast(Labels.status.success, response.data);
                await refreshSummary();
            } else {
                setErrors((prev) => ({
                    ...prev,
                    name: ""
                }));
                toast(Labels.status.failure, response.data.message);
            }

        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        }
    };
    return (
        <>
            <PCard>
                {showFlag && (
                    <>
                        <PGrid container className="justify-content-center">
                            <PTypography
                                labelText={`${Labels.clientInfo.summary}${enquiryID && currentStep != 1 ? ` (${enquiryID})` : ""}`}
                                flag={Labels.fontFlags.subHeader}
                                weight={FontWeight.bold}
                                color={CommonColors.blue.main}
                            />
                        </PGrid>
                        <hr className="my-2" />
                    </>
                )}

                {visibleSections.map((section) => {
                    const isOpen = activeStep === section.step;
                    return (
                        <Fragment key={section.step}>
                            <PGrid container className="d-flex align-items-center justify-content-between"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    const newStep = isOpen ? null : section.step;
                                    setActiveStep(newStep);
                                    if (newStep === 3) {
                                        setActiveItemIndex({ 3: 0 });
                                    } else {
                                        setActiveItemIndex({});
                                    }
                                }}
                            >
                                <PGrid item xs={12} sm={6} md={8}>
                                    <PTypography
                                        labelText={`${showFlag ? `${section.step}. ` : ""} ${section.title}${[3, 4].includes(section.step) ? `(${section.items?.length || 0})` : ""}`}
                                        flag={Labels.fontFlags.errorLbl}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>

                                <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end align-items-center">
                                    {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </PGrid>
                            </PGrid>

                            {/* CONTENT */}
                            {isOpen && (
                                <PGrid container className={Labels.margin.mt1}>
                                    {section.step === 3 ? (
                                        section.items?.map((item, i) => {
                                            const isItemOpen = activeItemIndex[3] === i;
                                            return (
                                                <Fragment key={i}>
                                                    <hr className="my-3" />
                                                    <PGrid container className="d-flex align-items-center justify-content-between"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setActiveItemIndex((prev) => ({ ...prev, 3: prev[3] === i ? null : i }))}
                                                    >
                                                        <PGrid item xs={12} sm={6} md={8}>
                                                            <PTypography
                                                                labelText={item.subTitle}
                                                                weight={FontWeight.bold}
                                                                flag={Labels.fontFlags.subHeader}
                                                            />
                                                        </PGrid>

                                                        <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end align-items-center">
                                                            {isItemOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </PGrid>
                                                    </PGrid>

                                                    {isItemOpen && (
                                                        <>
                                                            <PGrid container className="mt-2">
                                                                {(item.items || []).map((subItem, j) => (
                                                                    <SummaryItem
                                                                        key={j}
                                                                        label={subItem.label}
                                                                        value={subItem.value}
                                                                    />
                                                                ))}
                                                            </PGrid>

                                                            {section.step != 3 && (
                                                                <PGrid container>
                                                                    <PGrid item xs={12} className="d-flex justify-content-end gap-2">
                                                                        <PButton
                                                                            label={getLabel("lbl160")}
                                                                            variant="contained"
                                                                            color={CommonColors.grey.main}
                                                                            startIcon={<EditIcon />}
                                                                            width={90}
                                                                            onClick={() => handleEdit(section.step, item.enquiryId)}
                                                                        />
                                                                        {duplicate &&
                                                                            <PButton
                                                                                label={getLabel("lbl186")}
                                                                                variant="contained"
                                                                                color={CommonColors.green.main}
                                                                                startIcon={<ContentCopyIcon />}
                                                                                width={120}
                                                                                onClick={() => handleDuplicate(section.step, item)}
                                                                            />
                                                                        }

                                                                    </PGrid>
                                                                </PGrid>
                                                            )}
                                                        </>
                                                    )}
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <>
                                            {(section.items || []).map((item, i) => (
                                                <SummaryItem
                                                    key={i}
                                                    label={item.label}
                                                    value={item.value}
                                                />
                                            ))}

                                            {section.step < currentStep && (
                                                <PGrid container>
                                                    <PGrid item xs={12} className="d-flex justify-content-end">
                                                        <PButton
                                                            label={getLabel("lbl160")}
                                                            variant="contained"
                                                            color={CommonColors.grey.main}
                                                            startIcon={<EditIcon />}
                                                            width={80}
                                                            onClick={() => handleEdit(section.step)}
                                                        />
                                                    </PGrid>
                                                </PGrid>
                                            )}
                                        </>
                                    )}

                                </PGrid>
                            )}
                        </Fragment>
                    );
                })}
            </PCard>

            <UpdateLineItems
                open={open}
                onClose={() => setOpen(false)}
                data={formData}
                step={currentStep}
                refreshSummary={refreshSummary}
            />
        </>
    );
};