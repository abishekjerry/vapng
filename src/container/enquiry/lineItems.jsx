import { Box, IconButton } from "@mui/material";
import {
    UploadFile as UploadFileIcon,
    Close as CloseIcon,
    InsertDriveFile as InsertDriveFileIcon,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import PTypography from "../../component/PTypography/PTypography";
import PGrid from "../../component/PGrid/PGrid";
import PDropdown from "../../component/PDropdown/PDropdown";
import { Labels } from "../../utils/constants/labels";
import React, { useState, useEffect, useMemo } from "react";
import { FontWeight } from "../../utils/constants/fonts";
import PCard from "../../component/PCard/PCard";
import { CommonColors } from "../../utils/constants/colors";
import PButton from "../../component/PButton/PButton";
import PStepper from "../../component/PStepper/PStepper";
import PTextField from "../../component/PTextField/PTextField";
import { allowDecimal, allowOnlyNumbers, getEnquirySteps, getOptionLabel, getOptionValue, isNotEmpty, isSuccess, toast } from "../../utils/commonFunction/common";
import { useLanguage } from "../../utils/constants/language";
import { labelRoutes } from "../../navigations/labelRoutes";
import { useLocation, useNavigate } from "react-router-dom";
import { Dashboard_API, LineItems_API } from "../../utils/api/apiUrl";
import { PostApi } from "../../utils/api/networking";
import { PDraftDialog } from "../../component/PDialog/PDraftDialog";
import PreviewDialog from "../../component/PDialog/PPreviewDialog";
import { getClientInfo, getEnquiryDetails, getLineneItems, getSummarySections } from "../../utils/constants/summary";
import { PSummary } from "../../component/PSumary/PSummary";
import PDialog from "../../component/PDialog/PDialog";
import PFileUpload from "../../component/PFileUpload/PFileUpload";
import PAttachment from "../../component/PAttachment/PAttachment";
const LineItems = () => {
    const { state } = useLocation();
    const { getLabel } = useLanguage();
    const navigate = useNavigate();
    const [allowRedirect, setAllowRedirect] = useState(false);
    const enquirySteps = getEnquirySteps(getLabel);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [formDataList, setFormDataList] = useState({
        typeOfJob: [{ label: "Strategic", value: 1 }, { label: "Tactical", value: 2 }, { label: "Operational", value: 3 }, { label: "Non-Addressable", value: 4 }],
        category: [],
        itemCategory: [],
        subCategory: [],
        exceptionsReasonCode: [],
        itemType: [{ label: "New Item", value: 1 }, { label: "Repeat/Existing Item", value: 2 }, { label: "Non-Addressable", value: 3 }],
        incoterm: [{ label: "FCA/FOB", value: 1 }, { label: "Others", value: 2, selected: true }],
        typeOfItem: [],
        localCatalog: [],
        globalOrder: [],
        regionalOrder: [],
        sourcingLocation: [],
        savingsType: [],
        savingsReason: [],
        printingMethod: [],
        yesNoNa: [{ label: "Yes", value: 1 }, { label: "No", value: 2 }, { label: "N/A", value: 3, selected: true }],
        soYesNoNa: [{ label: "Yes, Accepted", value: 1 }, { label: "Yes, Rejected", value: 2 }, { label: "No", value: 3 }, { label: "N/A", value: 4, selected: true }],
        yesOrNo: [{ label: "Yes", value: 1 }, { label: "No", value: 2, selected: true }],
        tcoYesOrNo: [{ label: "Yes", value: 1 }, { label: "No", value: 2 }],
        yesOrNoNot: [{ label: "Yes", value: 1 }, { label: "No", value: 2 }, { label: "Not Applicable", value: 3 }],
        competitiveBiddingExceptionFormSigned: [],
        simplex: [{ label: "Non-Simplex", value: 1 }, { label: "Simplex", value: 2 }, { label: "Not Applicable", value: 3 }],
        quoteType: [{ label: "Quote by Quantity", value: 1 }, { label: "Quote by Quantity & Size 2D", value: 2 }, { label: "Quote by Quantity & Size 3D", value: 3 }],

        //editable states
        clientInfo: [],
        enquiryDetails: [],
        lineItems: [],
    });

    const [formData, setFormData] = useState({
        category: "",
        typeOfJob: "",
        rateCard: "",
        competitiveBiddingMandatory: "",
        competitiveBiddingCompliant: "",
        competitiveBiddingExceptionFormSigned: "",
        exceptionsReasonCode: "",
        itemCategory: "",
        subCategory: "",
        simplex: "",
        tcoApprovalRequired: "",
        tcoApproved: "",
        dictatedJob: "",
        itemType: "",
        incoterm: "",
        itemName: "",
        itemNameDescription: "",

        // Sustainability Information
        fscOrPefcMaterial: "",
        taxCertification: "",
        recyclable: "",
        sustainabilityOption: "",
        recycledMaterial: "",
        designedToBeReused: "",
        containsPlastic: "",
        containsRecycledPlastic: "",
        recycledMaterialWeightKg: "",

        // Catalogue Section
        ratecardCatalogueItemDeclined: "",
        globalOrderWindowCatalogueName: "",
        regionalOrderWindowCatalogue: "",
        localCatalogueName: "",
        eAuction: "",
        competitiveBiddingWinningSupplierCost: "",
        printingMethod: "",
        typeOfItem: "",
        noOfMaterials: "",
        harmonizedOrder: "",
        digitalInnovation: "",
        innovation: "",
        sourcingLocation: "",
        savingsType: "",
        savingsReason: "",
        owWithLink: "",

        // Specifications
        noOfVersion: 1,
        specifications: "",
        notesComments: "",

        // Quantity
        quantityType: "",
        quantity: "",
        length: "",
        width: "",
        depth: "",
        files: []
    });

    const [errors, setErrors] = useState({
        category: "",
        typeOfJob: "",
        rateCard: "",
        competitiveBiddingMandatory: "",
        competitiveBiddingCompliant: "",
        competitiveBiddingExceptionFormSigned: "",
        exceptionsReasonCode: "",
        itemCategory: "",
        subCategory: "",
        //simplex: "",
        tcoApprovalRequired: "",
        tcoApproved: "",
        dictatedJob: "",
        itemType: "",
        incoterm: "",
        itemName: "",
        itemNameDescription: "",

        // Sustainability Information
        fscOrPefcMaterial: "",
        taxCertification: "",
        recyclable: "",
        sustainabilityOption: "",
        recycledMaterial: "",
        designedToBeReused: "",
        containsPlastic: "",
        containsRecycledPlastic: "",
        recycledMaterialWeightKg: "",

        // Catalogue Section
        ratecardCatalogueItemDeclined: "",
        globalOrderWindowCatalogueName: "",
        regionalOrderWindowCatalogue: "",
        localCatalogueName: "",
        eAuction: "",
        competitiveBiddingWinningSupplierCost: "",
        printingMethod: "",
        typeOfItem: "",
        noOfMaterials: "",
        harmonizedOrder: "",
        digitalInnovation: "",
        innovation: "",
        sourcingLocation: "",
        savingsType: "",
        savingsReason: "",
        owWithLink: "",

        // Specifications
        noOfVersion: "",
        specifications: "",
        notesComments: "",

        // Quantity
        quantityType: "",
        quantity: "",
        length: "",
        width: "",
        depth: "",
    });

    //Quote of Quantity 
    const type = Number(formData.quantityType);
    const flatSize = type === 3 ? (+formData.length || 0) * (+formData.width || 0) * (+formData.depth || 0) : (+formData.length || 0) * (+formData.width || 0);
    const totalSize = flatSize * (+formData.quantity || 0);

    const clientInfo = getClientInfo({}, {}, {}, getLabel, getOptionLabel, formDataList.clientInfo);
    const enquiryDetails = getEnquiryDetails({}, {}, {}, getLabel, getOptionLabel, formDataList.enquiryDetails);
    const rawLineItems = getLineneItems(formData, formDataList, getLabel, getOptionLabel, formDataList.lineItems);
    const lineItems = rawLineItems.map((item, index) => ({
        subTitle: `${item.itemTitle}`,
        enquiryId: item.enquiryId,
        items: item.items,
    }));

    const sections = getSummarySections({ clientInfo, enquiryDetails, lineItems, getLabel });
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await PostApi(Dashboard_API.Master, {});
            setFormDataList(prev => ({
                ...prev,
                category: response.typeofJob,
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
                }))
            }
        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    const SavingsReasonMaster = async (data, hybird = false) => {
        try {
            setLoading(false);
            const response = await PostApi(LineItems_API.GetEnqLineItemsMaster, {
                TypeOfJob: category,
                Savingstype: data,
            });
            setFormDataList(prev => ({
                ...prev,
                savingsReason: response.savingsReason,
            }));
            if (hybird) {
                //hybird condition
                setFormData(prev => ({
                    ...prev,
                    savingsType: getOptionValue(response.savingsType, formDataList.lineItems?.[0]?.savingstype),
                    savingsReason: getOptionValue(response.savingsReason, formDataList.lineItems?.[0]?.savingsreason)
                }));
            }

        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = formDataList.yesOrNoNot?.filter(option => option.value !== 2) || [];
        setFormDataList(prev => {
            // prevent infinite loop
            if (JSON.stringify(prev.competitiveBiddingExceptionFormSigned) === JSON.stringify(filtered)) {
                return prev;
            }
            return {
                ...prev,
                competitiveBiddingExceptionFormSigned: filtered
            };
        });

    }, [formDataList.yesOrNoNot]);

    const getSelectedValue = (arr) => arr?.find(option => option.selected)?.value ?? "";
    const selectedValues = useMemo(() => ({
        yesOrNo: getSelectedValue(formDataList.yesOrNo),
        soYesNoNa: getSelectedValue(formDataList.soYesNoNa),
        yesNoNa: getSelectedValue(formDataList.yesNoNa),
        incoterm: getSelectedValue(formDataList.incoterm),
        globalOrder: getSelectedValue(formDataList.globalOrder),
        localCatalog: getSelectedValue(formDataList.localCatalog),
        regionalOrder: getSelectedValue(formDataList.regionalOrder),
        typeOfItem: getSelectedValue(formDataList.typeOfItem),
        printingMethod: getSelectedValue(formDataList.printingMethod),
    }), [formDataList.yesOrNo, formDataList.soYesNoNa, formDataList.yesNoNa, formDataList.incoterm, formDataList.globalOrder,
    formDataList.localCatalog, formDataList.regionalOrder, formDataList.typeOfItem, formDataList.printingMethod]);

    useEffect(() => {
        const { yesOrNo, soYesNoNa, yesNoNa, incoterm, globalOrder, localCatalog, regionalOrder, typeOfItem, printingMethod } = selectedValues;
        setFormData(prev => {
            if (prev.incoterm === incoterm && prev.globalOrderWindowCatalogueName === globalOrder && prev.localCatalogueName === localCatalog &&
                prev.regionalOrderWindowCatalogue === regionalOrder && prev.typeOfItem === typeOfItem //, prev.printingMethod === printingMethod
            ) {
                return prev;
            }

            return {
                ...prev,
                ...(yesNoNa && soYesNoNa && {
                    fscOrPefcMaterial: yesNoNa,
                    recyclable: yesNoNa,
                    sustainabilityOption: soYesNoNa,
                    recycledMaterial: yesNoNa,
                    designedToBeReused: yesNoNa,
                    containsPlastic: yesNoNa,
                    containsRecycledPlastic: yesNoNa,
                    digitalInnovation: yesNoNa,
                    innovation: yesNoNa,
                    taxCertification: yesNoNa,
                }),
                ...(yesOrNo && {
                    eAuction: yesOrNo,
                    owWithLink: yesOrNo,
                    dictatedJob: yesOrNo,
                    rateCard: yesOrNo,
                    harmonizedOrder: yesOrNo
                }),
                ...(incoterm && { incoterm: incoterm }),
                ...(globalOrder && { globalOrderWindowCatalogueName: globalOrder }),
                ...(regionalOrder && { regionalOrderWindowCatalogue: regionalOrder }),
                ...(localCatalog && { localCatalogueName: localCatalog }),
                ...(typeOfItem && { typeOfItem: typeOfItem }),
                ...(printingMethod && { printingMethod: printingMethod })
            };
        });

    }, [selectedValues]);

    const LineItemsMaster = async (data) => {
        try {
            setLoading(false);
            const response = await PostApi(LineItems_API.GetEnqLineItemsMaster, {
                TypeOfJob: data
            });
            setFormDataList(prev => ({
                ...prev,
                itemCategory: response.itemCategory,
                subCategory: response.subCategory,
                exceptionsReasonCode: response.exceptionReason,
                typeOfItem: response.typeOfItem,
                localCatalog: response.localCatalog,
                globalOrder: response.globalOrder,
                regionalOrder: response.regionalOrder,
                sourcingLocation: response.sourcingLocation,
                savingsType: response.savingsType,
                printingMethod: response.printingMethod,
            }));

        } catch (error) {
            toast(Labels.status.failure, Labels.message.somethingWentWrong);
        } finally {
            setLoading(false);
        }
    };

    const fieldConfig = {
        [Labels.lineItems.noOfMaterials]: { type: "number" },
        [Labels.lineItems.noOfVersion]: { type: "number" },
        [Labels.lineItems.quantity]: { type: "number" },
        [Labels.lineItems.width]: { type: "decimal" },
        [Labels.lineItems.length]: { type: "decimal" },
        [Labels.lineItems.depth]: { type: "decimal" },
        [Labels.lineItems.recycledMaterialWeightKg]: { type: "decimal" },
        [Labels.lineItems.competitiveBiddingWinningSupplierCost]: { type: "decimal" }
    };


    const handleChange = (e) => {
        const { name, value, files, label } = e.target;
        const config = fieldConfig[name];
        const formattedValue = config?.type === "number"
            ? allowOnlyNumbers(value) : config?.type === "decimal" ? allowDecimal(value) : value;

        // Restrict No. of Materials to 1-5
        if (name === Labels.lineItems.noOfMaterials && formattedValue !== ""
            && (Number(formattedValue) < 1 || Number(formattedValue) > 5)
        ) {
            return;
        }

        // Handle special field logic
        if (name === Labels.lineItems.category) {
            LineItemsMaster(label);
        }

        if (name === Labels.lineItems.savingsType) {
            SavingsReasonMaster(label);
        }

        // Prepare updated form data
        let data = {
            [name]: files ? files : formattedValue
        };

        if (name === Labels.lineItems.typeOfJob) {
            const isType4 = formattedValue == 4;
            data = {
                ...data,
                competitiveBiddingCompliant: isType4 ? 3 : "",
                competitiveBiddingExceptionFormSigned: isType4 ? 3 : "",
                competitiveBiddingMandatory: isType4 ? 3 : "",
                exceptionsReasonCode: isType4 ? 8 : "",
            };
        }
        if (name === Labels.lineItems.globalOrderWindowCatalogueName) {
            const isType4 = formattedValue == 1;
            data = {
                ...data,
                harmonizedOrder: isType4 ? 2 : 1,
            };
        }


        // Update states
        setFormData(prev => ({
            ...prev,
            ...data
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const flag = isNotEmpty(state?.id) && state?.id !== 0 ? Labels.flag.Update : Labels.flag.Insert;
    const id = state?.id > 0 ? state.id : 0;

    const handleSubmit = async (e, flag) => {
        if (lineItems.length > 0 && flag && !formData.itemCategory) {
            setAllowRedirect(false);
            navigate(labelRoutes.suppliers, { state: { id: id } });
            return;
        }

        const isValid = LineItemsValidation();
        if (isValid) {
            try {
                setLoading(true);
                const payload = {
                    //lineItems
                    EnqId: id,
                    Printornonprint: getOptionLabel(formDataList.category, formData.category),
                    TOJABC: getOptionLabel(formDataList.typeOfJob, formData.typeOfJob),
                    localRateCard: getOptionLabel(formDataList.yesOrNo, formData.rateCard),
                    Competbidmandate: getOptionLabel(formDataList.yesOrNoNot, formData.competitiveBiddingMandatory),
                    Competbidcomplaint: getOptionLabel(formDataList.yesOrNoNot, formData.competitiveBiddingCompliant),
                    Competbidexception: getOptionLabel(formDataList.competitiveBiddingExceptionFormSigned, formData.competitiveBiddingExceptionFormSigned),
                    Exceptionreason: getOptionLabel(formDataList.exceptionsReasonCode, formData.exceptionsReasonCode),
                    ProductCategoryId: formData.itemCategory,
                    SubcatID: formData.subCategory,
                    Simplex: getOptionLabel(formDataList.simplex, formData.simplex),
                    TCOapproval: getOptionLabel(formDataList.tcoYesOrNo, formData.tcoApprovalRequired),
                    TCOapproved: getOptionLabel(formDataList.tcoYesOrNo, formData.tcoApproved),
                    Dictated: getOptionLabel(formDataList.yesOrNo, formData.dictatedJob),
                    Itemtype: getOptionLabel(formDataList.itemType, formData.itemType),
                    Incoterm: getOptionLabel(formDataList.incoterm, formData.incoterm),
                    ItemName: formData.itemName,
                    ItemDescription: formData.itemNameDescription,


                    // ✅ Sustainability
                    usingFSCMaterial: getOptionLabel(formDataList.yesNoNa, formData.fscOrPefcMaterial),
                    OEKOTEXCertification: getOptionLabel(formDataList.yesNoNa, formData.taxCertification),
                    designedforrecycling: getOptionLabel(formDataList.yesNoNa, formData.recyclable),
                    proposedwithsustainabilityoption: getOptionLabel(formDataList.soYesNoNa, formData.sustainabilityOption),
                    WasthisitemdesignedtoreducedPlastic: getOptionLabel(formDataList.yesNoNa, formData.containsPlastic),
                    Isthisitemdesignedtobereused: getOptionLabel(formDataList.yesNoNa, formData.designedToBeReused),
                    containrecycledmaterial: getOptionLabel(formDataList.yesNoNa, formData.recycledMaterial),
                    containrecycledplastic: getOptionLabel(formDataList.yesNoNa, formData.containsRecycledPlastic),
                    Weightageofrecycledmaterial: formData.recycledMaterialWeightKg,
                    //CompetetiveWinningSupplier

                    // Catalogue Section
                    RateCard: getOptionLabel(formDataList.tcoYesOrNo, formData.ratecardCatalogueItemDeclined),
                    PromoOSSOrderWindows: getOptionLabel(formDataList.globalOrder, formData.globalOrderWindowCatalogueName),
                    Regionalname: getOptionLabel(formDataList.regionalOrder, formData.regionalOrderWindowCatalogue),
                    CatalogueUsage: getOptionLabel(formDataList.localCatalog, formData.localCatalogueName),
                    Eauction: getOptionLabel(formDataList.yesOrNo, formData.eAuction),
                    printingmethod: getOptionLabel(formDataList.printingMethod, formData.printingMethod),
                    typeofitem: formData.typeOfItem == "" ? "N/A" : getOptionLabel(formDataList.typeOfItem, formData.typeOfItem),
                    Noofmaterials: formData.noOfMaterials,
                    DigitalInnovation: getOptionLabel(formDataList.yesNoNa, formData.digitalInnovation),
                    Innovation: getOptionLabel(formDataList.yesNoNa, formData.innovation),
                    Sourcinglocation: getOptionLabel(formDataList.sourcingLocation, formData.sourcingLocation),
                    savingstype: getOptionLabel(formDataList.savingsType, formData.savingsType),
                    savingsreason: getOptionLabel(formDataList.savingsReason, formData.savingsReason),
                    OWlink: getOptionLabel(formDataList.yesNoNa, formData.owWithLink),
                    CompetetiveWinningSupplier: formData.competitiveBiddingWinningSupplierCost,
                    // Specifications
                    Version: formData.noOfVersion,
                    SpecNote: formData.specifications,
                    SNote: formData.notesComments,
                    // Quantity
                    QuoteType: getOptionLabel(formDataList.quoteType, formData.quantityType),
                    QuoteTypeindex: formData.quantityType,
                    QuoteQtyOrSize: formData.quantity,
                    FlatSizeLength: formData.length,
                    FlatSizeWidth: formData.width,
                    FlatSizeDandH: formData.depth,
                    ModifiedBy: parseInt(localStorage.getItem("agancyUserID")),
                };
                const response = await PostApi(LineItems_API.AddUpdateLineItems, payload);
                if (isSuccess(response)) {
                    setAllowRedirect(true);
                    const route = flag === true ? labelRoutes.suppliers : flag === false ? labelRoutes.LineItems : labelRoutes.eqDashboard;
                    toast(Labels.status.success, response.data.message);
                    setTimeout(() => {
                        navigate(route, {
                            state: { id: response.data.enqId }
                        });
                    }, 500);
                    if (!flag) {
                        await handleCancel();
                        await fetchData();
                    };
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        name: ""
                    }));
                    toast(Labels.status.failure, response.data.message);
                }
            } catch (error) {
                toast(Labels.status.failure, Labels.message.somethingWentWrong);
            } finally {
                setLoading(false);
            }
        }
        else {
            setAllowRedirect(false);
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            // navigate(labelRoutes.enquiryDetails, {
            //     state: { id: id }
            // });
        } else {
            navigate(labelRoutes.home); // fallback route
        }
    };

    const LineItemsValidation = () => {
        const requiredFields = [
            Labels.lineItems.category,
            Labels.lineItems.typeOfJob,
            Labels.lineItems.rateCard,
            Labels.lineItems.competitiveBiddingMandatory,
            Labels.lineItems.competitiveBiddingCompliant,
            Labels.lineItems.competitiveBiddingExceptionFormSigned,
            Labels.lineItems.exceptionsReasonCode,
            Labels.lineItems.itemCategory,
            Labels.lineItems.subCategory,
            //Labels.lineItems.simplex,
            Labels.lineItems.tcoApprovalRequired,
            Labels.lineItems.tcoApproved,
            Labels.lineItems.dictatedJob,
            Labels.lineItems.itemType,
            Labels.lineItems.itemName,
            Labels.lineItems.itemNameDescription,

            // Sustainability Information
            Labels.lineItems.fscOrPefcMaterial,
            Labels.lineItems.taxCertification,
            Labels.lineItems.recyclable,
            Labels.lineItems.sustainabilityOption,
            Labels.lineItems.recycledMaterial,
            Labels.lineItems.designedToBeReused,
            Labels.lineItems.containsPlastic,
            Labels.lineItems.containsRecycledPlastic,
            ...(formData.recycledMaterial == 1 ? [Labels.lineItems.recycledMaterialWeightKg] : []),

            // Catalogue Section
            Labels.lineItems.ratecardCatalogueItemDeclined,
            Labels.lineItems.globalOrderWindowCatalogueName,
            Labels.lineItems.regionalOrderWindowCatalogue,
            Labels.lineItems.localCatalogueName,
            Labels.lineItems.eAuction,
            Labels.lineItems.printingMethod,
            Labels.lineItems.typeOfItem,
            Labels.lineItems.noOfMaterials,
            Labels.lineItems.harmonizedOrder,
            Labels.lineItems.digitalInnovation,
            Labels.lineItems.innovation,
            Labels.lineItems.sourcingLocation,
            Labels.lineItems.savingsType,
            Labels.lineItems.savingsReason,
            Labels.lineItems.owWithLink,

            // Specifications
            Labels.lineItems.noOfVersion,
            Labels.lineItems.specifications,

            // Quantity
            Labels.lineItems.quantityType,
            Labels.lineItems.quantity,
        ];

        const optionFields = [
            { field: Labels.lineItems.length, visible: [2, 3] },
            { field: Labels.lineItems.width, visible: [2, 3] },
            { field: Labels.lineItems.depth, visible: [3] },
            { field: Labels.lineItems.incoterm, visible: [3] },
        ];

        let newErrors = {};

        requiredFields.forEach((field) => {
            if (field === Labels.lineItems.typeOfItem) {
                const value = getSelectedValue(formDataList.typeOfItem, formData.typeOfItem);
                if (value === undefined) {
                    newErrors[field] = Labels.commonLabel.required;
                }
            } else {
                if (!formData[field]) {
                    newErrors[field] = Labels.commonLabel.required;
                }
            }
        });

        optionFields.forEach(({ field, visible }) => {
            const isVisible = visible.includes(type); // type is your current selection
            if (isVisible && !formData[field]) {
                newErrors[field] = Labels.commonLabel.required;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleExitDraft = () => {
        setOpen(true);
    };

    const handlePreview = (index) => {
        setCurrentIndex(index);
        setPreviewOpen(true);
    };

    const handleCancel = () => {
        setFormData((prev) => ({
            ...prev,
            category: "",
            typeOfJob: "",
            competitiveBiddingMandatory: "",
            competitiveBiddingCompliant: "",
            competitiveBiddingExceptionFormSigned: "",
            exceptionsReasonCode: "",
            itemCategory: "",
            subCategory: "",
            simplex: "",
            tcoApprovalRequired: "",
            tcoApproved: "",
            dictatedJob: "",
            itemType: "",
            itemName: "",
            itemNameDescription: "",

            fscOrPefcMaterial: "",
            taxCertification: "",
            recyclable: "",
            sustainabilityOption: "",
            recycledMaterial: "",
            designedToBeReused: "",
            containsPlastic: "",
            containsRecycledPlastic: "",
            recycledMaterialWeightKg: "",

            // Catalogue Section
            ratecardCatalogueItemDeclined: "",
            globalOrderWindowCatalogueName: "",
            regionalOrderWindowCatalogue: "",
            localCatalogueName: "",
            competitiveBiddingWinningSupplierCost: "",
            printingMethod: "",
            harmonizedOrder: 2,
            typeOfItem: "",
            noOfMaterials: "",
            sourcingLocation: "",
            savingsType: "",
            savingsReason: "",

            // Specifications
            specifications: "",
            notesComments: "",

            // Quantity
            quantityType: "",
            quantity: "",
            length: "",
            width: "",
            depth: "",
            files: []
        }))
    }

    //hybird functionality
    const hybird = formDataList?.enquiryDetails?.hybridModel === "No" && lineItems?.length > 0;
    const category = hybird && lineItems?.length > 0 ? formDataList.lineItems[0].printornonprint
        : getOptionLabel(formDataList.category, formData.category);

    useEffect(() => {
        if (hybird && lineItems.length > 0) {
            LineItemsMaster(category);
            SavingsReasonMaster(formDataList.lineItems[0].savingstype, true);
        }
    }, [hybird, lineItems.length]);

    return (
        <>
            <Box sx={{ px: 3, py: 3 }}>
                <PGrid container className={Labels.margin.mb4} >
                    <PStepper steps={enquirySteps} activeStep={2} allowRedirect={allowRedirect}></PStepper>
                </PGrid>
                <PGrid container className={Labels.margin.mb4} >
                    <PGrid item xs={12} sm={12} md={9}>
                        <PCard>
                            {/* Line Items */}
                            <PGrid container className={Labels.margin.mb4}>
                                <PTypography
                                    labelText={getLabel("lbl22")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={getLabel("lbl59")}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />
                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl154")} ${Labels.symbols.required}`}
                                        value={formData.category}
                                        onChange={handleChange}
                                        helperText={errors?.category}
                                        name={Labels.lineItems.category}
                                        options={formDataList.category}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl61")} ${Labels.symbols.required}`}
                                        value={formData.itemCategory}
                                        onChange={handleChange}
                                        helperText={errors?.itemCategory}
                                        name={Labels.lineItems.itemCategory}
                                        options={formDataList.itemCategory}
                                        flag={Labels.flag.auto}

                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl156")} ${Labels.symbols.required}`}
                                        value={formData.typeOfJob}
                                        onChange={handleChange}
                                        helperText={errors?.typeOfJob}
                                        name={Labels.lineItems.typeOfJob}
                                        options={formDataList.typeOfJob}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid>
                            </PGrid>
                            {/* <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl96")} ${Labels.symbols.required}`}
                                        value={formData.competitiveBiddingMandatory}
                                        onChange={handleChange}
                                        helperText={errors?.competitiveBiddingMandatory}
                                        name={Labels.lineItems.competitiveBiddingMandatory}
                                        options={formDataList.yesOrNoNot}

                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl97")} ${Labels.symbols.required}`}
                                        value={formData.competitiveBiddingCompliant}
                                        onChange={handleChange}
                                        helperText={errors?.competitiveBiddingCompliant}
                                        name={Labels.lineItems.competitiveBiddingCompliant}
                                        options={formDataList.yesOrNoNot}
                                    />

                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl98")} ${Labels.symbols.required}`}
                                        value={formData.competitiveBiddingExceptionFormSigned}
                                        onChange={handleChange}
                                        helperText={errors?.competitiveBiddingExceptionFormSigned}
                                        name={Labels.lineItems.competitiveBiddingExceptionFormSigned}
                                        options={formDataList.competitiveBiddingExceptionFormSigned}
                                        flag={Labels.flag.auto}

                                    />

                                </PGrid>
                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl99")} ${Labels.symbols.required}`}
                                        value={formData.exceptionsReasonCode}
                                        onChange={handleChange}
                                        helperText={errors?.exceptionsReasonCode}
                                        name={Labels.lineItems.exceptionsReasonCode}
                                        options={formDataList.exceptionsReasonCode}
                                        flag={Labels.flag.auto}

                                    />
                                </PGrid>
                               
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl100")} ${Labels.symbols.required}`}
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        helperText={errors?.subCategory}
                                        name={Labels.lineItems.subCategory}
                                        options={formDataList.subCategory}
                                        flag={Labels.flag.auto}

                                    />
                                </PGrid>
                            </PGrid> */}
                            <PGrid container className={Labels.margin.mb4}>
                                {/* <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl101")} ${Labels.symbols.required}`}
                                        value={formData.simplex}
                                        onChange={handleChange}
                                        helperText={errors?.simplex}
                                        name={Labels.lineItems.simplex}
                                        options={formDataList.simplex}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid> */}
                                {/* <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl102")} ${Labels.symbols.required}`}
                                        value={formData.tcoApprovalRequired}
                                        onChange={handleChange}
                                        helperText={errors?.tcoApprovalRequired}
                                        name={Labels.lineItems.tcoApprovalRequired}
                                        options={formDataList.tcoYesOrNo}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl103")} ${Labels.symbols.required}`}
                                        value={formData.tcoApproved}
                                        onChange={handleChange}
                                        helperText={errors?.tcoApproved}
                                        name={Labels.lineItems.tcoApproved}
                                        options={formDataList.tcoYesOrNo}
                                    />
                                </PGrid> */}
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl63")} ${Labels.symbols.required}`}
                                        value={formData.dictatedJob}
                                        onChange={handleChange}
                                        helperText={errors?.dictatedJob}
                                        name={Labels.lineItems.dictatedJob}
                                        options={formDataList.yesOrNo}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl64")} ${Labels.symbols.required}`}
                                        value={formData.itemType}
                                        onChange={handleChange}
                                        helperText={errors?.itemType}
                                        name={Labels.lineItems.itemType}
                                        options={formDataList.itemType}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl157")} ${Labels.symbols.required}`}
                                        value={formData.itemType}
                                        onChange={handleChange}
                                        helperText={errors?.itemType}
                                        name={Labels.lineItems.itemType}
                                        options={formDataList.itemType}
                                        flag={Labels.flag.auto}
                                    />
                                </PGrid>
                            </PGrid>

                            <PGrid container >
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl65")} ${Labels.symbols.required}`}
                                        value={formData.rateCard}
                                        onChange={handleChange}
                                        helperText={errors?.rateCard}
                                        name={Labels.lineItems.rateCard}
                                        options={formDataList.yesOrNo}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PTextField
                                        label={`${getLabel("lbl66")} ${Labels.symbols.required}`}
                                        value={formData.itemName}
                                        onChange={handleChange}
                                        helperText={errors?.itemName}
                                        name={Labels.lineItems.itemName}
                                    />

                                </PGrid>
                                {[3].includes(formData.category) && (
                                    <PGrid item xs={12} sm={6} md={4}>
                                        <PDropdown
                                            label={`${getLabel("lbl152")} ${Labels.symbols.required}`}
                                            value={formData.incoterm}
                                            onChange={handleChange}
                                            helperText={errors?.incoterm}
                                            name={Labels.lineItems.incoterm}
                                            options={formDataList.incoterm}
                                        />
                                    </PGrid>
                                )}

                            </PGrid>

                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={8}>
                                    <PTextField
                                        label={`${getLabel("lbl67")} ${Labels.symbols.required}`}
                                        value={formData.itemNameDescription}
                                        onChange={handleChange}
                                        helperText={errors?.itemNameDescription}
                                        name={Labels.lineItems.itemNameDescription}
                                        multiline={true}
                                        rows={3.5}
                                    />
                                </PGrid>
                            </PGrid>


                            {/* Sustainability Information */}
                            <hr className="my-4" />
                            <PGrid container className={Labels.margin.mb4}>
                                <PTypography
                                    labelText={getLabel("lbl68")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={getLabel("lbl69")}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />

                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl70")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.fscOrPefcMaterial}
                                        onChange={handleChange}
                                        helperText={errors?.fscOrPefcMaterial}
                                        name={Labels.lineItems.fscOrPefcMaterial}
                                        options={formDataList.yesNoNa}
                                        readOnly={formData.category == 3 ? true : false}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl151")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.taxCertification}
                                        onChange={handleChange}
                                        helperText={errors?.taxCertification}
                                        name={Labels.lineItems.taxCertification}
                                        options={formDataList.yesNoNa}
                                        readOnly={formData.category == 3 ? false : true}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl71")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.recyclable}
                                        onChange={handleChange}
                                        helperText={errors?.recyclable}
                                        name={Labels.lineItems.recyclable}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>

                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl75")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.containsPlastic}
                                        onChange={handleChange}
                                        helperText={errors?.containsPlastic}
                                        name={Labels.lineItems.containsPlastic}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>

                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl72")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.sustainabilityOption}
                                        onChange={handleChange}
                                        helperText={errors?.sustainabilityOption}
                                        name={Labels.lineItems.sustainabilityOption}
                                        options={formDataList.soYesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl73")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.recycledMaterial}
                                        onChange={handleChange}
                                        helperText={errors?.recycledMaterial}
                                        name={Labels.lineItems.recycledMaterial}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>



                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl76")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.containsRecycledPlastic}
                                        onChange={handleChange}
                                        helperText={errors?.containsRecycledPlastic}
                                        name={Labels.lineItems.containsRecycledPlastic}
                                        options={formDataList.yesNoNa}
                                        readOnly={formData.recycledMaterial == 1 ? false : true}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PTextField
                                        label={`${getLabel("lbl79")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.recycledMaterial == 1 ? formData.recycledMaterialWeightKg : ""}
                                        onChange={handleChange}
                                        helperText={formData.recycledMaterial == 1 ? errors?.recycledMaterialWeightKg : ""}
                                        name={Labels.lineItems.recycledMaterialWeightKg}
                                        disabled={formData.recycledMaterial == 1 ? false : true}

                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl74")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.designedToBeReused}
                                        onChange={handleChange}
                                        helperText={errors?.designedToBeReused}
                                        name={Labels.lineItems.designedToBeReused}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>
                            </PGrid>

                            {/* Catalogue & Sourcing Information */}
                            <hr className="my-4" />
                            <PGrid container className={Labels.margin.mb4}>
                                <PTypography
                                    labelText={getLabel("lbl104")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={getLabel("lbl105")}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />

                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl111")} ${Labels.symbols.required}`}
                                        value={formData.printingMethod}
                                        onChange={handleChange}
                                        helperText={errors?.printingMethod}
                                        name={Labels.lineItems.printingMethod}
                                        options={formDataList.printingMethod}
                                        flag={Labels.flag.auto}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl81")} ${Labels.symbols.required}`}
                                        value={formData.localCatalogueName}
                                        onChange={handleChange}
                                        helperText={errors?.localCatalogueName}
                                        name={Labels.lineItems.localCatalogueName}
                                        options={formDataList.localCatalog}
                                        flag={Labels.flag.auto}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl158")} ${Labels.symbols.required} ${Labels.symbols.optional}`}
                                        value={formData.innovation}
                                        onChange={handleChange}
                                        helperText={errors?.innovation}
                                        name={Labels.lineItems.innovation}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>
                                {/* <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl106")} ${Labels.symbols.required}`}
                                        value={formData.ratecardCatalogueItemDeclined}
                                        onChange={handleChange}
                                        helperText={errors?.ratecardCatalogueItemDeclined}
                                        name={Labels.lineItems.ratecardCatalogueItemDeclined}
                                        options={formDataList.tcoYesOrNo}

                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl110")} ${Labels.symbols.required}`}
                                        value={formData.eAuction}
                                        onChange={handleChange}
                                        helperText={errors?.eAuction}
                                        name={Labels.lineItems.eAuction}
                                        options={formDataList.yesOrNo}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl107")} ${Labels.symbols.required}`}
                                        value={formData.globalOrderWindowCatalogueName}
                                        onChange={handleChange}
                                        helperText={errors?.globalOrderWindowCatalogueName}
                                        name={Labels.lineItems.globalOrderWindowCatalogueName}
                                        options={formDataList.globalOrder}
                                        flag={Labels.flag.auto}
                                        disabled={true}
                                    />
                                </PGrid> */}
                            </PGrid>
                            {/* <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl108")} ${Labels.symbols.required}`}
                                        value={formData.regionalOrderWindowCatalogue}
                                        onChange={handleChange}
                                        helperText={errors?.regionalOrderWindowCatalogue}
                                        name={Labels.lineItems.regionalOrderWindowCatalogue}
                                        options={formDataList.regionalOrder}
                                        flag={Labels.flag.auto}
                                        disabled={true}
                                    />
                                </PGrid> 
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl111")} ${Labels.symbols.required}`}
                                        value={formData.printingMethod}
                                        onChange={handleChange}
                                        helperText={errors?.printingMethod}
                                        name={Labels.lineItems.printingMethod}
                                        options={formDataList.printingMethod}
                                        flag={Labels.flag.auto}
                                        disabled={true}
                                    />
                                </PGrid>
                                
                                
                            </PGrid> */}
                            {/* <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl112")} ${Labels.symbols.required}`}
                                        value={formData.typeOfItem}
                                        onChange={handleChange}
                                        helperText={errors?.typeOfItem}
                                        name={Labels.lineItems.typeOfItem}
                                        options={formDataList.typeOfItem}
                                        flag={Labels.flag.auto}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PTextField
                                        label={`${getLabel("lbl113")} ${Labels.symbols.required}`}
                                        value={formData.noOfMaterials}
                                        onChange={handleChange}
                                        helperText={errors?.noOfMaterials}
                                        name={Labels.lineItems.noOfMaterials}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl159")} ${Labels.symbols.required}`}
                                        value={formData.harmonizedOrder}
                                        onChange={handleChange}
                                        helperText={errors?.harmonizedOrder}
                                        name={Labels.lineItems.harmonizedOrder}
                                        options={formDataList.yesOrNo}
                                        disabled={true}
                                        readOnly={formData.harmonizedOrder == 1 ? true : false}
                                    />
                                </PGrid>
                            </PGrid> */}
                            {/* <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl114")} ${Labels.symbols.required}`}
                                        value={formData.digitalInnovation}
                                        onChange={handleChange}
                                        helperText={errors?.digitalInnovation}
                                        name={Labels.lineItems.digitalInnovation}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl115")} ${Labels.symbols.required}`}
                                        value={formData.innovation}
                                        onChange={handleChange}
                                        helperText={errors?.innovation}
                                        name={Labels.lineItems.innovation}
                                        options={formDataList.yesNoNa}
                                        disabled={true}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl116")} ${Labels.symbols.required}`}
                                        value={formData.sourcingLocation}
                                        onChange={handleChange}
                                        helperText={errors?.sourcingLocation}
                                        name={Labels.lineItems.sourcingLocation}
                                        options={formDataList.sourcingLocation}
                                        flag={Labels.flag.auto}

                                    />
                                </PGrid>
                            </PGrid> */}
                            {/* <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl117")} ${Labels.symbols.required}`}
                                        value={formData.savingsType}
                                        onChange={handleChange}
                                        helperText={errors?.savingsType}
                                        name={Labels.lineItems.savingsType}
                                        options={formDataList.savingsType}
                                        flag={Labels.flag.auto}
                                        readOnly={hybird}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl118")} ${Labels.symbols.required}`}
                                        value={formData.savingsReason}
                                        onChange={handleChange}
                                        helperText={errors?.savingsReason}
                                        name={Labels.lineItems.savingsReason}
                                        options={formDataList.savingsReason}
                                        flag={Labels.flag.auto}
                                        readOnly={hybird}

                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl119")} ${Labels.symbols.required}`}
                                        value={formData.owWithLink}
                                        onChange={handleChange}
                                        helperText={errors?.owWithLink}
                                        name={Labels.lineItems.owWithLink}
                                        options={formDataList.yesOrNo}
                                        disabled={true}
                                    />
                                </PGrid>
                                {["Not Applicable"].includes(formData.eAuction) && (
                                    <PGrid item xs={12} sm={6} md={4}>
                                        <PTextField
                                            label={`${getLabel("lbl152")}`}
                                            value={formData.competitiveBiddingWinningSupplierCost}
                                            onChange={handleChange}
                                            //helperText={errors?.competitiveBiddingWinningSupplierCost}
                                            name={Labels.lineItems.competitiveBiddingWinningSupplierCost}
                                        />
                                    </PGrid>
                                )}
                            </PGrid> */}


                            {/* Spacifications */}
                            <hr className="my-4" />
                            <PGrid container className={Labels.margin.mb4}>
                                <PTypography
                                    labelText={getLabel("lbl83")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={getLabel("lbl84")}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />

                            </PGrid>
                            <PGrid container>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTextField
                                        label={`${getLabel("lbl85")} ${Labels.symbols.required}`}
                                        value={formData.noOfVersion}
                                        onChange={handleChange}
                                        helperText={errors?.noOfVersion}
                                        name={Labels.lineItems.noOfVersion}
                                    />
                                </PGrid>

                            </PGrid>
                            <PGrid container className={Labels.margin.mb3}>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTextField
                                        label={`${getLabel("lbl83")} ${Labels.symbols.required}`}
                                        value={formData.specifications}
                                        onChange={handleChange}
                                        helperText={errors?.specifications}
                                        name={Labels.lineItems.specifications}
                                        multiline={true}
                                        rows={4.5}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={6}>
                                    <PTextField
                                        label={`${getLabel("lbl86")}`}
                                        value={formData.notesComments}
                                        onChange={handleChange}
                                        //helperText={errors?.notesComments}
                                        name={Labels.lineItems.notesComments}
                                        multiline={true}
                                        rows={4.5}
                                    />
                                </PGrid>
                            </PGrid>

                            {/* Quantity */}
                            <hr className="my-4" />
                            <PGrid container className={Labels.margin.mb4}>
                                <PTypography
                                    labelText={getLabel("lbl87")}
                                    flag={Labels.fontFlags.subHeader}
                                    color={CommonColors.blue.main}
                                    weight={FontWeight.bold}
                                />
                                <PTypography
                                    labelText={getLabel("lbl88")}
                                    flag={Labels.fontFlags.smallText}
                                    color={CommonColors.grey.main}
                                    weight={FontWeight.bold}
                                />

                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                <PGrid item xs={12} sm={12} md={4}>
                                    <PDropdown
                                        label={`${getLabel("lbl89")} ${Labels.symbols.required}`}
                                        value={formData.quantityType}
                                        onChange={handleChange}
                                        helperText={errors?.quantityType}
                                        name={Labels.lineItems.quantityType}
                                        options={formDataList.quoteType}

                                    />
                                </PGrid>
                                {[1, 2, 3].includes(type) && (
                                    <PGrid item xs={12} sm={6} md={4}>
                                        <PTextField
                                            label={`${getLabel("lbl87")} ${Labels.symbols.required}`}
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            helperText={errors?.quantity}
                                            name={Labels.lineItems.quantity}
                                        />
                                    </PGrid>
                                )}
                                {[2, 3].includes(type) && (
                                    <PGrid item xs={12} sm={6} md={4}>
                                        <PTextField
                                            label={`${getLabel("lbl141")} ${Labels.symbols.required}`}
                                            value={formData.length}
                                            onChange={handleChange}
                                            helperText={errors?.length}
                                            name={Labels.lineItems.length}
                                        />
                                    </PGrid>
                                )}
                            </PGrid>
                            <PGrid container className={Labels.margin.mb4}>
                                {[2, 3].includes(type) && (
                                    <PGrid item xs={12} sm={6} md={4}>
                                        <PTextField
                                            label={`${getLabel("lbl142")}  ${Labels.symbols.required}`}
                                            value={formData.width}
                                            onChange={handleChange}
                                            helperText={errors?.width}
                                            name={Labels.lineItems.width}
                                        />
                                    </PGrid>
                                )}
                                {type === 3 && (
                                    <PGrid item xs={12} sm={6} md={4}>
                                        <PTextField
                                            label={`${getLabel("lbl143")}  ${Labels.symbols.required}`}
                                            value={formData.depth}
                                            onChange={handleChange}
                                            helperText={errors?.depth}
                                            name={Labels.lineItems.depth}
                                        />
                                    </PGrid>
                                )}
                            </PGrid>
                            {[2, 3].includes(type) && (
                                <PGrid container className={Labels.margin.mb3}>
                                    <PGrid item xs={12} sm={12} md={4}>
                                        <PTypography
                                            labelText={type == 2 ? getLabel("lbl144") : getLabel("lbl145")}
                                            weight={FontWeight.bold}
                                        />
                                        <PTypography
                                            labelText={flatSize}
                                            color={CommonColors.grey.main}
                                            weight={FontWeight.bold}
                                        />
                                    </PGrid>
                                    <PGrid item xs={12} sm={12} md={4}>
                                        <PTypography
                                            labelText={type == 2 ? getLabel("lbl146") : getLabel("lbl147")}
                                            weight={FontWeight.bold}
                                        />
                                        <PTypography
                                            labelText={totalSize}
                                            color={CommonColors.grey.main}
                                            weight={FontWeight.bold}
                                        />
                                    </PGrid>
                                </PGrid>
                            )}
                            {/* Attachment Section */}
                            {[1, 2, 3].includes(type) && (
                                <>
                                    {/* Row with file input + button */}
                                    <PGrid container className={Labels.margin.mb4}>
                                        <PGrid item xs={12} sm={12} md={6}>
                                            <PFileUpload
                                                value={formData.files}
                                                onChange={handleChange}
                                                name={Labels.lineItems.files}
                                                //type={Labels.flag.file}
                                                multiple={true}
                                                maxLength={5}
                                            />
                                            <PTypography
                                                labelText={"You may attach up to 5 files of no more than 20mb each.."}
                                                flag={Labels.fontFlags.smallText}
                                                color={CommonColors.grey.main}
                                                weight={FontWeight.bold}
                                            />
                                            <PTypography
                                                labelText={"Type: .pdf .png .jpg .jpeg .doc .docx .ppt .pptx .xls .xlsx"}
                                                flag={Labels.fontFlags.smallText}
                                                color={CommonColors.grey.main}
                                                weight={FontWeight.bold}
                                            />

                                        </PGrid>

                                        <PGrid item xs={12} sm={12} md={6} className="d-flex justify-content-end gap-2 mb-1">
                                            <PButton
                                                label={getLabel("lbl128")}
                                                variant="outlined"
                                                onClick={(e) => handleSubmit(e, false)}
                                                width={180}
                                                height={50}
                                                color={CommonColors.blue.main}
                                            />
                                        </PGrid>
                                    </PGrid>

                                    {formData.files?.length > 0 && (
                                        <PGrid container>
                                            {formData.files.map((file, index) => (
                                                <PGrid item xs={12} sm={6} key={index} className={Labels.margin.mb2}>
                                                    <PAttachment
                                                        key={index}
                                                        file={file}
                                                        onPreview={() => handlePreview(index)}
                                                        onDelete={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                files: prev.files.filter((_, i) => i !== index),
                                                            }))
                                                        }
                                                    />
                                                </PGrid>
                                            ))}
                                        </PGrid>
                                    )}

                                    <PreviewDialog
                                        open={previewOpen}
                                        onClose={() => setPreviewOpen(false)}
                                        files={formData.files}
                                        currentIndex={currentIndex}
                                        setCurrentIndex={setCurrentIndex}
                                    />
                                </>
                            )}

                            {/* Button Section */}
                            <hr className="my-4" />
                            <PGrid container className="d-flex align-items-center justify-content-between">
                                <PGrid item xs={12} sm={6} md={8}>
                                    <PButton
                                        label={getLabel("lbl37")}
                                        variant="outlined"
                                        onClick={(e) => handleExitDraft(e)}
                                        width={180}
                                    />
                                </PGrid>
                                <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end gap-2">
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
                        <PSummary sections={sections} currentStep={3} refreshSummary={fetchData} duplicate={true} lineItems={formDataList.lineItems} />
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

export default LineItems;