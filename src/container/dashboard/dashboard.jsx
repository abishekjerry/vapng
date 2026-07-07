

import React from "react";
import {
  Box, Grid, Typography, Paper, Container,
  Avatar, Card, CardContent, Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { labelRoutes } from "../../navigations/labelRoutes";
import PGrid from "../../component/PGrid/PGrid";
import { Labels } from "../../utils/constants/labels";
import PDashboardCard from "../../component/PDashboardCard/PDashboardCard";
import PTypography from "../../component/PTypography/PTypography";
import { FontWeight } from "../../utils/constants/fonts";
import { useLanguage } from "../../utils/constants/language";


const Dashboard = () => {
  const navigate = useNavigate();
  const { getLabel } = useLanguage();
  const apps = [
    {
      title: getLabel("lbl03"),
      icon: <DescriptionIcon />,
      iconBg: "#6366f1",
      route: labelRoutes.eqDashboard,
      showNavIcon: true // override default
    },
    {
      title: getLabel("lbl04"),
      icon: <AccessTimeIcon />,
      iconBg: "#8b5cf6",
      route: null
    },
    {
      title: getLabel("lbl05"),
      icon: <MenuBookIcon />,
      iconBg: "#6366f1",
      route: null
    },
    {
      title: getLabel("lbl06"),
      icon: <BarChartIcon />,
      iconBg: "#4f46e5",
      route: labelRoutes.report,
      showNavIcon: true
    }
  ];

  // Default props to pass to PDashboardCard
  const defaultCardProps = {
    showNavIcon: false,
    iconBoxSize: 100,
    iconSize: 100,
    titleSize: 20
  };
  return (
    <>
      
        <Container>
          <PGrid container className="text-center mt-5">
            {/* Header */}
            <PGrid item className={Labels.margin.mb3}>
              <PTypography
                labelText= {getLabel("lbl02")}              
                flag={Labels.fontFlags.header}
                style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
                weight={FontWeight.bold}
              />
            </PGrid>
            {/* <PGrid item className="mb-3">
              <PTypography
                labelText={Labels.dashboard.agencyPortal}
                font={FontWeight.bold}
                flag={Labels.fontFlags.subHeader}
              />
            </PGrid> */}

            {/* Subheader */}
            {/* <PGrid item className="mb-3">
              <PTypography
                labelText={Labels.dashboard.toBeginPleaseChooseAnApplication}
                flag={Labels.fontFlags.errorLbl}
                font={FontWeight.medium}
              />
            </PGrid> */}
          </PGrid>
          <br/><br/><br/>
          <PGrid container className= {`${Labels.margin.mt4}${Labels.margin.mb4}`}>
            {apps.map((app, index) => (
              <PGrid
                key={index}
                item
                xs={12}  
                sm={3}  
                md={3}  
                lg={3}   
                className="mb-3" 
              >
                <PDashboardCard key={index} {...defaultCardProps} {...app} />
              </PGrid>
            ))}
          </PGrid>
        </Container>
        
    </>
    

  );
};

export default Dashboard;