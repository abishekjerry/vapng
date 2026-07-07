

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import './index.css'
import store, { persistor } from "./redux/store/store"; // Import both store and persistor
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PToast from './component/PToast/PToast'
import { LanguageProvider } from "./utils/constants/language";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  //<BrowserRouter basename="/iweb/virtualagency/vatest">
   <BrowserRouter>    
    <Provider store={store}>
      <LanguageProvider>
        <PToast />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </LanguageProvider>
    </Provider>
  </BrowserRouter>
);