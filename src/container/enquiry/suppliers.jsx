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
import { getEnquirySteps, getOptionLabel, isNotEmpty, isSuccess, toast } from "../../utils/commonFunction/common";
import { useLanguage } from "../../utils/constants/language";
import PSearch from "../../component/PSearch/PSearch";
import PTable from "../../component/PTable/PTable";
import { labelRoutes } from "../../navigations/labelRoutes";
import { useNavigate, useLocation } from "react-router-dom";
import { PDraftDialog } from "../../component/PDialog/PDraftDialog";
import { PostApi } from "../../utils/api/networking";
import { Dashboard_API, Suppliers_API } from "../../utils/api/apiUrl";
import { getClientInfo, getEnquiryDetails, getLineneItems, getSummarySections, getSuppliers } from "../../utils/constants/summary";
import { PSummary } from "../../component/PSumary/PSummary";
const Suppliers = () => {
    const { getLabel } = useLanguage();
    const enquirySteps = getEnquirySteps(getLabel);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [allowRedirect, setAllowRedirect] = useState(false);
    const [showSelected, setShowSelected] = useState(false);
    const [isValidation, setIsValidation] = useState(true);
    const [country, setCountry] = useState("");
    const [print, setPrint] = useState("");
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const currency = localStorage.getItem("currency");
    const countryName = localStorage.getItem("country");
    const [formDataList, setFormDataList] = useState({
        country: [],
        print: [],
        suppliers: [],
        selectedRows: [],

        //editable states
        clientInfo: [],
        enquiryDetails: [],
        lineItems: [],
        supplier: []
    });
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await PostApi(Dashboard_API.Master, {});
            const supplierResponse = await PostApi(Suppliers_API.GetEnqSupplierMaster, {
                currency: currency,
                Country: countryName
            });
            setFormDataList(prev => ({
                ...prev,
                country:  [ { label: "All", value: 0 ,  selected: true}, ...(response.country || [])],
                print: [ { label: "All", value: 0 , selected: true}, ...(response.printcapabilities || [])],
                suppliers: supplierResponse,
            }));
            if (id !== 0) {
                const data = await PostApi(Dashboard_API.GetDetails, {
                    Enquiryid: id,
                });
                setFormDataList(prev => ({
                    ...prev,
                    clientInfo: data.enqClientinfo,
                    enquiryDetails: data.enqProjectinfo,
                    lineItems: data.enqlineItems,
                    supplier: data.supplierinfo,
                }))

            }
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };
    const tableHeader = [
        { field: "suppliername", header: "Supplier's Name" },
        { field: "country", header: "Country" },
        { field: "suppliercode", header: "Supplier Code" },
    ];
    const flag = isNotEmpty(state?.id) && state?.id !== 0 ? Labels.flag.Update : Labels.flag.Insert;
    const id = state?.id > 0 ? state.id : 0;

    useEffect(() => {
        if (formDataList.supplier?.length) {
            setFormDataList(prev => ({
                ...prev,
                selectedRows: formDataList.supplier.map(item => ({
                    supplierId: item.supplierID , suppliername : item.suppliername
                }))
            }));
        }
    }, [formDataList.supplier]);

    let filteredData = formDataList.suppliers;
    // Country filter
    if (country) {
        filteredData = filteredData.filter(
            (item) => item.countryId === country
        );
    }

    // Print Capability filter
    if (print) {
        filteredData = filteredData.filter(
            (item) => item.printCapability === print
        );
    }
    // Search filter
    if (search.trim() !== "") {
        filteredData = filteredData.filter((item) =>
            item.suppliername.toLowerCase().includes(search.toLowerCase())
        );
    }
    const data = filteredData;
    const handleValidationChange = (rows) => {
        const isValid = rows.length > 0;
        setFormDataList(prev => ({
            ...prev,
            selectedRows: rows,
        }));
        setIsValidation(isValid);
    };


    const clientInfo = getClientInfo({}, {}, {}, getLabel, getOptionLabel, formDataList.clientInfo);
    const enquiryDetails = getEnquiryDetails({}, {}, {}, getLabel, getOptionLabel, formDataList.enquiryDetails);
    const rawLineItems = getLineneItems({}, {}, getLabel, getOptionLabel, formDataList.lineItems);
    const lineItems = rawLineItems.map((item, index) => ({
        subTitle: `${item.itemTitle}`,
        enquiryId: item.enquiryId,
        items: item.items
    }));
    const suppliers = getSuppliers(formDataList.suppliers, formDataList.selectedRows)
    const sections = getSummarySections({ clientInfo, enquiryDetails, lineItems, suppliers, getLabel });


    const handleSubmit = async (e, flag) => {
        const rows = formDataList.selectedRows || [];
        const isValid = rows.length > 0;
        setIsValidation(isValid);
        if (!isValid) {
            setAllowRedirect(false);
            return;
        }
        const supplierIds = rows.map(r => r.supplierId).join(",");
        try {
            setLoading(true);
            const payload = {
                EnqId: id,
                SelectedSuppliers: supplierIds,
                ModifiedBy: parseInt(localStorage.getItem("agancyUserID")),
            };
            const response = await PostApi(Suppliers_API.AddUpdateSuppliers, payload);
            if (isSuccess(response)) {
                setAllowRedirect(true);
                toast(Labels.status.success, response.data.message);
                setTimeout(() => {
                    navigate(flag ? labelRoutes.review : labelRoutes.eqDashboard, {
                        state: { id: response.data.enqId }
                    });
                }, 500);
            } else {
                toast(Labels.status.failure, response.data.message);
            }
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(labelRoutes.lineItems, {
                state: { id: id }
            });
        } else {
            navigate(labelRoutes.home); // fallback route
        }
    };
    const handleExitDraft = () => {
        setOpen(true);
    };
    return (
        <>
            <Box sx={{ px: 3, py: 3 }}>
                <PGrid container className={Labels.margin.mb3} >
                    <PStepper steps={enquirySteps} activeStep={3} allowRedirect={allowRedirect}></PStepper>
                </PGrid>
                <PGrid container className={Labels.margin.mb3} >
                    <PGrid item xs={12} sm={12} md={9}>
                        <PCard>
                            {/* Line Items */}
                            <PGrid container className={Labels.margin.mb3}>
                                <PTypography
                                    labelText={getLabel("lbl23")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={getLabel("lbl90")}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PSearch width="100%" placeholder={"Search a Suplier Name"} onChange={(e) => setSearch(e.target.value)} />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={3}>
                                    <PDropdown
                                        label={getLabel("lbl09")}
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        options={formDataList.country}
                                        width={Labels.fontSize.xxxxl}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={3}>
                                    <PDropdown
                                        label={getLabel("lbl122")}
                                        value={print}
                                        onChange={(e) => setPrint(e.target.value)}
                                        options={formDataList.print}
                                        width={Labels.fontSize.xxxxl}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid>
                            </PGrid>
                            <PGrid container>
                                <PGrid item xs={12} sm={6} md={12} className="d-flex align-items-center gap-2">
                                    <Checkbox
                                        checked={showSelected}
                                        onChange={(e) => setShowSelected(e.target.checked)}
                                        size="small"
                                        className="p-1"
                                    />

                                    <PTypography
                                        labelText={getLabel("lbl148")}
                                        flag={Labels.fontFlags.smallText}
                                        color={CommonColors.grey.main}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>
                            </PGrid>

                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={tableHeader} rows={data} showCheckbox={true} isChecked={showSelected} onValidationChange={handleValidationChange} selectedRows={formDataList.selectedRows} />
                                </PGrid>
                            </PGrid>
                            {!isValidation && (
                                <PGrid container className={Labels.margin.mb4}>
                                    <PGrid item xs={12}>
                                        <PTypography
                                            labelText={Labels.suppliers.required}
                                            flag={Labels.fontFlags.smallText}
                                            color={CommonColors.red.main}
                                            weight={FontWeight.bold}
                                        />
                                    </PGrid>
                                </PGrid>
                            )}
                            <PGrid container className="d-flex align-items-center justify-content-between">
                                <PGrid item xs={12} sm={6} md={8}>
                                    <PButton
                                        label={getLabel("lbl37")}
                                        variant="outlined"
                                        onClick={(e) => handleExitDraft(e)}
                                        width={180}
                                    />
                                </PGrid>
                                <PGrid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    className="d-flex justify-content-end gap-2"
                                >
                                    <PButton
                                        label={getLabel("lbl38")}
                                        variant="contained"
                                        color={CommonColors.grey.main}
                                        onClick={(e) => handleBack(e)}
                                        width={120}
                                    />

                                    <PButton
                                        label={getLabel("lbl39")}
                                        variant="contained"
                                        color={CommonColors.green.main}
                                        onClick={(e) => handleSubmit(e, true)}
                                        width={120}
                                    />
                                </PGrid>
                            </PGrid>
                        </PCard>
                    </PGrid>
                    <PGrid item xs={12} sm={12} md={3}>
                        <PSummary sections={sections} currentStep={4} refreshSummary={fetchData} duplicate={true} lineItems = {formDataList.lineItems}/>
                    </PGrid>
                </PGrid>
            </Box>
            <PDraftDialog
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSubmit}
                onDelete={handleSubmit}
            />
        </>
    );
};

export default Suppliers;