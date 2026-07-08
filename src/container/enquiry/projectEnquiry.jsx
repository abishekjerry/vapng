import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    Grid,
    Button,
    Divider,
    Avatar, Tooltip
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
import { useLanguage } from "../../utils/constants/language";
import { useLocation, useNavigate } from "react-router-dom";
import PDropdown from "../../component/PDropdown/PDropdown";
import { getClientInfo, getEnquiryDetails, getLineneItems, getSummarySections } from "../../utils/constants/summary";
import { ClientInfo_API, Dashboard_API, EnquiryDetails_API, LineItems_API, Suppliers_API, ProjectEnquiry_API } from "../../utils/api/apiUrl";
import { formatDate, getOptionLabel, getOptionValue, isNotEmpty, isSuccess, parseDate, toast } from "../../utils/commonFunction/common";
import { PSummary } from "../../component/PSumary/PSummary";
import PTable from "../../component/PTable/PTable";
import { PostApi } from "../../utils/api/networking";
import PTextField from "../../component/PTextField/PTextField";
import PDatepicker from "../../component/PDatepicker/PDatepicker";
import PDialog from "../../component/PDialog/PDialog";
import PSearch from "../../component/PSearch/PSearch";
import { PiArrowSquareUpLeftLight } from "react-icons/pi";
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


const ProjectEnquiry = () => {
    const { state } = useLocation();
    const { getLabel } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dynamicData, setDynamicData] = useState({});

    //Global variable
    const currency = localStorage.getItem("currency");
    const countryName = localStorage.getItem("country");
    const agancyUserID = parseInt(localStorage.getItem("agancyUserID"));
    const userID = parseInt(localStorage.getItem("userID"))
    const userName = localStorage.getItem("user")
    const id = state?.id > 0 ? state.id : 0;
    const actionFlag = isNotEmpty(state?.id) && state?.id !== 0 ? Labels.flag.Update : Labels.flag.Insert;
    const today = formatDate(new Date());

    //State & list states
    const [formData, setFormData] = useState({
        activeTab: "Job Summary",
        status: "",
        sla: false,
        rfq: false,
        line: false,
        job: false,
        suppliers: false,
        calculateFlag: false,
        validateFlag: false,
        marginFlag: false,
        project: false,
        inputPS: false,
        isCalculate: true,
        historyTool: false,
        rfqFlag: true,
        historySearchTool: "",
        quote: "",
        search: "",
        files: [],
        calculateProject: false,
        //editable state
        clientContact: "",
        projectNo: "",
        estdeliveryDate: "",
        briefReceivedDate: "",
        projectDescription: "",
        managementFee: "",
        savingsType: "",
        savingsReason: "",
        //slaTemplate: ""


    });
    const [formDataList, setFormDataList] = useState({
        clientInfo: [],
        lineItems: [],
        enquiryDetails: [],
        suppliers: [],
        clientContact: [],
        savingsType: [],
        savingsReason: [],
        status: [{ label: "Job Cancelled", value: 1 }],
        data: [],
        columns: [{ field: "suppliername", header: "Supplier's Name" }, { field: "country", header: "Country" }, { field: "suppliercode", header: "Supplier Code" },],
        supplierMaster: [],
        selectedRows: [],
        statusInfo: [],
        selectedSupplierRows: [],
        selectedHistroyRows: [],
        extraInfo: [],

        //calculations
        calculateRows: [{ field: "cost", header: "Cost ($)" }, { field: "sell", header: "Sell ($)" }, { field: "margin", header: "Margin ($)" }, { field: "markupPercent", header: "Markup (%)" }, { field: "marginPercent", header: "Margin (%)" }],
        calculationDetails: [],

        //logs
        historyLogsCloumns: [{ field: "modifiedDate", header: "Modified Date" }, { field: "userName", header: "User ID" }, { field: "field", header: "Field" }
            , { field: "oldValue", header: "Old Value" }, { field: "newValue", header: "New Value" }],
        historyLogs: [],
        lineItemLogsCloumns: [{ field: "modifiedDate", header: "Modified Date" }, { field: "userName", header: "User ID" }, { field: "field", header: "Field" }
            , { field: "oldValue", header: "Old Value" }, { field: "newValue", header: "New Value" }, { field: "itemNumber", header: "Item Number" }],
        lineItemLogs: [],
        calculateSupplierlogsRows: [{ field: "supplierName", header: "Supplier Name" }, { field: "itemName", header: "Item Name" }, { field: "supplierType", header: "Supplier type" }, { field: "smetaAccredited", header: "SMETA accredited" }
            , { field: "gmpAccredited", header: "GMP accredited" }, { field: "natureofsupplier", header: "Nature of supplier" },
        ],
        calculationSupplierlogs: [],

        //project savings list
        projectSavings: [],
        savingsSummary: [],

        savingsSummaryColumns: [{ field: "saving", header: "Savings (Inc. Fee)" }, { field: "savingPercent", header: "Savings % (Inc. Fee)" },
        { field: "savingDisplay", header: "Savings (Excl. Fee)" }, { field: "savingPercentDisplay", header: "Savings % (Excl. Fee)" }],
        savingsCalculation: [{ field: "label" }, { field: "value" }],
        savingsResponseDto: { totalPreviousPrice: 0, totalSellPrice: 0, totalSaving: 0, totalSavingPercent: 0 },
        savingsReasons: [],

        //History Tool
        historySearchesCloumns: [{ field: "enquriyID", header: "Action" }, { field: "qty", header: "Qty" }, { field: "country", header: "Country" }, { field: "specifications", header: "Specifications" },
        { field: "referencePrice", header: "Reference Price" }, { field: "materialUsed", header: "Material Used" }, { field: "poNumber", header: "PO Number" }, { field: "subCategory", header: "Sub Category" }, { field: "brand", header: "Brand" }],
        historySearches: [],

        //RevisedQuotes
        revisedQuotesCloumns: [{ field: "supplierName", header: "Supplier" }, { field: "supplierPrice", header: "Supplier Price ($)", render: (row) => Number(row.supplierPrice || 0).toFixed(2) },
        { field: "dateOfChange", header: "Date/Time Log" }],
        revisedQuotes: [],

        //RequestQuotes
        requestQuotes: [],

    });
    const showProjectSaving = formDataList.projectSavings?.length > 0;

    const tabs = [
        { label: "Job Summary", icon: <WorkOutlineIcon /> },
        { label: "Line Items", icon: <Inventory2Icon /> },
        { label: "SPOT", icon: <BoltIcon /> },
        { label: "RFQ", icon: <RequestQuoteIcon /> },
        ...(showProjectSaving ? [{ label: "Project Saving", icon: <SavingsIcon /> }] : []),
        { label: "SLA", icon: <HandshakeIcon /> },
        { label: "Revised Quotes", icon: <PriceChangeIcon /> },
        { label: "Logs", icon: <HistoryIcon /> },
        { label: "Attachment", icon: <AttachmentIcon /> }
    ]

    //Master function
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await PostApi(Dashboard_API.GetDetails, {
                Enquiryid: id,
            });
            const enqResponse = await PostApi(LineItems_API.GetEnqLineItemsMaster, {
                TypeOfJob: response.enqlineItems[0].printornonprint,
            });
            const projectResponse = await PostApi(ProjectEnquiry_API.GetProjectDetails, {
                enquiryid: id,
                Currency: currency,
                Country: countryName
            });
            const supplierResponse = await PostApi(Suppliers_API.GetEnqSupplierMaster, {
                currency: currency,
                Country: countryName
            });


            const revisedQuotes = [...new Map(projectResponse.revisedQuotes.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.revisedQuotes.filter(y => y.itemNumber === x.itemNumber)
                }));

            const requestQuotes = [...new Map(projectResponse.requestQuotes.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.requestQuotes.filter(y => y.itemNumber === x.itemNumber)
                }));

            const projectSavings = [...new Map(projectResponse.savingsResponseDto.details.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: x.itemName,
                    items: projectResponse.savingsResponseDto.details.filter(y => y.itemNumber === x.itemNumber)
                }));

            const savingsSummary = [...new Map(projectResponse.savingsResponseDto.itemWiseSummary.map(x => [x.itemNumber, x])).values()]
                .map(x => ({
                    isSubTitle: true,
                    subTitle: "Item - itemName",
                    items: projectResponse.savingsResponseDto.itemWiseSummary.filter(y => y.itemNumber === x.itemNumber)
                }));

            //Calculation Details for RFQ
            const total = projectResponse.calculationDetails.reduce((a, b) => ({
                cost: a.cost + b.cost,
                sell: a.sell + b.sell,
                margin: a.margin + b.margin
            }), { cost: 0, sell: 0, margin: 0 });

            total.markupPercent = +(total.margin / total.cost * 100).toFixed(2);
            total.marginPercent = +(total.margin / total.sell * 100).toFixed(2);
            const calculationDetails = [total];

            setFormDataList(prev => ({
                ...prev,
                lineItems: response.enqlineItems,
                clientInfo: response.enqClientinfo,
                enquiryDetails: response.enqProjectinfo,
                suppliers: response.supplierinfo,
                supplierMaster: supplierResponse,
                savingsType: enqResponse.savingsType,
                statusInfo: [{ label: getLabel("lbl162"), value: response.enqClientinfo?.enqUId || "-" }, { label: getLabel("lbl163"), value: response.enqProjectinfo?.projectNo || "-" }],
                extraInfo: [
                    { label: getLabel("lbl164"), value: response.enqProjectinfo?.estdate || "-" },
                    { label: getLabel("lbl10"), value: userName || "-" },
                    { label: getLabel("lbl162"), value: response.enqClientinfo?.enqUId || "-" }
                ],
                savingsReasons: projectResponse.savingReasons,
                historyLogs: projectResponse.historyLogs,
                lineItemLogs: projectResponse.lineItemLogs,
                historySearches: projectResponse.historySearches,
                revisedQuotes: revisedQuotes,
                requestQuotes: requestQuotes,
                calculationDetails: calculationDetails,
                calculationSupplierlogs: projectResponse.calculationSupplierlogs,
                projectSavings: projectSavings,
                savingsSummary: savingsSummary,
                savingsResponseDto: projectResponse.savingsResponseDto
            }));
            setFormData(prev => ({
                ...prev,
                quote: response.enqProjectinfo?.quoteBy,
                calculateFlag: projectResponse.requestQuotes[0].initialQuote > 0,
                rfqFlag: projectResponse.calculationDetails?.length === 0,
                marginFlag: projectResponse.calculationDetails?.length > 0,
                calculateProject: projectResponse.savingsResponseDto.details.length > 0
            }));
            await clientInfoMaster(response.enqClientinfo.divisionid);
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    //Change Function
    const handleChange = (e, row) => {
        const { name, value, label } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === Labels.lineItems.savingsType) {
            setFormDataList(prev => ({
                ...prev,
                savingsReasons: prev.savingsReasons.map(item =>
                    item.itemName === row.itemName ? {
                        ...item,
                        [name]: label
                    } : item
                )
            }));
            SavingsReasonMaster(label);
        }
    };


    const SavingsReasonMaster = async (data) => {
        try {
            setLoading(false);
            const response = await PostApi(LineItems_API.GetEnqLineItemsMaster, {
                TypeOfJob: formDataList.lineItems[0].printornonprint,
                Savingstype: data,
            });
            setFormDataList(prev => ({
                ...prev,
                savingsReason: response.savingsReason,
            }));

        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
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

    const clientInfo = getClientInfo({}, {}, {}, getLabel, getOptionLabel, formDataList.clientInfo, formDataList.extraInfo);
    const enquiryDetails = getEnquiryDetails({}, {}, {}, getLabel, getOptionLabel, formDataList.enquiryDetails, false);
    const rawLineItems = getLineneItems({}, formDataList, getLabel, getOptionLabel, formDataList.lineItems);
    const lineItems = rawLineItems.map((item, index) => ({
        subTitle: `${item.itemTitle}`,
        enquiryId: item.enquiryId,
        items: item.items,
    }));

    const sections = getSummarySections({ lineItems, getLabel });

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
        }));
        await fetchData();
    };

    const handleCalculate = async (e, flag) => {
        if (flag == "reCalculate") {
            const response = await PostApi(ProjectEnquiry_API.UpdateJobStatus, {
                enqId: id,
                modifiedBy: agancyUserID,
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
                ModifiedBy: agancyUserID,
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
        render: (row) => (
            <PTextField
                name={field}
                value={row[field] || ""}
                onChange={(e) => handleProjectInputChange(e.target.value, row.id, row.enquiryId, field)}
                width={170}
                sx={{
                    "& .MuiInputBase-root": {
                        height: 50,
                    }
                }}
            //placeHolder={field == "previousSupplier" ? "Previous Po No" : "0"}
            // onKeyPress={() =>
            //     setFormData(prev => ({
            //         ...prev,
            //         historyTool: true
            //     }))
            // }
            //disabled={field == "previousSupplier" ? false : true}
            />
        )
    });

    const savings = formDataList.savingsResponseDto;
    const savingsCalculation = [
        {
            label: "Savings Reference Price",
            value: savings.totalPreviousPrice.toFixed(2)
        },
        {
            label: "Total PMG Sell Price (inc.fee)",
            value: savings.totalSellPrice.toFixed(2)
        },
        {
            label: "Savings ($)",
            value: savings.totalSaving.toFixed(2)
        },
        {
            label: "Savings %",
            value: `${savings.totalSavingPercent.toFixed(2)} %`
        }
    ];
    const projectSavings = [
        {
            field: "previousSupplier", header: "Previous PO Number",
            ...(formData.inputPS && renderProjectEditableField("previousSupplier"))
        },
        {
            field: "reasonForSaving", header: "Savings Reason"
        },
        {
            field: "baselineQuantity", header: "Baseline Quantity",
            ...(formData.inputPS && renderProjectEditableField("baselineQuantity"))
        },
        {
            field: "previousPrice", header: "Savings Reference Price ($)",
            ...(formData.inputPS && renderProjectEditableField("previousPrice"))
        },
        {
            field: "negItemSellPrice", header: "Current PMG Sell Price (Excl. Fee)"
        },
        {
            field: "itemSellPrice", header: "Current PMG Sell Price (Incl. Fee)"
        }
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

    //RFQ functionality
    const renderEditableField = (field) => ({
        render: (row) => (
            <PTextField
                name={field}
                value={row[field] ?? ""}
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
                        ? (field === "negQuote" && Number(data) > Number(item.initialQuote))
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
            ...(isQuote && renderEditableField("initialQuote")),
        },
        {
            field: "negQuote",
            header: "Neg.Quote ($)",
            ...(isQuote && renderEditableField("negQuote")),
        },
        {
            field: "iniUnitPrice",
            header: "Ini.unit Price ($)",
            ...(isUnit && renderEditableField("iniUnitPrice")),
        },
        {
            field: "negUnitPrice",
            header: "Neg.unit Price ($)",
            ...(isUnit && renderEditableField("negUnitPrice")),
        },
        {
            field: "negUnitPriceFee", header: "Neg.unit Price with MFee ($)"
        },
        { field: "pmgSellPrice", header: "PMG Sell Price ($)", rowSpan: true }
    ];

    //savings reason functionality

    useEffect(() => {
        if (formData.project && formDataList?.savingsReasons?.length) {
            formDataList.savingsReasons.forEach(item => {
                SavingsReasonMaster(item.savingsType);
            });
        }
    }, [formData.project]);

    const renderSavingsType = (row) => {
        if (!formData.project) return row.savingsType;
        const value = getOptionValue(formDataList.savingsType, row.savingsType)
        return (
            <PDropdown
                value={value}
                onChange={(e) => handleChange(e, row)}
                name={Labels.lineItems.savingsType}
                options={formDataList.savingsType}
                flag={Labels.flag.auto}
            />
        );
    };

    const renderSavingsReason = (row) => {
        if (!formData.project) return row.savingsReason;
        const value = getOptionValue(formDataList.savingsReason, row.savingsReason);
        return (
            <PDropdown
                value={value}
                onChange={(e) => handleChange(e, row)}
                name={Labels.lineItems.savingsReason}
                options={formDataList.savingsReason}
                flag={Labels.flag.auto}
            />
        );
    };
    const savingsReasons = [{ field: "itemName", header: "Item" },
    { field: "savingstype", header: "Savings Type", render: renderSavingsType },
    { field: "savingsreason", header: "Savings Reason", render: renderSavingsReason }];

    //Action button function
    const renderActionButtons = (flag) => (
        formData[flag] ? (
            <>
                <PButton
                    label={getLabel("lbl125")}
                    variant="outlined"
                    color={CommonColors.blue.main}
                    onClick={() => handleCancel(null, flag)}
                    width={120}
                />

                <PButton
                    label={getLabel("lbl124")}
                    variant="contained"
                    color={CommonColors.green.main}
                    onClick={() => handleSubmit(null, flag)}
                    width={120}
                    disabled={formData.validateFlag}
                />
            </>

        ) : (
            <PButton
                label={flag == "inputPS" ? getLabel("lbl165") : getLabel("lbl160")}
                variant="contained"
                color={CommonColors.grey.main}
                onClick={() => handleEdit(null, flag)}
                width={flag == "inputPS" ? 250 : 120}
            />
        )
    );

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ...(formDataList.clientInfo?.clientContactId && {
                clientContact: formDataList.clientInfo.clientContactId
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
        let requests = [];
        const clientInfo = {
            enqId: id,
            divisionid: formDataList.clientInfo.divisionid,
            clientContactId: formData.clientContact,
            createdBy: userID,
            modifiedBy: agancyUserID,
            brand: formDataList.clientInfo.brand,
            deliveryCountryId: formDataList.clientInfo.deliveryCountryId,
            pMGEntity: formDataList.clientInfo.pmgEntity,
            aboveorAtmarket: formDataList.clientInfo.aboveorAtmarket,
            Action: actionFlag,
        };
        const enquiryDetails = {
            enqId: id,
            projectNo: flag === "job" ? formData.projectNo : formDataList.enquiryDetails.projectNo,
            projectDesc: flag === "job" ? formData.projectDescription : formDataList.enquiryDetails.projectDesc,
            estdate: flag === "job" ? formatDate(parseDate(formData.estdeliveryDate)) : formDataList.enquiryDetails.estdate,
            briefdate: flag === "job" ? formatDate(parseDate(formData.briefReceivedDate)) : formDataList.enquiryDetails.briefdate,
            modifiedBy: agancyUserID,
            quoteBy: formDataList.enquiryDetails.quoteBy,
            slaId: formDataList.enquiryDetails.slaId,
            managementfeetypeId: formDataList.enquiryDetails.managementfeetypeId,
            hybridModel: formDataList.enquiryDetails.hybridModel,
            attribute: formDataList.enquiryDetails.attribute,
            year: formDataList.enquiryDetails.year,
            ...dynamicData
        };
        const supplierQuotes = formDataList.requestQuotes.flatMap(group =>
            group.items.map(item => ({
                enqId: item.enquiryId,
                quoteId: item.supplierQuotesId,
                supplierQuoteAmountPriceOrQuantity: formData.quote,
                itemNumber: item.enquiryDetailsId,
                qty: item.quantity,
                modifiedBy: agancyUserID,
                intialprice: item.initialQuote?.toString(),
                negoprice: item.negQuote?.toString(),
                initialUnitprice: item.iniUnitPrice?.toString(),
                negoUnitprice: item.negUnitPrice?.toString()
            }))
        );

        const projectQuotes = formDataList.projectSavings.flatMap(group =>
            group.items.map(item => ({
                Id: item.id,
                previousSupplier: item.previousSupplier,
                previousPrice: item.previousPrice,
                note: item.reasonForSaving,
                BaselineQuantity: item.baselineQuantity
            }))
        );

        switch (flag) {
            case "sla":
                activeTab = "SLA";
                requests.push(
                    PostApi(EnquiryDetails_API.AddUpdateEnquiryDetails, enquiryDetails)
                );
                break;

            case "job":
                activeTab = "Job summary";
                requests.push(
                    PostApi(ClientInfo_API.AddUpdateClientInfo, clientInfo),
                    PostApi(EnquiryDetails_API.AddUpdateEnquiryDetails, enquiryDetails)
                );
                break;

            case "rfq":
                activeTab = "RFQ";
                await PostApi(ProjectEnquiry_API.PostSupplierQuotes, supplierQuotes);
                handleCancel(null, flag);
                return;

            case "line":
                activeTab = "Line items";
                handleCancel(null, flag);
                return;

            case "project":
                activeTab = "Project Savings";
                handleCancel(null, flag);
                return;

            case "inputPS":
                activeTab = "Project Savings";
                await PostApi(ProjectEnquiry_API.PostRefPrice, projectQuotes);
                setFormData(prev => ({
                    ...prev,
                    calculateProject,
                }))
                handleCancel(null, flag);
                return;

            default:
                return;
        }

        try {
            setLoading(true);
            const response = await Promise.all(requests);
            const successCount = response.filter(item => item?.status === true).length;
            const message = successCount > 1 ? Labels.message.updatedSuccessfully : response?.[0]?.data?.message;
            const status = successCount === response.length ? Labels.status.success : Labels.status.failure;
            toast(status, message);
            setFormData(prev => ({
                ...prev,
                activeTab,
            }))
            handleCancel(null, flag)
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

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

                <PGrid container className={Labels.margin.mb3}>
                    <PGrid item xs={12} md={12} sm={12}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                            <PDropdown
                                name={"status"}
                                value={formData.status}
                                label={getLabel("lbl166")}
                                onChange={handleChange}
                                options={formDataList.status}
                                width={27}
                                helperText={""}
                            />
                            <PButton
                                label={getLabel("lbl40")}
                                variant="contained"
                                color={CommonColors.green.main}
                                //onClick={(e) => handleSubmit(e, true)}
                                width={150}
                                height={45}
                            />
                        </Box>
                    </PGrid>
                </PGrid>

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
                                {renderActionButtons("job")}
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb3}>
                            {clientInfo.map((item, i) => (
                                <PGrid item xs={12} md={6} xl={3} key={i}>
                                    {
                                        formData.job && item.label === getLabel("lbl35") ? (
                                            <PDropdown
                                                name={Labels.clientInfo.clientContact}
                                                label={item.label}
                                                value={formData.clientContact}
                                                onChange={(e) => handleChange(e)}
                                                options={formDataList.clientContact}
                                                width={100}
                                            />
                                        ) : (
                                            <PGrid className={`ps-2 mb-4`}>
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
                                        )
                                    }
                                </PGrid>
                            ))}
                        </PGrid>
                        <PGrid container className={Labels.margin.mb3}>
                            {enquiryDetails.map((item, i) => (

                                <PGrid item xs={12} md={6} xl={3} key={i}>
                                    {
                                        formData.job && item.label === getLabel("lbl42") ? (
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
                                        ) : formData.job && item.label === getLabel("lbl45") ? (
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
                    </PCard>
                )}

                {formData.activeTab === "Line Items" && (
                    <PCard >
                        <PGrid container className={Labels.margin.mb3}>
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={getlabel("lbl22")}
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

                        <PGrid container className={Labels.margin.mb3}>
                            <PGrid item xs={12} sm={6} md={6}>
                                <PTypography
                                    labelText={getLabel("lbl168")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                            <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                {renderActionButtons("line")}
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb3}>
                            <PGrid item xs={12} sm={6} md={2} >
                                <PGrid className={`ps-2 mb-4`}>
                                    <PTypography
                                        labelText={`${getLabel("lbl168")} ${(Labels.symbols.percent)}`}
                                        weight={FontWeight.bold}
                                    />
                                    {formData.line ? (
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
                )}

                {formData.activeTab === "SPOT" && (
                    <PSpotSection></PSpotSection>
                )}

                {formData.activeTab === "RFQ" && (
                    <PCard className={Labels.margin.mb3}>
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
                                {formData.marginFlag ? <></> : renderActionButtons("rfq")}
                            </PGrid>
                        </PGrid>
                        <Divider sx={{ mb: 2 }} />
                        <PGrid container className={Labels.margin.mb4}>
                            <PGrid item xs={12} sm={6} md={12}>
                                <PTable columns={requestQuotes} rows={formDataList.requestQuotes} showCheckbox={formData.rfqFlag} selectedRows={formDataList.selectedSupplierRows} onValidationChange={handleRFQ} disabled={formData.rfq} bgColor={true} />
                            </PGrid>
                        </PGrid>
                        <PGrid container className={Labels.margin.mb4}>
                            {formData.marginFlag ? <></> :
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
                            }
                            {formData.calculateFlag ? (
                                <PGrid item xs={12} sm={12} md={formData.marginFlag ? 12 : 6} className="d-flex justify-content-end gap-2">
                                    <PButton
                                        label={getLabel("lbl173")}
                                        variant="contained"
                                        color={CommonColors.grey.main}
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
                            ) : <></>}
                        </PGrid>
                        {formData.marginFlag ? (
                            <>
                                <PGrid container className={Labels.margin.mb4}>
                                    <PGrid item xs={12} sm={6} md={12}>
                                        <PTable columns={formDataList.calculateRows} rows={formDataList.calculationDetails} />
                                    </PGrid>
                                </PGrid>
                                <PGrid container className={Labels.margin.mb4}>
                                    <PGrid item xs={12} sm={6} md={12}>
                                        <PTable columns={formDataList.calculateSupplierlogsRows} rows={formDataList.calculationSupplierlogs} />
                                    </PGrid>
                                </PGrid>
                            </>
                        ) : (<></>)}
                    </PCard>
                )}

                {formData.activeTab === "Project Saving" && (
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
                                <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                                    {renderActionButtons("project")}
                                </PGrid>
                            </PGrid>

                            <Divider sx={{ mb: 2 }} />
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={savingsReasons} rows={formDataList.savingsReasons} />
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={12} md={12} className="d-flex justify-content-end gap-2">
                                    {renderActionButtons("inputPS")}
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={projectSavings} rows={formDataList.projectSavings} />
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={12}>
                                    <PTable columns={formDataList.savingsSummaryColumns} rows={formDataList.savingsSummary} />
                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={6} ></PGrid>
                                <PGrid item xs={12} sm={6} md={6} >
                                    <PTable columns={formDataList.savingsCalculation} rows={savingsCalculation} showHeader={false} showPagination={false} />
                                </PGrid>
                            </PGrid>
                        </PCard>

                        {formData.calculateProject && (
                            <PCard className={Labels.margin.mb3}>
                                <PGrid container className="d-flex align-items-center justify-content-between mb-3">
                                    <PGrid item xs={12} sm={6} md={6}>
                                        <PTypography
                                            labelText={getLabel("lbl176")}
                                            flag={Labels.fontFlags.subHeader}
                                            color={CommonColors.black.main}
                                            weight={FontWeight.bold}
                                        />
                                        <PTypography
                                            labelText={getLabel("lbl117")}
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
                        )}
                    </>
                )}


                {formData.activeTab === "SLA" && (
                    <Box sx={{ px: 2, py: 2 }}>
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
                        <PSlaTemplate slaId={formDataList?.enquiryDetails?.slaId} enquiryId={id} getLabel={getLabel} quoteStartDate={formDataList?.enquiryDetails?.quotestartdate} disabled={!formData.sla}
                            onChange={handleSlaChange}
                        />
                    </Box>
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
                                <PTable columns={formDataList.revisedQuotesCloumns} rows={formDataList.revisedQuotes} />
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
            </Box >

            <PDialog
                open={formData.suppliers}
                onClose={() => setFormData((prev) => ({
                    ...prev,
                    suppliers: false,
                    search: ""
                }))}
                title={"Suppliers"}
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
                            label={"Send invite to supplier"}
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
                            label={"Save Reference Price"}
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
        </>

    );
};

export default ProjectEnquiry;