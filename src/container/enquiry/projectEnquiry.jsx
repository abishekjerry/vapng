import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Divider, Tooltip, IconButton, Skeleton, Alert } from "@mui/material";
import PGrid from "../../component/PGrid/PGrid";
import PCard from "../../component/PCard/PCard";
import PTypography from "../../component/PTypography/PTypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import PButton from "../../component/PButton/PButton";
import { useLanguage } from "../../utils/constants/language";
import { useLocation, useNavigate } from "react-router-dom";
import PDropdown from "../../component/PDropdown/PDropdown";
import { getClientInfo, getEnquiryDetails, getLineneItems, getSummarySections } from "../../utils/constants/summary";
import { ClientInfo_API, Dashboard_API, EnquiryDetails_API, LineItems_API, Suppliers_API, ProjectEnquiry_API } from "../../utils/api/apiUrl";
import { formatDate, getOptionLabel, getOptionValue, isNotEmpty, isSuccess, parseDate, toast } from "../../utils/commonFunction/common";
import { PSummary } from "../../component/PSummary/PSummary";
import PTable from "../../component/PTable/PTable";
import { PostApi } from "../../utils/api/networking";
import PTextField from "../../component/PTextField/PTextField";
import PDatepicker from "../../component/PDatepicker/PDatepicker";
import PDialog from "../../component/PDialog/PDialog";
import PSearch from "../../component/PSearch/PSearch";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SavingsIcon from "@mui/icons-material/Savings";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import HistoryIcon from "@mui/icons-material/History";
import BoltIcon from "@mui/icons-material/Bolt";
import AttachmentIcon from "@mui/icons-material/Attachment";
import PFileUpload from "../../component/PFileUpload/PFileUpload";
import PSlaTemplate from "../../component/PSlaTemplate/PSlaTemplate";
import PSpotSection from "../../component/PSpotSection/PSpotSection";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PDeliveryOrder from "../../component/PDeliveryOrder/PDeliveryOrder";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useSelector } from "react-redux";
import PQuotation from "../../component/PQuotation/Pquotation";
import Logo from "../../utils/assets/images/valogo.png";

const ProjectEnquiry = () => {
    const { state } = useLocation();
    const { getLabel } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dynamicData, setDynamicData] = useState({});
    const { country, userName, userID, fkID, currency, email, userType, menuId, countryID, role } = useSelector((state) => state.userDetails.user);

    const id = state?.id > 0 ? state.id : 0;
    const actionFlag = isNotEmpty(state?.id) && state?.id !== 0 ? Labels.flag.Update : Labels.flag.Insert;
    const today = formatDate(new Date());

    //State & list states
    const [formData, setFormData] = useState({
        activeTab: "Job Summary",
        status: "",
        quote: "",
        statusId: 0,
        sla: false,
        rfq: false,
        fee: false,
        job: false,
        suppliers: false,
        calculateFlag: false,
        validateFlag: false,
        marginFlag: false,
        project: false,
        inputPS: false,
        psFlag: false,
        isCalculate: true,

        rfqFlag: true,
        files: [],

        //dialog state
        preview: false,
        email: false,
        historyTool: false,
        historySearchTool: "",
        search: "",
        statusFlag: false,

        //editable state
        clientContact: "",
        projectNo: "",
        estdeliveryDate: "",
        briefReceivedDate: "",
        projectDescription: "",
        managementFee: "",
        savingsType: "",
        savingsReason: "",
        sap: "",
        poNo: "",
        raisedDate: "",
        invoicenumber: "",
        actualDeliveryDate: ""

    });
    const [formDataList, setFormDataList] = useState({
        clientInfo: [],
        lineItems: [],
        enquiryDetails: [],
        suppliers: [],
        clientContact: [],
        savingsType: [],
        savingsReason: [],
        data: [],
        columns: [{ field: "suppliername", header: "Supplier's Name" }, { field: "country", header: "Country" }, { field: "suppliercode", header: "Supplier Code" },],
        supplierMaster: [],
        selectedRows: [],
        statusInfo: [],
        selectedSupplierRows: [],
        selectedHistroyRows: [],
        //project status
        status: [],

        //calculations
        calculateRows: [{ field: "cost", header: "Cost ($)", type: "rupee" }, { field: "sell", header: "Sell ($)", type: "rupee" }, { field: "margin", header: "Margin ($)", type: "rupee" }, { field: "markupPercent", header: "Markup (%)" }, { field: "marginPercent", header: "Margin (%)" }],
        calculationDetails: [],

        //logs
        historyLogsCloumns: [{ field: "modifiedDate", header: "Modified Date" }, { field: "userName", header: "User ID" }, { field: "field", header: "Field" }
            , { field: "oldValue", header: "Old Value" }, { field: "newValue", header: "New Value" }],
        historyLogs: [],
        lineItemLogsCloumns: [{ field: "modifiedDate", header: "Modified Date" }, { field: "userName", header: "User ID" }, { field: "field", header: "Field" }
            , { field: "oldValue", header: "Old Value" }, { field: "newValue", header: "New Value" }, { field: "itemNumber", header: "Item Number", render: (row) => Number.parseInt(row.itemNumber, 10) }],
        lineItemLogs: [],
        calculateSupplierlogsRows: [{ field: "supplierName", header: "Supplier Name" }, { field: "itemName", header: "Item Name" }, { field: "supplierType", header: "Supplier type" }, { field: "smetaAccredited", header: "SMETA accredited" }
            , { field: "gmpAccredited", header: "GMP accredited" }, { field: "natureofsupplier", header: "Nature of supplier" },
        ],
        calculationSupplierlogs: [],

        //project savings list
        projectSavings: [],
        savingsSummary: [],

        savingsSummaryColumns: [{ field: "savingDisplay", header: "Savings (Inc. Fee)" }, { field: "savingPercentDisplay", header: "Savings % (Inc. Fee)" },
        { field: "savingExclfeeDisplay", header: "Savings (Excl. Fee)" }, { field: "savingExclfeePercentDisplay", header: "Savings % (Excl. Fee)" }],
        savingsCalculation: [{ field: "label" }, { field: "value", align: "right" }],
        savingsResponseDto: { totalPreviousPrice: 0, totalSellPrice: 0, totalSaving: 0, totalSavingPercent: 0 },
        savingsReasons: [],
        yesOrNo: [{ label: "Yes", value: 1 }, { label: "No", value: 2, selected: true }],

        //History Tool
        historySearchesCloumns: [{ field: "enquriyID", header: "Action" }, { field: "qty", header: "Qty" }, { field: "country", header: "Country" }, { field: "specifications", header: "Specifications" },
        { field: "referencePrice", header: "Reference Price" }, { field: "materialUsed", header: "Material Used" }, { field: "poNumber", header: "PO Number" }, { field: "subCategory", header: "Sub Category" }, { field: "brand", header: "Brand" }],
        historySearches: [],

        //RevisedQuotes
        revisedQuotesCloumns: [{ field: "supplierName", header: "Supplier" }, { field: "supplierPrice", header: "Supplier Price ($)", type: "rupee" },
        { field: "dateOfChange", header: "Date/Time Log" }],
        revisedQuotes: [],

        //RequestQuotes
        requestQuotes: [],

        //Delivery Order
        deliveryOrder: [],

        //Perview Quotes Suppliers
        previewQuotes: [{ field: "supplierA", header: "Supplier A" }, { field: "supplierAInitAmount", header: "Supplier A Init. Amount" },
        //{ field: "supplierANegAmount", header: "Supplier A Neg. Amount" }, 
        { field: "supplierB", header: "Supplier B" },
        { field: "supplierBInitAmount", header: "Supplier B Init. Amount" }, 
        //{ field: "supplierBNegAmount", header: "Supplier B Neg. Amount" },
        { field: "supplierC", header: "Supplier C" }, { field: "supplierCInitAmount", header: "Supplier C Init. Amount" }
        //,{ field: "supplierCNegAmount", header: "Supplier C Neg. Amount" }
        ],
        previewSupplierQuotes: [],

        //Project Quotations
        projectQuotes: [{ field: "itemName", header: "Item Name" }, { field: "quantity", header: "Quantity" },
        { field: "unitPrice", header: "Unit Price($)" }, { field: "unitPrice", header: "Unit Price(₣)" },
        { field: "totalPrice", header: "Total Price($)" }, { field: "totalPrice", header: "Total Price(₣)" }],
        projectClientQuotes: [],

        clientQuote: [{ field: "label" }, { field: "value", align: "right" }],
        clientQuotes: [],

        //Supplier Quotations
        supplierQuotes: [{ field: "itemName", header: "Item Name" }, { field: "initialQuote", header: "Initial Quote($)" }, { field: "unitPrice", header: "Unit Price ($)" },],
        projectSupplierQuotes: [],

    });

    const showProjectSaving = formDataList.projectSavings?.length > 0;
    const deliveryFlag = formData.statusId >= 6;
    const createOrderFlag = formDataList.deliveryOrder?.length > 0;
    const flag = userType?.toLowerCase() === Labels.userType.agency
    const tabs = [
        { label: "Job Summary", icon: <WorkOutlineIcon /> },
        { label: "Line Items", icon: <Inventory2Icon /> },
        ...(!flag ? [{
            label: userType?.toLowerCase() === Labels.userType.supplier ? "Your Quote Submissions"
                : "Project Quotation", icon: <SavingsIcon />
        }] : []),
        ...(flag ? [{ label: "SPOT", icon: <BoltIcon /> }] : []),
        ...(deliveryFlag && flag ? [{ label: "Delivery Order", icon: <LocalShippingIcon /> }] : []),
        ...(flag ? [{ label: "RFQ", icon: <RequestQuoteIcon /> }] : []),
        ...(showProjectSaving && flag ? [{ label: "Project Savings", icon: <SavingsIcon /> }] : []),
        ...(flag ? [{ label: "SLA", icon: <HandshakeIcon /> }] : []),
        ...(flag ? [{ label: "Revised Quotes", icon: <PriceChangeIcon /> }] : []),
        ...(flag ? [{ label: "Logs", icon: <HistoryIcon /> }] : []),
        ...(flag || userType?.toLowerCase() === Labels.userType.supplier ? [{ label: "Attachment", icon: <AttachmentIcon /> }] : [])
    ]


    const iconStyle = {
        border: createOrderFlag ? "1px solid #e2e8f0" : "1px solid #f90707",
        color: "#64748b",
        "&:hover": { bgcolor: "#f8fafc" }
    };
    //Master function
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            //loader
            handleLoading("rfq", true);
            handleLoading("savingReason", true);
            handleLoading("projectSavings", true);

            const master = await PostApi(Dashboard_API.Master, {
                userCountryId: countryID,
                role: role
            });

            const response = await PostApi(Dashboard_API.GetDetails, {
                Enquiryid: id,
            });
            const enqResponse = await PostApi(LineItems_API.GetEnqLineItemsMaster, {
                TypeOfJob: response.enqlineItems[0].printornonprint,
            });
            const projectResponse = await PostApi(ProjectEnquiry_API.GetProjectDetails, {
                enquiryid: id,
                Currency: currency,
                Country: country
            });
            const supplierResponse = await PostApi(Suppliers_API.GetEnqSupplierMaster, {
                currency: currency,
                Country: country
            });


            const revisedQuotes = [...new Map(projectResponse.revisedQuotes.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.revisedQuotes.filter(y => y.itemNumber === x.itemNumber)
                }));

            const requestQuotes = [...new Map(projectResponse.requestQuotes.map(x => [x.itemNumber, x])).values()]
                .map(x => {
                    const items = projectResponse.requestQuotes.filter(y => y.itemNumber === x.itemNumber).filter(Boolean);
                    return {
                        isSubTitle: true,
                        subTitle: x.itemName,
                        supplierLink: items.length >= 2 && response.statusId >= 4,
                        items
                    };
                });

            const projectSavings = [...new Map(projectResponse.savingsResponseDto.details.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.savingsResponseDto.details.filter(y => y.itemNumber === x.itemNumber)
                }));

            const savingsSummary = [...new Map(projectResponse.savingsResponseDto.itemWiseSummary.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.savingsResponseDto.itemWiseSummary.filter(y => y.itemNumber === x.itemNumber)
                }));

            const previewQuotes = [...new Map(projectResponse.previewQuotes.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.previewQuotes.filter(y => y.itemNumber === x.itemNumber)
                }));

            setFormDataList(prev => ({
                ...prev,
                lineItems: response.enqlineItems,
                clientInfo: response.enqClientinfo,
                enquiryDetails: response.enqProjectinfo,
                suppliers: response.supplierinfo,
                supplierMaster: supplierResponse,
                savingsType: enqResponse.savingsType,
                savingsReason: master.savingsReason,
                statusInfo: [{ label: "Enquiry ID", value: response.enqClientinfo?.enqUId || "-" }, { label: "Project Number", value: response.enqProjectinfo?.projectNo || "-" }],
                savingsReasons: projectResponse.savingReasons,
                historyLogs: projectResponse.historyLogs,
                lineItemLogs: projectResponse.lineItemLogs,
                historySearches: projectResponse.historySearches,
                revisedQuotes: revisedQuotes,
                requestQuotes: requestQuotes,
                calculationDetails: projectResponse.calculationDetails,
                calculationSupplierlogs: projectResponse.calculationSupplierlogs,
                projectSavings: projectSavings,
                savingsSummary: savingsSummary,
                savingsResponseDto: projectResponse.savingsResponseDto,
                deliveryOrder: projectResponse.deliveryOrder,
                status: projectResponse.projectStatus,
                previewSupplierQuotes: previewQuotes
            }));

            setFormData(prev => ({
                ...prev,
                quote: response.enqProjectinfo?.quoteBy,
                calculateFlag: projectResponse.requestQuotes[0].initialQuote > 0,
                rfqFlag: projectResponse.calculationDetails?.length === 0,
                marginFlag: projectResponse.calculationDetails?.length > 0,
                //calculateProject: projectResponse.savingsResponseDto.details.length > 0,
                psFlag: !projectResponse.savingsResponseDto.details[0]?.previousPrice > 0,
                statusId: response.statusId,
                savingsReason: getOptionValue(master.savingsReason, response.enqClientinfo?.savingReason),
            }));

            await clientInfoMaster(response.enqClientinfo.divisionid);
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);

            //loader
            handleLoading("rfq", false);
            handleLoading("savingReason", false);
            handleLoading("projectSavings", false);
        }
    };

    //Change Function
    const handleChange = async (e) => {
        const { name, value, label } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name == Labels.lineItems.savingsReason) {
            handleSubmit(e, "project");
        }
    };

    //loader functionality
    const [tableLoading, setTableLoading] = useState({
        rfq: false,
        savingReason: false,
        projectSavings: false,
        approveQuotation: false,
        submitQuotation: false,
    });

    const handleLoading = (key, value) => {
        setTableLoading(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveReasonChange = async (e, row, field) => {
        const { name, value, label } = e.target;
        setFormDataList(prev => ({
            ...prev,
            savingsReasons: prev.savingsReasons.map(item =>
                item.id === row.id ? {
                    ...item,
                    [field]: label,
                    ...(field === Labels.lineItems.savingsType && {
                        savingsReason: "",
                        savingsReasonOptions: []
                    })
                } : item)
        }));

        if (name === Labels.lineItems.savingsType) {
            await SavingsReasonMaster(label, row.id);
        }
    };

    const SavingsReasonMaster = async (data, rowId) => {
        try {
            const response = await PostApi(LineItems_API.GetEnqLineItemsMaster, {
                TypeOfJob: formDataList.lineItems[0].printornonprint,
                Savingstype: data,
            });

            setFormDataList(prev => ({
                ...prev,
                savingsReasons: prev.savingsReasons.map(item => item.id === rowId ? {
                    ...item,
                    savingsReasonOptions: response.savingsReason
                } : item)
            }));

        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        }
        finally {
            setLoading(false);
        }
    };


    const attachments = [
        { field: "enquiryId", header: "File Name" },
        { field: "enquiryId", header: "Type" },
        { field: "enquiryId", header: "User ID" },
        { field: "enquiryId", header: "Size" },
        { field: "enquiryId", header: "Uploaded" },
        { field: "enquiryId", header: "Notes" },
        { field: "enquiryId", header: "Status" }
    ]

    const extraInfo = [{ label: getLabel("lbl164"), value: formDataList.clientInfo?.createdDate },
    { label: getLabel("lbl10"), value: formDataList.clientInfo?.userName }, { label: getLabel("lbl162"), value: formDataList.clientInfo?.enqUId },
    ...(deliveryFlag ? [{ label: "D/O No or PO No", value: formDataList.clientInfo?.poNumber }, { label: "PO Order raised Date", value: formDataList.clientInfo?.raisedDate },
    { label: "Invoice Number", value: formDataList.clientInfo?.invoiceNumber }, { label: "Actual Delivery Date", value: formDataList.clientInfo?.actualdeliverydate }] : [])]

    const clientInfo = getClientInfo({}, {}, {}, getLabel, getOptionLabel, formDataList.clientInfo, extraInfo);
    const enquiryDetails = getEnquiryDetails({}, {}, {}, getLabel, getOptionLabel, formDataList.enquiryDetails, false);
    const rawLineItems = getLineneItems({}, formDataList, getLabel, getOptionLabel, formDataList.lineItems);
    const lineItems = rawLineItems.map((item, index) => ({
        subTitle: `${item.itemTitle}`,
        enquiryId: item.enquiryId,
        items: item.items,
    }));

    const sections = getSummarySections({ menuId, lineItems, getLabel });

    //Edit & cancel section function

    const handleSlaChange = useCallback((data) => {
        setDynamicData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(data)) {
                return prev;
            }
            return data;
        });
    }, []);

    const handleEdit = (e, flag) => {
        setFormData(prev => ({
            ...prev,
            [flag]: true,
            validateFlag: flag == "rfq" ? true : false
        }));
    };

    const handleCancel = async (e, flag) => {
        setFormData(prev => ({
            ...prev,
            [flag]: false,
            actualDeliveryDate: "",
            invoicenumber: "",
            poNumber: "",
            raisedDate: "",
            status: ""
        }));
        await fetchData();
    };

    const handleCalculate = async (e, flag) => {
        if (flag == "reCalculate") {
            const response = await PostApi(ProjectEnquiry_API.UpdateJobStatus, {
                enqId: id,
                modifiedBy: fkID,
                status: 2
            });
            await fetchData();
        }
        else {
            const payload = {
                enqid: id,
                ls_getsupplierQuotes: formDataList.selectedSupplierRows.map(item => ({
                    itemnumber: item.itemNumber,
                    supplierID: item.supplierId,
                    initialPrice: item.initialQuote,
                    negotiatePrice: item.negQuote,
                    supplierQuotesId: item.supplierQuotesId
                }))
            }
            try {
                setLoading(true);
                const response = await PostApi(ProjectEnquiry_API.CalculateSavings, payload);
                if (isSuccess(response)) {
                    await fetchData();
                    setFormDataList(prev => ({
                        ...prev,
                        selectedSupplierRows: [],
                    }));
                }
            } catch (error) {
                toast(Labels.status.failure, Labels.message.somethingWentWrong);
            } finally {
                setLoading(false);
            }

        }
    };

    const clientInfoMaster = async (globalBUMapping) => {
        try {
            setLoading(true);
            const response = await PostApi(ClientInfo_API.ClientInfoMaster, {
                Divisionid: globalBUMapping
            });
            setFormDataList(prev => ({
                ...prev,
                clientContact: response.client,
            }));
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    //RFQ Section
    useEffect(() => {
        if (formDataList.suppliers?.length) {
            setFormDataList(prev => ({
                ...prev,
                selectedRows: formDataList.suppliers.map(item => ({
                    supplierId: item.supplierID
                }))
            }));
        }
    }, [formDataList.suppliers]);

    const handleValidationChange = (rows) => {
        const isValid = rows.length > 0;
        setFormDataList(prev => ({
            ...prev,
            selectedRows: rows,
        }));
    };

    const handleRFQ = (rows) => {
        const isValid = rows.length > 0;
        setFormDataList(prev => ({
            ...prev,
            selectedSupplierRows: rows,
        }));
        setFormData(prev => ({
            ...prev,
            isCalculate: isValid === true ? false : true
        }))

    };

    let filteredData = formDataList.supplierMaster;
    if (formData.search.trim() !== "") {
        filteredData = filteredData.filter((item) =>
            item.suppliername.toLowerCase().includes(formData.search.toLowerCase())
        );
    }
    const data = filteredData;

    //historyToolData Functionlity
    const search = formData.historySearchTool.trim().toLowerCase();
    const historyToolData = formDataList.historySearches.filter(item =>
        !search || [item.brand, item.subCategory, item.qty, item.poNumber, item.enquiryID]
            .some(v => v?.toString().toLowerCase().includes(search))
    );

    const handleHistory = async (rows) => {
        const isValid = rows.length > 0;
        setFormDataList(prev => ({
            ...prev,
            selectedSupplierRows: rows,
        }));
    }
    const handleSendChoose = async () => {
        const rows = formDataList.selectedRows || [];
        const supplierIds = rows.map(r => r.supplierId).join(",");
        try {
            setLoading(true);
            const payload = {
                EnqId: id,
                SelectedSuppliers: supplierIds,
                ModifiedBy: fkID,
            };
            const response = await PostApi(Suppliers_API.AddUpdateSuppliers, payload);
            if (isSuccess(response)) {
                toast(Labels.status.success, response.data.message);
                setFormData(prev => ({
                    ...prev,
                    suppliers: false,
                }));
            } else {
                toast(Labels.status.failure, response.data.message);
            }
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    //Project Saving Functionlity

    const handleProjectInputChange = (data, Id, enquiryId, field) => {
        setFormDataList(prev => ({
            ...prev,
            projectSavings: prev.projectSavings.map(group => ({
                ...group,
                items: group.items.map(item =>
                    item.id === Id
                        ? { ...item, [field]: data }
                        : item
                )
            }))
        }));
    }
    const renderProjectEditableField = (field) => ({
        render: (row) => {
            // const isCostReduction = row?.savingType === "Cost Reduction";
            // if ((field === "baselineQuantity" || field === "previousSupplier") && !isCostReduction) {
            //     return row[field];
            // }

            return (
                <PTextField
                    name={field}
                    value={row[field]}
                    onChange={(e) =>
                        handleProjectInputChange((field === "baselineQuantity" || field === "previousPrice")
                            ? e.target.value.replace(/[^0-9.]/g, "") : e.target.value,
                            row.id, row.enquiryId, field
                        )}
                    width={100}
                    sx={{
                        "& .MuiInputBase-root": {
                            height: 40,
                        }
                    }}
                />
            )
        }
    });

    const savings = formDataList.savingsResponseDto;
    const savingsCalculation = [
        {
            label: "Total Previous Price",
            value: savings.totalPreviousPrice.toFixed(2)
        },
        {
            label: "Total PMG Sell Price (inc.fee)",
            value: savings.totalNegSellPrice
        },
        {
            label: "Total PMG Sell Price (With MF & GS)",
            value: savings.totalNegSellPrice
        },
        {
            label: "Total PMG Sell Price (exc.fee)",
            value: savings.totalSellPrice.toFixed(2)
        },
        {
            label: `Key Savings ${formDataList.clientInfo?.savingReason ? ` (${formDataList.clientInfo?.savingReason})` : ""}`,
            value: `${savings.totalSavingPercent.toFixed(2)} %`
        }
    ];
    const projectSavings = [
        {
            field: "previousSupplier", header: "Previous PO Number",
            ...(formData.inputPS && renderProjectEditableField("previousSupplier"))
        },
        // {
        //     field: "reasonForSaving", header: "Savings Reason"
        // },
        // {
        //     field: "baselineQuantity", header: "Baseline Quantity",
        //     ...(formData.inputPS && renderProjectEditableField("baselineQuantity"))
        // },
        {
            field: "previousPrice", header: "Previous/Reference Price ($)", type: "rupee",
            ...(formData.inputPS && renderProjectEditableField("previousPrice"))

        },
        {
            field: "itemSellPrice", header: "Current PMG Sell Price (Excl. Fee)", type: "rupee"
        },
        // {
        //     field: "negItemSellPrice", header: "Current PMG Sell Price (Excl. Fee)"
        // },
        // {
        //     field: "itemSellPrice", header: "Current PMG Sell Price (Incl. Fee)"
        // }
    ];

    const summary = formDataList.savingsSummary || [];
    const totals = summary.flatMap(x => x.items).reduce(
        (acc, item) => {
            acc.totalSellPrice += Number(item.totalSellPrice || 0);
            acc.taxamount += Number(item.taxamount || 0);
            acc.totalsellpricewithtax += Number(item.totalsellpricewithtax || 0);
            // If tax percentage is the same for all items
            acc.taxpercentage = item.taxpercentage;
            return acc;
        },
        {
            totalSellPrice: 0,
            taxpercentage: 0,
            taxamount: 0,
            totalsellpricewithtax: 0
        }
    );
    const calculateProject = [
        {
            details: [
                {
                    label: "Total PMG Sell Price",
                    value: totals.totalSellPrice.toFixed(2)
                },
                {
                    label: "Tax (%)",
                    value: totals.taxpercentage.toFixed(2)
                },
                {
                    label: "Tax Amount",
                    value: totals.taxamount.toFixed(2)
                }
            ],
            total: {
                label: "TOTAL SELL PRICE",
                value: totals.totalsellpricewithtax.toFixed(2)
            }
        }
    ];

    const handleQuotation = async (e, flag) => {
        if (flag) {
            try {
                handleLoading([3, 4].includes(flag) ? "approveQuotation" : "submitQuotation", true);
                const response = await PostApi(ProjectEnquiry_API.UpdateJobStatus, {
                    enqId: id,
                    modifiedBy: fkID,
                    status: flag
                });
                if (isSuccess(response)) {
                    await fetchData();
                    toast(Labels.status.success, response.data);
                }
            } catch (error) {
                toast(Labels.status.failure, Labels.message.somethingWentWrong);
            } finally {
                handleLoading([3, 4].includes(flag) ? "approveQuotation" : "submitQuotation", false);
            }
        }
        else {
            handleDownloadQuotation();
        }
    };

    //RFQ functionality
    const renderEditableField = (field) => ({
        render: (row) => (
            <PTextField
                name={field}
                value={row[field] == null || row[field] === 0 ? "" : row[field]}
                onChange={(e) => handleInputChange(e.target.value.replace(/[^0-9.]/g, ""), row.supplierQuotesId, row.enquiryId, field)}
                width={90}
                sx={{
                    "& .MuiInputBase-root": {
                        height: 50,
                    }
                }}
            />
        )
    });

    const handleInputChange = (data, Id, enquiryId, field) => {
        setFormDataList(prev => ({
            ...prev,
            requestQuotes: prev.requestQuotes.map(group => ({
                ...group,
                items: group.items.map(item =>
                    item.supplierQuotesId === Id
                        ? ((field === "negQuote" && Number(data) > Number(item.initialQuote)) ||
                            (field === "negUnitPrice" && Number(data) > Number(item.iniUnitPrice))
                        )
                            ? item : { ...item, [field]: data } : item
                )
            }))
        }));

        setFormData(prev => ({
            ...prev,
            validateFlag: data === ""
        }));
    };


    const isQuote = formData.quote == 1 && formData.rfq;
    const isUnit = formData.quote == 2 && formData.rfq;

    const requestQuotes = [
        { field: "supplierName", header: "Supplier" },
        {
            field: "initialQuote",
            header: "Ini.Quote ($)",
            type: "rupee",
            ...(isQuote && renderEditableField("initialQuote")),
        },
        {
            field: "negQuote",
            header: "Neg.Quote ($)",
            type: "rupee",
            ...(isQuote && renderEditableField("negQuote")),
        },
        {
            field: "iniUnitPrice",
            header: "Ini.unit Price ($)",
            type: "rupee",
            ...(isUnit && renderEditableField("iniUnitPrice")),
        },
        {
            field: "negUnitPrice",
            header: "Neg.unit Price ($)",
            type: "rupee",
            ...(isUnit && renderEditableField("negUnitPrice")),
        },
        { field: "negUnitPriceFee", header: "Neg.unit Price with MFee + GS ($)", type: "rupee" },
        { field: "pmgSellPrice", header: "PMG Sell Price (with MF & GS) ($) ", rowSpan: true, type: "rupee", align: "center" }
    ];


    //savings reason functionality
    useEffect(() => {
        if (!formData.project) return;
        const load = async () => {
            const rows = formDataList.savingsReasons.filter(row => row.savingsType);
            for (const row of rows) {
                await SavingsReasonMaster(row.savingsType, row.id);
            }
        };
        load();
    }, [formData.project]);

    const renderSavingsType = (field) => ({
        render: (row) => {
            const value = getOptionValue(formDataList.savingsType, row[field]);
            return (
                <PDropdown
                    value={value}
                    onChange={(e) => handleSaveReasonChange(e, row, field)}
                    name={field}
                    options={formDataList.savingsType}
                    flag={Labels.flag.auto}
                />
            );
        }
    });

    const renderSavingsReason = (field) => ({
        render: (row) => {
            const value = getOptionValue(row.savingsReasonOptions, row[field]);
            return (
                <PDropdown
                    value={value}
                    onChange={(e) => handleSaveReasonChange(e, row, field)}
                    name={field}
                    options={row.savingsReasonOptions}
                    flag={Labels.flag.auto}
                />
            );
        }
    });

    const savingsReasons = [{ field: "itemName", header: "Item" },
    { field: "savingsType", header: "Savings Type", ...(formData.project ? renderSavingsType("savingsType") : {}) },
    { field: "savingsReason", header: "Savings Reason", ...(formData.project ? renderSavingsReason("savingsReason") : {}) }];

    //Action button function
    const renderActionButtons = (flag) => (
        formData[flag] ? (
            <>
                <PButton
                    label={getLabel("lbl125")}
                    variant="outlined"
                    color={CommonColors.blue.main}
                    onClick={(e) => handleCancel(e, flag)}
                    width={120}
                />

                <PButton
                    label={getLabel("lbl124")}
                    variant="contained"
                    color={CommonColors.green.main}
                    onClick={(e) => handleSubmit(e, flag)}
                    width={120}
                    disabled={formData.validateFlag}
                />
            </>

        ) : (
            <PButton
                label={flag == "inputPS" ? getLabel("lbl165") : getLabel("lbl160")}
                variant="contained"
                color={flag == "inputPS" ? CommonColors.green.main : CommonColors.grey.main}
                onClick={(e) => handleEdit(e, flag)}
                width={flag == "inputPS" ? 250 : 120}
                disabled={formData.statusId >= 6 && (flag === "inputPS" || flag === "project")}
            />
        )
    );

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ...(formDataList.clientInfo?.clientContactId && {
                clientContact: formDataList.clientInfo.clientContactId
            }),
            ...(formDataList.clientInfo?.poNumber && {
                poNo: formDataList.clientInfo.poNumber
            }),
            ...(formDataList.clientInfo?.raisedDate && {
                raisedDate: formDataList.clientInfo.raisedDate
            }),
            ...(formDataList.clientInfo?.invoiceNumber && {
                invoicenumber: formDataList.clientInfo.invoiceNumber
            }),
            ...(formDataList.clientInfo?.actualdeliverydate && {
                actualDeliveryDate: formDataList.clientInfo.actualdeliverydate
            }),
            ...(formDataList.clientInfo?.managementFee && {
                managementFee: formDataList.clientInfo.managementFee
            }),
            ...(formDataList.enquiryDetails?.projectNo && {
                projectNo: formDataList.enquiryDetails.projectNo
            }),
            ...(formDataList.enquiryDetails?.projectDesc && {
                projectDescription: formDataList.enquiryDetails.projectDesc
            }),
            ...(formDataList.enquiryDetails?.estdate && {
                estdeliveryDate: formDataList.enquiryDetails.estdate
            }),
            ...(formDataList.enquiryDetails?.briefdate && {
                briefReceivedDate: formDataList.enquiryDetails.briefdate
            }),
        }));
    }, [formDataList.clientInfo, formDataList.enquiryDetails]);

    const handleSubmit = async (e, flag) => {
        let activeTab = "";
        let response;

        //job summary
        const updateSummary = {
            enqId: id,
            modifiedBy: fkID,
            createdBy: userID,
            clientContactId: formData.clientContact,
            projectNo: formData.projectNo,
            projectDesc: formData.projectDescription,
            estdate: formatDate(parseDate(formData.estdeliveryDate)),
            briefdate: formatDate(parseDate(formData.briefReceivedDate)),
            Action: actionFlag,
            invoiceNumber: formData.invoicenumber,
            poNumber: formData.poNo,
            actualdeliverydate: formData.actualDeliveryDate === undefined ? "" : formData.actualDeliveryDate,
            raisedDate: formData.raisedDate,
            invoiceDate: "",
            statusId: flag === "order" ? 7 : formData.statusId
        }

        //management fee 
        const updateFeeSummary = {
            enqId: id,
            managementFee: formData.managementFee,
            Action: flag,
            statusId: formData.statusId
        }

        //sla 
        const enquiryDetails = {
            enqId: id,
            projectNo: formDataList.enquiryDetails.projectNo,
            projectDesc: formDataList.enquiryDetails.projectDesc,
            estdate: formDataList.enquiryDetails.estdate,
            briefdate: formDataList.enquiryDetails.briefdate,
            modifiedBy: fkID,
            quoteBy: formDataList.enquiryDetails.quoteBy,
            slaId: formDataList.enquiryDetails.slaId,
            managementfeetypeId: formDataList.enquiryDetails.managementfeetypeId,
            hybridModel: formDataList.enquiryDetails.hybridModel,
            attribute: formDataList.enquiryDetails.attribute,
            year: formDataList.enquiryDetails.year,
            ...dynamicData,
        };

        //RFQ Suppliers
        const supplierQuotes = formDataList.requestQuotes.flatMap(group =>
            group.items.map(item => ({
                enqId: item.enquiryId,
                quoteId: item.supplierQuotesId,
                supplierQuoteAmountPriceOrQuantity: formData.quote,
                itemNumber: item.enquiryDetailsId,
                qty: item.quantity,
                modifiedBy: fkID,
                intialprice: item.initialQuote?.toString(),
                negoprice: item.negQuote?.toString(),
                initialUnitprice: item.iniUnitPrice?.toString(),
                negoUnitprice: item.negUnitPrice?.toString()
            }))
        );

        //input project savings
        const projectQuotes = formDataList.projectSavings.flatMap(group =>
            group.items.map(item => ({
                Id: item.id,
                previousSupplier: item.previousSupplier,
                previousPrice: item.previousPrice,
                note: item.reasonForSaving,
                BaselineQuantity: item.baselineQuantity
            }))
        );

        // // const savingsReasons = formDataList.savingsReasons.map(item => ({
        // //     Id: item.id,
        // //     savingsReason: item.savingsReason,
        // //     savingsType: item.savingsType,
        // //     enquiryId: id,
        // // }));

        const savingsReasons = [{
            savingsReason: e.target.label,
            enquiryId: id,
        }];

        //project status
        const updateJobStatus = {
            enqId: id,
            modifiedBy: fkID,
            status: formData.status
        }

        try {
            switch (flag) {
                case "status":
                    activeTab = "Job Summary";
                    response = await PostApi(ProjectEnquiry_API.UpdateJobStatus, updateJobStatus);
                    setFormData(prev => ({
                        ...prev,
                        statusFlag: false,
                    }))
                    break;

                case "sla":
                    activeTab = "SLA";
                    response = await PostApi(EnquiryDetails_API.AddUpdateEnquiryDetails, enquiryDetails);
                    break;

                case "job":
                case "order":
                    activeTab = "Job Summary";
                    response = await PostApi(ProjectEnquiry_API.UpdateJobSummary, updateSummary);
                    break;

                case "rfq":
                    activeTab = "RFQ";
                    response = await PostApi(ProjectEnquiry_API.PostSupplierQuotes, supplierQuotes);
                    break;

                case "fee":
                    activeTab = "SPOT";
                    response = await PostApi(ProjectEnquiry_API.UpdateJobSummary, updateFeeSummary);
                    break;

                case "project":
                    activeTab = "Project Savings";
                    response = await PostApi(ProjectEnquiry_API.UpdateSavingsReasons, savingsReasons);
                    break;

                case "inputPS":
                    activeTab = "Project Savings";
                    response = await PostApi(ProjectEnquiry_API.PostRefPrice, projectQuotes);
                    break;

                default:
                    return;
            }

            if (isSuccess(response)) {
                handleCancel(e, flag);
                setFormData(prev => ({
                    ...prev,
                    activeTab,
                }))
                toast(Labels.status.success, flag == "sla" ? response?.data?.message : response.data);
            }
            else {
                setLoading(false);
                setLoader("");
                setFormData(prev => ({
                    ...prev,
                    activeTab,
                }))
                toast(Labels.status.failure, response.data);
            }
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    //Preview Quotation 
    const quotationRef = useRef(null);

    const handleDownloadQuotation = () => {
        quotationRef.current?.handleDownload();
    };

    const quotationData = (() => {
        const items = formDataList.lineItems.map((item) => ({
            id: item.itemNumber,
            description: item.itemDescription,
            unit: Number(item.quoteQtyOrSize) || 0,
            pricePerUnit: Number(item.itemSellPrice) || 0,
            amount: Number(item.quoteQtyOrSize || 0) * Number(item.itemSellPrice || 0),
            numberOfVersion: Number(item.version) || 0,
            specifications: item.specNote || "",
            notes: item.sNote || "",
        }));

        const subTotal = Number(
            items.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2)
        );
        const tax = Number((subTotal * 0.09).toFixed(2));
        const total = Number((subTotal + tax).toFixed(2));

        return {
            customer: {
                name: "Nestle Singapore (Pte) Ltd",
                attention: "John",
                addressLine1: "15A Changi Business Park Central 1",
                addressLine2: "#05-02/03, Eightrium @ Changi Business Park",
                postalCode: "486035",
                country: "Singapore",
            },

            company: {
                logo: Logo,
                name: "Nestle Singapore (Pte) Ltd",
                address: "15A Changi Business Park",
                phone: "1001-0934-2019",
                email: "nestle@gmail.com"
            },

            quotationNo: formDataList.clientInfo?.enqUId,
            quotationDate: formDataList.clientInfo?.createdDate,
            projectName: formData.projectDescription,
            projectNumber: formData.projectNo,
            paymentTerms: "90 days",

            items,

            subTotal,
            tax,
            total,

            notes: [
                "Quotation exclusive of material handling, distribution and freight charges, and will be invoiced separately according to the shipping arrangements.",
                "All prices quoted are in SGD unless otherwise stated, & are excluding of Goods and Services Tax (GST).",
                "Above quote is based on specifications provided, however if there is a need for the client to change the specifications or to work within the client’s budget, we shall revise the quote and specifications accordingly.",
                "Costs & deliverables are quoted based upon 5 working man days per week, with 8 working hrs per man day.",
                "Above quote is valid for one (1) month after the date of this quotation.",
                "Every item stated in the above quotation will allow only two (2) amendments (text and graphics only) in each of the mentioned item.",
                "Any amendments not within the specified specification of this contract will not be valid unless agreeable by both parties.",
                "All artwork and design elements will remain the property of PMG ASIA PACIFIC PTE LTD.",
                "PMG ASIA PACIFIC PTE LTD shall not be held responsible for any delays caused by the client.",
            ],

            preparedBy: userName,
            preparedEmail: email,
        };
    })();

    //Project Quotation
    const clientQuote = formDataList.clientQuotes
    const clientQuotes = [
        {
            label: "Item Subtotal",
            value: 0.00
        },
        {
            label: "Tax Amount",
            value: 0.00
        },
        {
            label: "Total",
            value: 0.00
        },
    ];

    return (
        <>
            <Box sx={{ px: 1, py: 1 }}>
                <PGrid container className={Labels.margin.mb1}>
                    <PGrid item xs={12} md={12} sm={12}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, flexWrap: "wrap", p: 2 }}>
                            {formDataList.statusInfo.map((item, i) => (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }} key={i}>
                                    <PTypography
                                        labelText={`${item.label} :`}
                                        weight={FontWeight.bold}
                                        color={CommonColors.blue.main}
                                        flag={Labels.fontFlags.header}
                                    />
                                    <PTypography
                                        labelText={`${item.value}`}
                                        weight={FontWeight.bold}
                                        color={CommonColors.black.main}
                                        flag={Labels.fontFlags.subHeader}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </PGrid>
                </PGrid>

                {flag && (
                    <PGrid container className={Labels.margin.mb3}>
                        <PGrid item xs={12} md={12} sm={12}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                                <PDropdown
                                    name={Labels.commonLabel.status}
                                    value={formData.status}
                                    label={getLabel("lbl166")}
                                    onChange={handleChange}
                                    options={formDataList.status}
                                    width={27}
                                    helperText={""}
                                    flag={Labels.flag.auto}
                                />
                                <PButton
                                    label={getLabel("lbl40")}
                                    variant="contained"
                                    color={CommonColors.green.main}
                                    onClick={() => setFormData((prev) => ({
                                        ...prev,
                                        statusFlag: true
                                    }))}
                                    width={150}
                                    height={45}
                                    disabled={!formData.status || !formData.actualDeliveryDate}
                                />
                            </Box>
                        </PGrid>
                    </PGrid>
                )}

                {[24].includes(formData.statusId) && flag && (
                    <PGrid container className={Labels.margin.mb3}>
                        <PGrid item xs={12} md={12} sm={8}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                                <PTypography
                                    labelText={<>
                                        {"Please click here to send Survey notification email to client".split("here")[0]}
                                        <span style={{ color: CommonColors.blue.main }} onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                email: true
                                            }))
                                        }}>
                                            here
                                        </span>
                                        {"Please click here to send Survey notification email to client".split("here")[1]}
                                    </>}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />
                            </Box>
                        </PGrid>
                    </PGrid>
                )}

                {[7, 8].includes(formData.statusId) && !formData.actualDeliveryDate && flag && (
                    <PGrid container className={Labels.margin.mb3}>
                        <PGrid item xs={12} md={12} sm={8}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                                <Alert severity="error">Enter the Actual Delivery Date in Job Summary to activate the 'Submit' button.</Alert>
                            </Box>
                        </PGrid>
                    </PGrid>
                )}

                {showProjectSaving && formData.psFlag && flag && (
                    <PGrid container className={Labels.margin.mb3}>
                        <PGrid item xs={12} md={12} sm={8}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                                <Alert severity="error">Please choose the savings reason and input project savings.</Alert>
                            </Box>
                        </PGrid>
                    </PGrid>
                )}

                <PGrid container className={Labels.margin.mb1}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
                            {tabs.map((tab) => (
                                <Tooltip title={tab.label} key={tab.label}>
                                    <Box key={tab.label} onClick={() => setFormData(prev => ({ ...prev, activeTab: tab.label }))}
                                        sx={{
                                            width: 50, height: 50, borderRadius: "50%", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            bgcolor: formData.activeTab === tab.label ? "#32d74b" : "#f1f5f9",
                                            color: formData.activeTab === tab.label ? "#fff" : "#64748b",
                                            boxShadow: formData.activeTab === tab.label ? "0 4px 12px rgba(50,215,75,.4)" : "none",
                                            transition: "0.3s", "&:hover": { transform: "scale(1.05)", }
                                        }}
                                    >
                                        {tab.icon}
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    </PGrid>
                </PGrid>

                {formData.activeTab === "Job Summary" && (
                    <PCard className={Labels.margin.mb3}>
                        <PGrid container className="d-flex align-items-center justify-content-between mb-3">
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={getLabel("lbl167")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                            <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                {flag && renderActionButtons("job")}
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        {loading ? (
                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                        ) : (
                            <>
                                <PGrid container className={Labels.margin.mb3}>
                                    {clientInfo.map((item, i) => {
                                        const job = item.label === "D/O No or PO No" ? (formData.job || !item.value) : formData.job;
                                        return (
                                            <PGrid item xs={12} md={6} xl={3} key={i}>
                                                {
                                                    formData.statusId < 6 && formData.job && item.label === getLabel("lbl35") ? (
                                                        <PDropdown
                                                            name={Labels.clientInfo.clientContact}
                                                            label={item.label}
                                                            value={formData.clientContact}
                                                            onChange={(e) => handleChange(e)}
                                                            options={formDataList.clientContact}
                                                            width={100}
                                                            flag={Labels.flag.auto}
                                                        />
                                                    ) : item.label === "D/O No or PO No" && job ? (
                                                        <>
                                                            <PGrid container>
                                                                <PGrid item xs={12} md={6} xl={9}>
                                                                    <PTextField
                                                                        name="poNo"
                                                                        label={`${item.label} ${Labels.symbols.required}`}
                                                                        value={formData.poNo}
                                                                        onChange={handleChange}
                                                                        disabled={!createOrderFlag}
                                                                        sx={{ mb: 3 }}
                                                                    />
                                                                </PGrid>
                                                                {[6].includes(formData.statusId) && (
                                                                    <PGrid item xs={12} md={6} xl={3} className={Labels.margin.mt2}>
                                                                        <Tooltip title={createOrderFlag ? "Create Order"
                                                                            : "Input D/O No or PO No and select Delivery Order to activate the 'Create Order' Icon."
                                                                        } arrow>
                                                                            <IconButton
                                                                                sx={iconStyle}
                                                                                onClick={(e) => createOrderFlag ? handleSubmit(e, "order")
                                                                                    : setFormData(prev => ({ ...prev, activeTab: "Delivery Order" }))
                                                                                }
                                                                                disabled={createOrderFlag && !formData.poNo}
                                                                            >
                                                                                <PostAddIcon />
                                                                            </IconButton>
                                                                        </Tooltip>

                                                                    </PGrid>
                                                                )}
                                                            </PGrid>
                                                        </>
                                                    ) : formData.statusId > 6 && formData.job && item.label === "PO Order raised Date" ? (
                                                        <PDatepicker
                                                            name={"raisedDate"}
                                                            label={item.label}
                                                            value={formData.raisedDate}
                                                            onChange={handleChange}
                                                            width={100}
                                                            allowFuture
                                                        />
                                                    ) : formData.statusId > 6 && formData.job && item.label === "Invoice Number" ? (
                                                        <PTextField
                                                            name={"invoicenumber"}
                                                            label={item.label}
                                                            value={formData.invoicenumber}
                                                            onChange={handleChange}
                                                        />
                                                    )
                                                        : formData.statusId > 6 && formData.job && item.label === "Actual Delivery Date" ? (
                                                            <PDatepicker
                                                                name={"actualDeliveryDate"}
                                                                label={`${item.label} ${Labels.symbols.required}`}
                                                                value={formData.actualDeliveryDate}
                                                                onChange={handleChange}
                                                                width={100}
                                                                allowFuture
                                                            />
                                                        )
                                                            : (
                                                                <>
                                                                    <PGrid className={`ps-2 mb-4`}>
                                                                        <PTypography
                                                                            labelText={
                                                                                <>
                                                                                    {item.label}
                                                                                    {(item.label === "D/O No or PO No" || item.label === "Actual Delivery Date") && (
                                                                                        <span style={{ color: "red" }}>{" "}{Labels.symbols.required}</span>
                                                                                    )}

                                                                                </>
                                                                            }
                                                                            //${Labels.symbols.required}`}
                                                                            weight={FontWeight.bold}
                                                                        />
                                                                        <PTypography
                                                                            labelText={item.value}
                                                                            color={CommonColors.grey.main}
                                                                            weight={FontWeight.bold}
                                                                        />
                                                                    </PGrid>

                                                                </>

                                                            )
                                                }
                                            </PGrid>
                                        );
                                    })}
                                </PGrid>


                                <PGrid container className={Labels.margin.mb3}>
                                    {enquiryDetails.map((item, i) => (

                                        <PGrid item xs={12} md={6} xl={3} key={i}>
                                            {
                                                formData.statusId < 6 && formData.job && item.label === getLabel("lbl42") ? (
                                                    <PTextField
                                                        name={Labels.enquiryDetails.projectNo}
                                                        label={item.label}
                                                        value={formData.projectNo}
                                                        onChange={(e) => handleChange(e)}
                                                    />

                                                ) : formData.job && (item.label === getLabel("lbl43") || item.label === getLabel("lbl44")) ? (
                                                    <PDatepicker
                                                        name={
                                                            getLabel("lbl43") === item.label
                                                                ? Labels.enquiryDetails.estdeliveryDate
                                                                : getLabel("lbl44") === item.label
                                                                    ? Labels.enquiryDetails.briefReceivedDate
                                                                    : ""
                                                        }
                                                        label={item.label}
                                                        value={
                                                            getLabel("lbl43") === item.label
                                                                ? formData.estdeliveryDate
                                                                : getLabel("lbl44") === item.label
                                                                    ? formData.briefReceivedDate
                                                                    : null
                                                        }
                                                        onChange={handleChange}
                                                        width={100}
                                                        allowFuture
                                                        maxDate={getLabel("lbl44") === item.label ? formData.estdeliveryDate : null}
                                                        minDate={getLabel("lbl43") === item.label ? today : null}
                                                    />
                                                ) : formData.statusId < 6 && formData.job && item.label === getLabel("lbl45") ? (
                                                    <PTextField
                                                        name={Labels.enquiryDetails.projectDescription}
                                                        label={item.label}
                                                        value={formData.projectDescription}
                                                        onChange={handleChange}
                                                        multiline={true}
                                                        rows={2.0}
                                                    />
                                                ) : (

                                                    <PGrid className={`ps-2 mt-4`}>
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
                                                )}
                                        </PGrid>
                                    ))}
                                </PGrid>
                            </>
                        )}
                    </PCard>

                )}

                {formData.activeTab === "Line Items" && (
                    <PCard >
                        <PGrid container className={Labels.margin.mb3}>
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={getLabel("lbl22")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={`${Labels.margin.mb3} ${"p-2"}`}>
                            <PGrid item xs={12} sm={12} md={12}>
                                <PSummary sections={sections} currentStep={3} refreshSummary={fetchData} showFlag={false} lineItems={formDataList.lineItems} />
                            </PGrid>
                        </PGrid>

                    </PCard>
                )}

                {formData.activeTab === "Delivery Order" && (
                    <PDeliveryOrder response={formDataList.deliveryOrder} fetchData={fetchData} setFormData={setFormData} />
                )}

                {formData.activeTab === "SPOT" && (
                    <>
                        <PSpotSection />

                        <PCard >
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTypography
                                        labelText={getLabel("lbl168")}
                                        flag={Labels.fontFlags.subHeader}
                                        color={CommonColors.blue.main}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>
                                {[1].includes(formData.statusId) && (
                                    <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                        {renderActionButtons("fee")}
                                    </PGrid>
                                )}
                            </PGrid>
                            <Divider sx={{ mb: 2 }} />
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={2} >
                                    <PGrid className={`ps-2 mb-4`}>
                                        <PTypography
                                            labelText={`${getLabel("lbl168")} ( ${(Labels.symbols.percent)} )`}
                                            weight={FontWeight.bold}
                                        />
                                        {formData.fee ? (
                                            <PTextField
                                                name="managementFee"
                                                value={formData.managementFee}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <PTypography
                                                labelText={formData.managementFee}
                                                color={CommonColors.grey.main}
                                                weight={FontWeight.bold}
                                            />
                                        )}
                                    </PGrid>
                                </PGrid>
                            </PGrid>
                        </PCard>
                    </>
                )}

                {formData.activeTab === "RFQ" && (
                    <PCard className={Labels.margin.mb3} >
                        <PGrid container className={Labels.margin.mb1}>
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={getLabel("lbl169")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                        </PGrid>
                        {/* RFQ Section */}
                        {[1, 2, 3].includes(formData.statusId) && (
                            <PGrid container className="d-flex align-items-center justify-content-between mb-3">
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTypography
                                        labelText={getLabel("lbl170")}
                                        flag={Labels.fontFlags.subHeader}
                                        color={CommonColors.black.main}
                                        weight={FontWeight.bold}
                                    />
                                    <PTypography
                                        labelText={getLabel("lbl171")}
                                        flag={Labels.fontFlags.smallText}
                                        color={CommonColors.grey.main}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                    {!formData.marginFlag && (renderActionButtons("rfq"))}
                                </PGrid>
                            </PGrid>
                        )}

                        {/* Award Jobs Section */}
                        {formData.statusId >= 4 && (
                            <PGrid container className="d-flex align-items-center justify-content-between mb-3">
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTypography
                                        labelText={"Award jobs"}
                                        flag={Labels.fontFlags.subHeader}
                                        color={CommonColors.black.main}
                                        weight={FontWeight.bold}
                                    />
                                    <PTypography
                                        labelText={"Your preferred supplier for each item."}
                                        flag={Labels.fontFlags.smallText}
                                        color={CommonColors.grey.main}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                    <PButton
                                        label={"Preview Supplier Quotes"}
                                        variant="contained"
                                        color={CommonColors.grey.main}
                                        onClick={() => setFormData((prev) => ({
                                            ...prev,
                                            preview: true,
                                        }))}
                                        width={250}
                                    />
                                </PGrid>
                            </PGrid>
                        )}

                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={requestQuotes} rows={formDataList.requestQuotes} showCheckbox={formData.rfqFlag} selectedRows={formDataList.selectedSupplierRows} onValidationChange={handleRFQ} disabled={formData.rfq} bgColor={true} showPagination={false} loading={tableLoading.rfq} />
                            </PGrid>
                        </PGrid>
                        <PGrid container className={Labels.margin.mb4}>
                            {!formData.marginFlag && (
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PButton
                                        label={getLabel("lbl172")}
                                        variant="contained"
                                        color={CommonColors.grey.main}
                                        onClick={() => setFormData((prev) => ({
                                            ...prev,
                                            suppliers: true
                                        }))}
                                        width={200}
                                    />
                                </PGrid>
                            )}

                            {formData.calculateFlag && [1, 2, 3, 4, 5].includes(formData.statusId) && (
                                <PGrid item xs={12} sm={12} md={formData.marginFlag ? 12 : 6} className="d-flex justify-content-end gap-2">
                                    <PButton
                                        label={getLabel("lbl173")}
                                        variant="contained"
                                        color={CommonColors.green.main}
                                        onClick={(e) => handleCalculate(e, "calculate")}
                                        width={250}
                                        disabled={formData.isCalculate}
                                    />
                                    <PButton
                                        label={getLabel("lbl174")}
                                        variant="contained"
                                        color={CommonColors.red.main}
                                        onClick={(e) => handleCalculate(e, "reCalculate")}
                                        width={250}
                                    />
                                </PGrid>
                            )}
                        </PGrid>

                        {formData.marginFlag && (
                            <>
                                <PGrid container className={Labels.margin.mb4}>
                                    <PGrid item xs={12} sm={6} md={12}>
                                        <PTable columns={formDataList.calculateRows} rows={formDataList.calculationDetails} showPagination={false} />
                                    </PGrid>
                                </PGrid>
                                <PGrid container className={Labels.margin.mb4}>
                                    <PGrid item xs={12} sm={6} md={12}>
                                        <PTable columns={formDataList.calculateSupplierlogsRows} rows={formDataList.calculationSupplierlogs} />
                                    </PGrid>
                                </PGrid>
                            </>
                        )}
                    </PCard>
                )}

                {formData.activeTab === "Project Savings" && (
                    <>
                        <PCard className={Labels.margin.mb3}>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTypography
                                        labelText={getLabel("lbl175")}
                                        flag={Labels.fontFlags.subHeader}
                                        color={CommonColors.blue.main}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>
                                {/* <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                    {renderActionButtons("project")}
                                </PGrid> */}
                            </PGrid>

                            <Divider sx={{ mb: 2 }} />
                            {/*<PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={savingsReasons} rows={formDataList.savingsReasons} showPagination={false} loading={tableLoading.savingReason} />
                                </PGrid>
                            </PGrid>*/}
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={12} md={3}>
                                    <PDropdown
                                        name={Labels.lineItems.savingsReason}
                                        value={formData.savingsReason}
                                        onChange={(e) => handleChange(e)}
                                        options={formDataList.savingsReason}
                                        width={100}
                                        sx={{ height: 10 }}
                                        flag={Labels.flag.auto}
                                        readOnly={formData.statusId >= 6}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={12} md={9} className="d-flex justify-content-end gap-2">
                                    {renderActionButtons("inputPS")}
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={projectSavings} rows={formDataList.projectSavings} showPagination={false} loading={tableLoading.projectSavings} />
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={formDataList.savingsSummaryColumns} rows={formDataList.savingsSummary} showPagination={false} loading={tableLoading.projectSavings} />
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={6} ></PGrid>
                                <PGrid item xs={12} sm={6} md={6} >
                                    <PTable columns={formDataList.savingsCalculation} rows={savingsCalculation} showHeader={false} showPagination={false} loading={tableLoading.projectSavings} />
                                </PGrid>
                            </PGrid>
                        </PCard>

                        {!formData.psFlag && (
                            <>
                                <PCard className={Labels.margin.mb3} loading={tableLoading.projectSavings}>
                                    <PGrid container className="d-flex align-items-center justify-content-between mb-3">
                                        <PGrid item xs={12} sm={6} md={6}>
                                            <PTypography
                                                labelText={getLabel("lbl176")}
                                                flag={Labels.fontFlags.subHeader}
                                                color={CommonColors.black.main}
                                                weight={FontWeight.bold}
                                            />
                                            <PTypography
                                                labelText={getLabel("lbl177")}
                                                flag={Labels.fontFlags.smallText}
                                                color={CommonColors.grey.main}
                                                weight={FontWeight.bold}
                                            />
                                        </PGrid>
                                    </PGrid>
                                    <Divider sx={{ mb: 2 }} />
                                    {calculateProject.map((item, i) => (
                                        <PGrid key={i} className="ps-2 mt-4">
                                            {item.details.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <PGrid container className={Labels.margin.mb3}>
                                                        <PGrid item xs={12} sm={6} md={2}>
                                                            <PTypography
                                                                labelText={item.label}
                                                                weight={FontWeight.bold}
                                                            />
                                                        </PGrid>
                                                        <PGrid item xs={12} sm={6} md={1}>
                                                            <PTypography
                                                                labelText={":"}
                                                                weight={FontWeight.bold}
                                                            />
                                                        </PGrid>
                                                        <PGrid item xs={12} sm={6} md={9}>
                                                            <PTypography
                                                                labelText={item.value}
                                                                color={CommonColors.grey.main}
                                                                weight={FontWeight.bold}
                                                            />
                                                        </PGrid>

                                                    </PGrid>
                                                </React.Fragment>
                                            ))}

                                            <Divider sx={{ my: 2 }} />
                                            <PGrid container className={Labels.margin.mb3}>
                                                <PGrid item xs={12} sm={6} md={2}>
                                                    <PTypography
                                                        labelText={item.total.label}
                                                        weight={FontWeight.bold}
                                                    />
                                                </PGrid>
                                                <PGrid item xs={12} sm={6} md={1}>
                                                    <PTypography
                                                        labelText={":"}
                                                        weight={FontWeight.bold}
                                                    />
                                                </PGrid>
                                                <PGrid item xs={12} sm={6} md={9}>
                                                    <PTypography
                                                        labelText={`$ ${item.total.value}`}
                                                        color={CommonColors.grey.main}
                                                        weight={FontWeight.bold}
                                                    />
                                                </PGrid>
                                            </PGrid>

                                        </PGrid>
                                    ))}
                                </PCard>

                                {[2, 3, 4, 5].includes(formData.statusId) && (
                                    <PCard className={Labels.margin.mb3} readOnly={formData.statusId == 3} loading={tableLoading.submitQuotation}>
                                        <PGrid container className="d-flex align-items-center justify-content-between mb-2">
                                            <PGrid item xs={12} sm={6} md={6}>
                                                <PTypography
                                                    labelText={"Step 3.Submit to client"}
                                                    flag={Labels.fontFlags.subHeader}
                                                    color={CommonColors.black.main}
                                                    weight={FontWeight.bold}
                                                />
                                                <PTypography
                                                    labelText={"Once all is in order, please preview the quotation before submitting it to your client."}
                                                    flag={Labels.fontFlags.smallText}
                                                    color={CommonColors.grey.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                        </PGrid>
                                        <PGrid container className={Labels.margin.mb3}>
                                            <PGrid item xs={12} sm={6} md={6}>
                                                <PTypography
                                                    labelText={"Please input environmental specification with comparison / no comparison"}
                                                    flag={Labels.fontFlags.smallText}
                                                    color={CommonColors.red.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                        </PGrid>

                                        <Divider sx={{ mb: 2 }} />
                                        <PGrid container className={Labels.margin.mb3}>
                                            <PGrid item xs={12} sm={6} md={2} className={Labels.margin.mt3}>
                                                <PTypography
                                                    labelText={`${"Send to SAP"} ${Labels.symbols.optional}`}
                                                    flag={Labels.fontFlags.subHeader}
                                                    color={CommonColors.black.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                            <PGrid item xs={12} sm={6} md={2}>
                                                <PDropdown
                                                    value={formData.sap}
                                                    onChange={(e) => setFormData((prev) => ({
                                                        ...prev,
                                                        sap: e.target.value
                                                    }))}
                                                    options={formDataList.yesOrNo}
                                                    width={Labels.fontSize.xxxxl}
                                                    disabled={true}
                                                />
                                            </PGrid>
                                        </PGrid>
                                        <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-end gap-2">
                                            <PButton
                                                label={"Preview quotation"}
                                                variant="contained"
                                                color={CommonColors.grey.main}
                                                onClick={(e) => handleQuotation(e, "")}
                                                width={250}
                                            />
                                            <PButton
                                                label={"Submit quotation to client"}
                                                variant="contained"
                                                color={CommonColors.green.main}
                                                onClick={(e) => handleQuotation(e, 3)}
                                                width={250}
                                            />
                                        </PGrid>
                                    </PCard>
                                )}

                                {[3, 4, 5].includes(formData.statusId) && (
                                    <PCard className={Labels.margin.mb3} loading={tableLoading.approveQuotation}>
                                        <PGrid container className="d-flex align-items-center justify-content-between mb-3">
                                            <PGrid item xs={12} sm={6} md={6}>
                                                <PTypography
                                                    labelText={"Step 4.Client/PM Approval"}
                                                    flag={Labels.fontFlags.subHeader}
                                                    color={CommonColors.black.main}
                                                    weight={FontWeight.bold}
                                                />
                                            </PGrid>
                                        </PGrid>
                                        <Divider sx={{ mb: 2 }} />
                                        <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-end gap-2">
                                            <PButton
                                                label={"Approve quotation"}
                                                variant="contained"
                                                color={CommonColors.green.main}
                                                onClick={(e) => handleQuotation(e, 6)}
                                                width={250}
                                            />
                                            <PButton
                                                label={"Request adjustment"}
                                                variant="contained"
                                                color={CommonColors.red.main}
                                                onClick={(e) => handleQuotation(e, 4)}
                                                width={250}
                                            />
                                        </PGrid>
                                    </PCard>
                                )}

                            </>
                        )}
                    </>
                )}


                {formData.activeTab === "SLA" && (
                    <PCard className={Labels.margin.mb3}>
                        <Box sx={{ px: 1, py: 1 }}>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTypography
                                        labelText={getLabel("lbl178")}
                                        flag={Labels.fontFlags.subHeader}
                                        color={CommonColors.blue.main}
                                        weight={FontWeight.bold}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                    {renderActionButtons("sla")}
                                </PGrid>
                            </PGrid>
                            <Divider sx={{ mb: 2 }} />
                            <PSlaTemplate sla={formDataList?.enquiryDetails?.slaId} enquiryId={id} getLabel={getLabel} quoteStartDate={formDataList?.enquiryDetails?.quotestartdate} disabled={!formData.sla}
                                onChange={handleSlaChange} response={formDataList?.enquiryDetails}
                            />
                        </Box>
                    </PCard>
                )}

                {formData.activeTab === "Revised Quotes" && (
                    <PCard className={Labels.margin.mb3}>
                        <PGrid container className={Labels.margin.mb4}>
                            <PTypography
                                labelText={getLabel("lbl179")}
                                flag={Labels.fontFlags.subHeader}
                                color={CommonColors.blue.main}
                                weight={FontWeight.bold}
                            />
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={formDataList.revisedQuotesCloumns} rows={formDataList.revisedQuotes} showPagination={false} />
                            </PGrid>
                        </PGrid>
                    </PCard>
                )}

                {formData.activeTab === "Logs" && (
                    <PCard className={Labels.margin.mb3}>
                        <PGrid container className={Labels.margin.mb4}>
                            <PTypography
                                labelText={getLabel("lbl180")}
                                flag={Labels.fontFlags.subHeader}
                                color={CommonColors.blue.main}
                                weight={FontWeight.bold}
                            />
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={formDataList.lineItemLogsCloumns} rows={formDataList.lineItemLogs} />
                            </PGrid>
                        </PGrid>

                        <PGrid container className={Labels.margin.mb4}>
                            <PTypography
                                labelText={getLabel("lbl181")}
                                flag={Labels.fontFlags.subHeader}
                                color={CommonColors.blue.main}
                                weight={FontWeight.bold}
                            />
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={formDataList.historyLogsCloumns} rows={formDataList.historyLogs} />
                            </PGrid>
                        </PGrid>
                    </PCard>
                )}

                {formData.activeTab === "Attachment" && (
                    <PCard className={Labels.margin.mb3}>
                        <PGrid container className={Labels.margin.mb4}>
                            <PTypography
                                labelText={getLabel("lbl182")}
                                flag={Labels.fontFlags.subHeader}
                                color={CommonColors.blue.main}
                                weight={FontWeight.bold}
                            />
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={4}>
                                <PFileUpload
                                    value={formData.files}
                                    onChange={handleChange}
                                    name={Labels.lineItems.files}
                                    placeholder={`Choose a file`}
                                />
                                <PTypography
                                    labelText={"File names should not contain special characters."}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={"Total upload size must be 100 MB or less."}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                        </PGrid>

                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={attachments} rows={formDataList.data} />
                            </PGrid>
                        </PGrid>
                    </PCard>
                )}

                {formData.activeTab === "Project Quotation" && (
                    <PCard className={Labels.margin.mb3}>
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={"Project Quotations"}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={"Below are the prices recommended by PMG"}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />

                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={formDataList.projectQuotes} rows={formDataList.projectClientQuotes} showPagination={false} />
                            </PGrid>
                        </PGrid>
                        <PGrid container className={Labels.margin.mb3}>
                            <PGrid item xs={12} sm={6} md={6} ></PGrid>
                            <PGrid item xs={12} sm={6} md={6} >
                                <PTable columns={formDataList.clientQuote} rows={clientQuotes} showHeader={false} showPagination={false} />
                            </PGrid>
                        </PGrid>
                    </PCard>
                )}

                {formData.activeTab === "Your Quote Submissions" && (
                    <PCard className={Labels.margin.mb3}>
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={"Your Quote Submissions"}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />

                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={formDataList.supplierQuotes} rows={formDataList.projectSupplierQuotes} showPagination={false} />
                            </PGrid>
                        </PGrid>
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-end gap-2">
                                <PButton
                                    label={"Calculate"}
                                    variant="contained"
                                    color={CommonColors.grey.main}
                                    onClick={(e) => handleQuotation(e, 6)}
                                    width={250}
                                />
                                <PButton
                                    label={"Submit Quote"}
                                    variant="contained"
                                    color={CommonColors.green.main}
                                    onClick={(e) => handleQuotation(e, 4)}
                                    width={250}
                                />
                            </PGrid>
                        </PGrid>
                    </PCard>
                )}
            </Box >

            {/* Preview Quotation */}
            <PGrid className="d-none d-print-block">
                <PQuotation data={quotationData} ref={quotationRef} />
            </PGrid>

            {/* Status dialog */}
            <PDialog
                open={formData.statusFlag}
                onClose={() => setFormData((prev) => ({
                    ...prev,
                    statusFlag: false,
                }))}
                title={"Change Project Status"}
                showCloseIcon={true}
                maxWidth="sm"
                actions={
                    < PGrid className="d-flex align-items-center justify-content-end gap-2" >
                        <PButton
                            fullWidth
                            label={getLabel("lbl125")}
                            variant="outlined"
                            onClick={() => setFormData((prev) => ({
                                ...prev,
                                statusFlag: false
                            }))}
                            color={CommonColors.grey.main}
                            width={120}
                        />
                        <PButton
                            fullWidth
                            label={"Yes"}
                            variant={Labels.contained}
                            onClick={(e) => handleSubmit(e, "status")}
                            color={CommonColors.green.main}
                            width={120}
                        />
                    </PGrid >
                }

            >
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTypography
                            labelText={`${"Are you sure you want to change the project status"} ${Labels.symbols.optional}`}
                            flag={Labels.fontFlags.errorLbl}
                            color={CommonColors.grey.main}
                            weight={FontWeight.light}
                        />
                    </PGrid>
                </PGrid>
            </PDialog>

            {/* Survay dialog */}
            <PDialog
                open={formData.email}
                onClose={() => setFormData((prev) => ({
                    ...prev,
                    email: false,
                }))}
                title={"Email Notification"}
                showCloseIcon={true}
                maxWidth="sm"
                actions={
                    < PGrid className="d-flex align-items-center justify-content-end gap-2" >
                        <PButton
                            fullWidth
                            label={"No"}
                            variant="outlined"
                            onClick={() => setFormData((prev) => ({
                                ...prev,
                                email: false
                            }))}
                            color={CommonColors.grey.main}
                            width={120}
                        />
                        <PButton
                            fullWidth
                            label={"Yes"}
                            variant={Labels.contained}
                            onClick={(e) => handleSubmit(e, "email")}
                            color={CommonColors.green.main}
                            width={120}
                        />
                    </PGrid >
                }

            >
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTypography
                            labelText={`${"Are you sure you want to send survey notification email to client"} ${Labels.symbols.optional}`}
                            flag={Labels.fontFlags.errorLbl}
                            color={CommonColors.grey.main}
                            weight={FontWeight.light}
                        />
                    </PGrid>
                </PGrid>
            </PDialog>

            {/* Suppliers dialog */}
            <PDialog
                open={formData.suppliers}
                onClose={() => setFormData((prev) => ({
                    ...prev,
                    suppliers: false,
                    search: ""
                }))}
                title={getLabel("lbl23")}
                showCloseIcon={true}
                maxWidth="md"
                actions={
                    < PGrid className="d-flex align-items-center justify-content-end gap-2" >
                        <PButton
                            fullWidth
                            label={getLabel("lbl125")}
                            variant="outlined"
                            onClick={() => setFormData((prev) => ({
                                ...prev,
                                suppliers: false
                            }))}
                            color={CommonColors.grey.main}
                            width={120}
                        />
                        <PButton
                            fullWidth
                            label={getLabel("lbl199")}
                            variant={Labels.contained}
                            onClick={handleSendChoose}
                            color={CommonColors.green.main}
                            width={200}
                        />
                    </PGrid >
                }

            >
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={6}>
                        <PSearch width="100%" placeholder={"Search a Suplier Name"}
                            onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                search: e.target.value
                            }))} />
                    </PGrid>
                </PGrid>
                <PGrid item xs={12} sm={6} md={12}>
                    <PTable columns={formDataList.columns} rows={data} showCheckbox={true} selectedRows={formDataList.selectedRows} onValidationChange={handleValidationChange} />
                </PGrid>
            </PDialog>

            {/* History Tool dialog */}
            <PDialog
                open={formData.historyTool}
                onClose={() => setFormData((prev) => ({
                    ...prev,
                    historyTool: false,
                    historySearchTool: ""
                }))}
                title={"Historical Data Search Tool"}
                showCloseIcon={true}
                maxWidth="lg"
                actions={
                    < PGrid className="d-flex align-items-center justify-content-end gap-2" >
                        <PButton
                            fullWidth
                            label={getLabel("lbl125")}
                            variant="outlined"
                            onClick={() => setFormData((prev) => ({
                                ...prev,
                                historyTool: false
                            }))}
                            color={CommonColors.grey.main}
                            width={120}
                        />
                        <PButton
                            fullWidth
                            label={getLabel("lbl200")}
                            variant={Labels.contained}
                            onClick={handleSendChoose}
                            color={CommonColors.green.main}
                            width={200}

                        />
                    </PGrid >
                }

            >
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={6}>
                        <PSearch width="100%" placeholder={"Search by EnquiryId, Material Used, PO Number, Qty, Brands, Sub category"}
                            onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                historySearchTool: e.target.value
                            }))} />
                    </PGrid>
                </PGrid>
                <PGrid item xs={12} sm={6} md={12}>
                    <PTable columns={formDataList.historySearchesCloumns} rows={historyToolData} showCheckbox={true} onValidationChange={handleHistory} selectedRows={formDataList.selectedHistroyRows} />
                </PGrid>
            </PDialog>

            {/* Preview Supplier Quotes dialog */}
            <PDialog
                open={formData.preview}
                onClose={() => setFormData((prev) => ({
                    ...prev,
                    preview: false,
                }))}
                title={"Preview Supplier Quotes"}
                showCloseIcon={true}
                maxWidth="lg"
            >
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.previewQuotes} rows={formDataList.previewSupplierQuotes} showPagination={false} />
                    </PGrid>
                </PGrid>
            </PDialog>
        </>

    );
};

export default ProjectEnquiry;