const getBaseUrl = () => {
  const host = window.location.hostname;
  switch (host) {
    case "localhost":
      return "/api"; // Vite proxy

    case "ebiz.pmgasia.com":
      return "https://ebiz.pmgasia.com/iWeb/virtualagency/vagit/api"; // UAT

    case "web.pmgasia.com":
      return "https://web.pmgasia.com/iWeb/virtualagency/vagit/api"; // Production

    default:
      return "https://ebiz.pmgasia.com/iWeb/virtualagency/vagit/api";
  }
};


export const Base_Url = getBaseUrl();
export const Account_API = {
  Login: Base_Url + "/VA/Usersignon",
}

export const Language_API = {
  Language: Base_Url + "/VA/Language",
}

export const Dashboard_API = {
  Dashboard: Base_Url + "/VA/Viewdashboard",
  Master: Base_Url + "/VA/MasterDropdowns",
  GetDetails: Base_Url + "/VA/GetDetails",
  EnqReview: Base_Url + "/VA/EnqReview",
}


export const ClientInfo_API = {
  AddUpdateClientInfo: Base_Url + "/VA/EnqClientinfo",
  ClientInfoMaster: Base_Url + "/VA/EnqClientinfoDropdowns",
  AddUpdateClientContant: Base_Url + "/VA/AddnewClient",
  AddUpdateBrand: Base_Url + "/VA/AddnewBrands",
  CheckforUsername: Base_Url + "/VA/CheckforUsername",
}

export const EnquiryDetails_API = {
  AddUpdateEnquiryDetails: Base_Url + "/VA/EnqProjectinfo",
  GetSlatemplateMaster: Base_Url + "/VA/GetSlatemplate",
}

export const LineItems_API = {
  AddUpdateLineItems: Base_Url + "/VA/EnqLineItemDetails",
  GetEnqLineItemsMaster: Base_Url + "/VA/EnqLineItemsDropdowns",
  GetEnqDuplicate: Base_Url + "/VA/EB_Duplicate"
}
export const Suppliers_API = {
  GetEnqSupplierMaster: Base_Url + "/VA/GetSupplier",
  AddUpdateSuppliers: Base_Url + "/VA/EnqSupplierInfo",
} 

export const ProjectEnquiry_API = {
  GetProjectDetails : Base_Url + "/VA/GetProjectDetails",
  PostSupplierQuotes : Base_Url + "/VA/PostSupplierQuotes",
  UpdateJobStatus : Base_Url + "/VA/UpdateJobStatus",
  CalculateSavings: Base_Url + "/VA/CalculateSavings",
  PostRefPrice : Base_Url + "/VA/PostRefprice",
  CheckDeliveryAddress : Base_Url + "/VA/CheckDeliveryAddress",
  AddUpdateDeliveryAddress : Base_Url + "/VA/AddUpdateDeliveryAddress",
  UpdateSavingsReasons : Base_Url + "/VA/UpdateSavingsReasons"
}


