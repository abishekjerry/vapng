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
import PTable from "../PTable/PTable";
import PGrid from "../PGrid/PGrid";
import PTypography from "../PTypography/PTypography";
import PCard from "../PCard/PCard";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PButton from "../PButton/PButton";
import { useLanguage } from "../../utils/constants/language";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

const PSpotSection = () => {
    const { getLabel } = useLanguage();
    //const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({
        epdSpot: true,
        emmdSpot: true
    });
    const [formDataList, setFormDataList] = useState({
        data: [],
        packagingMaterial: [{ field: "materialUsed", header: "Material Used" }, { field: "packageMaterial", header: "Package Material" },
        { field: "typeMaterial", header: "Type Material" }, { field: "weight", header: "Weight" },
        { field: "unit", header: "Unit" }, { field: "action", header: "Action" }],

        mainMaterial: [{ field: "materialUsed", header: "Material Used" }, { field: "mainMaterial", header: "Main Material" },
        { field: "typeMaterial", header: "Type Material" }, { field: "weight", header: "Weight" },
        { field: "unit", header: "Unit" }, { field: "action", header: "Action" }],

        impactMaterial: [{ field: "itemNumber", header: "Item Number" }, { field: "type", header: "Type" },
        { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
        { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation" }],

        totalMaterial: [{ field: "itemNumber", header: "Item Number" }, { field: "itemName", header: "Item Name" },
        { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
        { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation" }],

        comparativeImpactMaterial: [{ field: "itemNumber", header: "Item Number" }, { field: "itemName", header: "Item Name" },
        { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
        { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation" }],

        enviromantalImpactMaterial: [{ field: "type", header: "Type" }, { field: "embodiedCarbon", header: "Embodied Carbon" }, { field: "waterUsage", header: "Water Usage" },
        { field: "totalEnergy", header: "Total Energy" }, { field: "wood", header: "Wood" }, { field: "explanation", header: "Explanation" }],

    });
    return (
        <>
            <PCard className={Labels.margin.mb3}>
                <PGrid container className={Labels.margin.mb1}>
                    <PGrid item xs={12} sm={6} md={6}>
                        <PTypography
                            labelText={`${getLabel("lbl191")} ( ${getLabel("lbl190")} )`}
                            flag={Labels.fontFlags.subHeader}
                            color={CommonColors.blue.main}
                            weight={FontWeight.bold}
                        />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl192")} ( ${getLabel("lbl190")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.subHeader}
                        />
                    </PGrid>

                    <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end align-items-center" >
                        <IconButton onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                epdSpot: !prev.epdSpot,
                            }))}
                        >
                            {formData.epdSpot ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <Collapse in={formData.epdSpot} timeout="auto" unmountOnExit>
                    <PGrid container className={Labels.margin.mb4}>
                        <PGrid item xs={12} sm={6} md={12}>
                            <PTable columns={formDataList.packagingMaterial} rows={formDataList.data} showPagination={false} />
                        </PGrid>
                    </PGrid>
                </Collapse>

                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl193")} ( ${getLabel("lbl190")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.subHeader}
                        />
                    </PGrid>

                    <PGrid item xs={12} sm={6} md={4} className="d-flex justify-content-end align-items-center">
                        <IconButton onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                emmdSpot: !prev.emmdSpot,
                            }))}
                        >
                            {formData.emmdSpot ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <Collapse in={formData.emmdSpot} timeout="auto" unmountOnExit>
                    <PGrid container className={Labels.margin.mb4}>
                        <PGrid item xs={12} sm={6} md={12}>
                            <PTable columns={formDataList.mainMaterial} rows={formDataList.data} showPagination={false} />
                        </PGrid>
                    </PGrid>
                </Collapse>
            </PCard>

            <PCard className={Labels.margin.mb3}>
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={6}>
                        <PTypography
                            labelText={`${getLabel("lbl194")} ( ${getLabel("lbl197")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.subHeader}
                        />
                    </PGrid>
                    <PGrid item xs={12} sm={6} md={6} className="d-flex justify-content-end gap-2">
                        <PButton
                            label={getLabel("lbl189")}
                            variant="contained"
                            color={CommonColors.grey.main}
                            //onClick={() => handleEdit(null, flag)}
                            width={180}
                        />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.impactMaterial} rows={formDataList.data} showPagination={false} />
                    </PGrid>
                </PGrid>

                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl195")} ( ${getLabel("lbl197")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.subHeader}
                        />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.comparativeImpactMaterial} rows={formDataList.data} showPagination={false} />
                    </PGrid>
                </PGrid>

                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl196")} ( ${getLabel("lbl197")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.subHeader}
                        />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.totalMaterial} rows={formDataList.data} showPagination={false} />
                    </PGrid>
                </PGrid>

                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={8}>
                        <PTypography
                            labelText={`${getLabel("lbl194")} ( ${getLabel("lbl198")} )`}
                            weight={FontWeight.bold}
                            flag={Labels.fontFlags.subHeader}
                        />
                    </PGrid>
                </PGrid>
                <Divider sx={{ mb: 2 }} />
                <PGrid container className={Labels.margin.mb4}>
                    <PGrid item xs={12} sm={6} md={12}>
                        <PTable columns={formDataList.enviromantalImpactMaterial} rows={formDataList.data} showPagination={false} />
                    </PGrid>
                </PGrid>
            </PCard>
        </>
    )
}

export default PSpotSection;