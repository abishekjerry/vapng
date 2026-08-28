
export const getSummarySections = ({ menuId, clientInfo = [], enquiryDetails = [], lineItems = [], suppliers = [], getLabel, handleEdit }) => {
  const labels = {
    1: [getLabel("lbl21"), getLabel("lbl22")],
    2: ["Bid Details", "Bid Items"],
    3: ["Catalogue Details", "Catalogue Items"],
  };
  return [
    clientInfo.length > 0 && {
      step: 1,
      title: getLabel("lbl25"),
      items: clientInfo
    },

    enquiryDetails.length > 0 && {
      step: 2,
      title: labels[menuId][0],
      items: enquiryDetails
    },
    {
      step: 3,
      title: labels[menuId][1],
      items: lineItems
    },
    {
      step: 4,
      title: getLabel("lbl23"),
      items: suppliers
    }
  ].filter(Boolean);
};

export const getClientInfo = (fields = {}, formData = {}, formDataList = {}, getLabel, getOptionLabel, response = null, extraInfo = []) => {
  const source = response || formData;
  return [
    ...extraInfo,
    { label: getLabel("lbl27"), value: response ? source.divisionname : getOptionLabel(formDataList.division, source.division) },
    { label: getLabel("lbl28"), value: response ? source.client : fields.clientName },
    { label: getLabel("lbl09"), value: response ? source.country : fields.country },
    { label: getLabel("lbl29"), value: response ? source.entityname : fields.entityName },
    { label: getLabel("lbl30"), value: response ? source.bussinessUnit : fields.businessUnit },
    { label: getLabel("lbl31"), value: response ? source.departmentorproduct : fields.channel },
    // { label: getLabel("lbl91"), value: response ? source.globalBussinessUnit : getOptionLabel(formDataList.globalBUMapping, source.globalBUMapping) },
    // { label: getLabel("lbl92"), value: response ? source.aboveorAtmarket : getOptionLabel(formDataList.aboveAtMarket, source.aboveAtMarket) },
    { label: getLabel("lbl33"), value: response ? source.brand : getOptionLabel(formDataList.brand, source.brand) },
    { label: getLabel("lbl35"), value: response ? source.clientContact : getOptionLabel(formDataList.clientContact, source.clientContact) },
    { label: getLabel("lbl34"), value: response ? source.deliveryCountryname : getOptionLabel(formDataList.deliveryCountry, source.deliveryCountry) },
    { label: getLabel("lbl36"), value: response ? source.pmgEntityname : getOptionLabel(formDataList.pmgEntity, source.pmgEntity) }
  ];
};
export const getEnquiryDetails = (formData = {}, dynamicData = {}, formDataList = {}, getLabel, getOptionLabel, response = null, showFlag = true) => {
  return [
    { label: getLabel("lbl42"), value: `${response.projectNo || formData.projectNo || "-"}` },
    { label: getLabel("lbl43"), value: `${response.estdate || formData.estdeliveryDate || "-"}` },
    { label: getLabel("lbl44"), value: `${response.briefdate || formData.briefReceivedDate || "-"}` },
    { label: getLabel("lbl45"), value: `${response.projectDesc || formData.projectDescription || "-"}` },
    { label: getLabel("lbl46"), value: `${response.projectQuotetype || getOptionLabel(formDataList.quoteType, formData.projectQuoteType) || "-"}` },
    { label: getLabel("lbl47"), value: `${response.year || getOptionLabel(formDataList.year, formData.year) || "-"}` },
    { label: getLabel("lbl93"), value: `${response.managementFeetype || getOptionLabel(formDataList.managementFeeType, formData.managementFeeType) || "-"}` },
    //{ label: getLabel("lbl94"), value: `${response.hybridModel || getOptionLabel(formDataList.hybird, formData.hybrid) || "-"}` },
    //{ label: getLabel("lbl95"), value: `${response.attribute || getOptionLabel(formDataList.projectAttribute, formData.projectAttribute) || "-"}` },
    { label: getLabel("lbl49"), value: `${response?.slaTemplatename || getOptionLabel(formDataList.slaTemplate, formData.slaTemplate) || "-"}` },
    ...(showFlag ? [
      { label: getLabel("lbl54"), value: `${response.quotestartdate || dynamicData?.quotestartdate || "-"} - ${response.quoteenddate || dynamicData?.quoteenddate || "-"}` },
      { label: getLabel("lbl55"), value: `${response.proofstartdate || dynamicData?.proofstartdate || "-"} - ${response.proofenddate || dynamicData?.proofenddate || "-"}` },
      { label: getLabel("lbl56"), value: `${response.productionstartdate || dynamicData?.productionstartdate || "-"} - ${response.productionenddate || dynamicData?.productionenddate || "-"}` },
      { label: getLabel("lbl57"), value: `${response.filecopiesstartdate || dynamicData?.filecopiesstartdate || "-"} - ${response.filecopiesenddate || dynamicData?.filecopiesenddate || "-"}` },
      { label: getLabel("lbl58"), value: `${response.invoicestartdate || dynamicData?.invoicestartdate || "-"} - ${response.invoiceenddate || dynamicData?.invoiceenddate || "-"}` }]
      : [])
  ];
};

export const getLineneItems = (formData = {}, formDataList = {}, getLabel, getOptionLabel, response = null) => {
  const lineItemMapping = [
    { formKey: "category", key: "printornonprint", label: "lbl154" },
    { formKey: "itemCategory", key: "productcategory", label: "lbl61" },
    { formKey: "urgentJob", key: "urgent", label: "lbl156" },
    { formKey: "dictatedJob", key: "dictated", label: "lbl63" },
    { formKey: "itemType", key: "itemtype", label: "lbl64" },
    { formKey: "reEngineering", key: "reengineering", label: "lbl157" },
    { formKey: "rateCard", key: "rateCard", label: "Rate Card" },
    { formKey: "incoterm", key: "incoterm", label: "lbl152" },
    { formKey: "itemName", key: "itemName", label: "lbl66" },
    { formKey: "itemNameDescription", key: "itemDescription", label: "lbl67" },

    { formKey: "fscOrPefcMaterial", key: "fscpefcmaterial", label: "lbl70" },
    { formKey: "recyclable", key: "designforrecycle", label: "lbl202" },
    { formKey: "sustainabilityOption", key: "proposedsustain", label: "lbl72" },
    { formKey: "containsPlastic", key: "containplasticNew", label: "lbl75" },
    { formKey: "designedToBeReused", key: "designreused", label: "lbl74" },
    { formKey: "recycledMaterial", key: "recycledmaterial", label: "lbl73" },
    { formKey: "containsRecycledPlastic", key: "recycledplasticNew", label: "lbl76" },
    { formKey: "plasticWeightKg", key: "plasticweightage", label: "lbl77" },
    { formKey: "recycledPlasticWeightKg", key: "recycledplasticweightage", label: "lbl78" },
    { formKey: "recycledMaterialWeightKg", key: "recycledmaterialweightage", label: "lbl79" },

    { formKey: "printingMethod", key: "printingMethod", label: "lbl111" },
    { formKey: "materialUsed", key: "materialUsed", label: "lbl201" },
    { formKey: "innovation", key: "innovation", label: "lbl158" },
    { formKey: "localCatalogueName", key: "catalogueUsage", label: "lbl81" },

    { formKey: "quantityType", key: "quoteType", label: "lbl89" },
    { formKey: "quantity", key: "quoteQtyOrSize", label: "lbl87" },
    { formKey: "noOfVersion", key: "version", label: "lbl85" },
    { formKey: "specifications", key: "specNote", label: "lbl83" },
    { formKey: "notesComments", key: "sNote", label: "lbl86" },
  ];
  const items = formDataList?.lineItems?.length ? formDataList.lineItems : response;
  const validItems = (items || []).filter(
    item => item?.itemNumber !== undefined && item?.itemNumber !== null
  );
  const lineItems = (validItems || []).map((item, index) => ({
    itemTitle: `Item ${item.itemNumber}`,
    itemColor: "warning",
    enquiryId: item.enqdetailsId,
    items: lineItemMapping.filter(field => field.key !== "incoterm" || item.printornonprint === "Promo")
      .map(field => ({
        label: field.label === "Attachment" ? field.label : getLabel(field.label),
        value: field.key ? item[field.key] ?? "-" : field.value,
        formKey: field.formKey
      }))
  }));
  return lineItems;
};


export const getSuppliers = (formData = [], response = null) => {
  const source = response || formData;
  return source.map(item => ({
    label: "",
    value: item.suppliername || "-"
  }));
};