import PCard from "../../component/PCard/PCard";
import PGrid from "../../component/PGrid/PGrid";
import PTypography from "../../component/PTypography/PTypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import PDropdown from "../../component/PDropdown/PDropdown";
import React, { useState, useEffect } from "react";
import PDatepicker from "../../component/PDatepicker/PDatepicker";
import PButton from "../../component/PButton/PButton";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useLanguage } from "../../utils/constants/language";
const Report = () => {
    const { getLabel } = useLanguage();
    const [formData, setFormData] = useState({
        clientName: "",
        typeofReport: "",
        country: "",
        jobstatus: "",
        fromDate: "",
        toDate: ""

    });
    const [formDataList, setFormDataList] = useState({
        clientName: [],
        typeofReport: [{ label: "Enquries", value: 1 }, { label: "Ebidding", value: 2 }, { label: "Ecatalogue", value: 3 }],
        country: [],
        jobstatus: [],
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };
    return (
        <>
            {/* <PGrid container className="text-center">
                <PTypography
                    labelText={"Report"}
                    flag={Labels.fontFlags.mainHeader}
                    color={CommonColors.grey.main}
                    weight={FontWeight.bold}
                />
            </PGrid> 
            <hr className="mt-3" />*/}

            <PGrid container className={Labels.margin.mb4} >
                <PGrid item xs={12} sm={12} md={12} >
                    <PCard>
                        <PGrid container className={Labels.margin.mt4}>
                            <PGrid item xs={12} sm={6} md={4}>
                                <PDropdown
                                    name={"ClientName"}
                                    label={`${'ClientName'} ${Labels.symbols.required}`}
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    options={formDataList.clientName}
                                    width={100}

                                />
                            </PGrid>
                            <PGrid item xs={12} sm={6} md={4}>
                                <PDropdown
                                    name={"typeofReport"}
                                    label={`${"Type Of Report"} ${Labels.symbols.required}`}
                                    value={formData.typeofReport}
                                    onChange={handleChange}
                                    options={formDataList.typeofReport}
                                    width={100}
                                    //helperText={errors?.globalBUMapping}
                                    flag={Labels.flag.auto}
                                />
                            </PGrid>
                            <PGrid item xs={12} sm={6} md={4}>
                                <PDropdown
                                    name={"country"}
                                    label={`${getLabel("lbl09")} ${Labels.symbols.required}`}
                                    value={formData.country}
                                    onChange={handleChange}
                                    options={formDataList.country}
                                    width={100}
                                    //helperText={errors?.globalBUMapping}
                                    flag={Labels.flag.auto}
                                />
                            </PGrid>
                        </PGrid>
                        <PGrid container className={Labels.margin.mt4} >
                            <PGrid item xs={12} sm={6} md={4}>
                                <PDropdown
                                    name={"jobstatus"}
                                    label={`${'Job Status'} ${Labels.symbols.required}`}
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    options={formDataList.clientName}
                                    width={100}

                                />
                            </PGrid>
                            <PGrid item xs={12} sm={6} md={4}>
                                <PDatepicker
                                    name={"fromDate"}
                                    label={"From Date"}
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    width={100}
                                    //helperText={errors?.startDate}
                                    maxDate={formData.toDate}
                                />
                            </PGrid>
                            <PGrid item xs={12} sm={6} md={4}>
                                <PDatepicker
                                    name={"toDate"}
                                    label={"To Date"}
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    width={100}
                                    //helperText={errors?.endDate}
                                    minDate={formData.fromDate}
                                />
                            </PGrid>
                        </PGrid>

                        <hr className="my-4" />

                        <PGrid container className="d-flex align-items-center justify-content-between">

                            {/* Left Button */}
                            <PGrid item xs={12} sm={6} md={8}>

                            </PGrid>

                            {/* Right Buttons */}
                            <PGrid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                className="d-flex justify-content-end gap-2"
                            >
                                <PButton
                                    label={getLabel("lbl123")}
                                    variant="outlined"
                                    onClick={(e) => handleExitDraft(e)}
                                    width={180}
                                    startIcon={<RestartAltIcon />}
                                />
                                <PButton
                                    label={getLabel("lbl126")}
                                    variant="contained"
                                    color={CommonColors.green.main}
                                    onClick={(e) => handleSubmit(e, true)}
                                    width={180}
                                    startIcon={<FileDownloadIcon />}
                                />
                            </PGrid>

                        </PGrid>
                    </PCard>
                </PGrid>
            </PGrid>
        </>
    );
};

export default Report;