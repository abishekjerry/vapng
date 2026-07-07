import React from "react";
import { useNavigate } from "react-router-dom";
import PGrid from "../PGrid/PGrid";
import PTypography from "../PTypography/PTypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import { FontWeight } from "../../utils/constants/fonts";
import { useLanguage } from "../../utils/constants/language";

export default function PStepper({ steps = [], activeStep = 0 , allowRedirect = false }) {
  const navigate = useNavigate();
  const { getLabel } = useLanguage();
   const handleRedirect = (step) => {
    if (step.url && allowRedirect) {
      navigate(step.url);
    }
  };

  return (
    <>
      <PGrid container className="text-center">
        <PTypography
          labelText={getLabel("lbl19")}
          flag={Labels.fontFlags.mainHeader}
          color={CommonColors.grey.main}
          weight={FontWeight.bold}
        />
      </PGrid>

      <hr className="mt-3" />

      <div className="p-stepper">
        {steps.map((step, index) => (
          <React.Fragment key={index}>

            <div
              className="p-step"
              onClick={() => handleRedirect(step)}
            >
              <div
                className={`p-circle ${index < activeStep
                  ? "completed"
                  : index === activeStep
                    ? "active"
                    : ""
                  }`}
              >
                {index + 1}
              </div>

              <div
                className={`p-label ${index <= activeStep ? "active" : ""
                  }`}
              >
                {step.text}
              </div>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`p-line ${index < activeStep ? "completed" : ""
                  }`}
              ></div>
            )}

          </React.Fragment>
        ))}
      </div>
      <style>{`

.p-stepper{
  display:flex;
  align-items:center;
  justify-content:space-between;
  max-width:700px;
  margin:auto;
  padding:10px 0;
}

.p-step{
  text-align:center;
  cursor:pointer;
}

.p-circle{
  width:36px;
  height:36px;
  border-radius:50%;
  border:2px solid #9CA3AF;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:600;
  color:#6B7280;
  margin:auto;
  transition:.3s;
}

.p-circle.completed{
  background:#EF4444;
  border-color:#EF4444;
  color:#fff;
}

.p-circle.active{
  border-color:#EF4444;
  color:#EF4444;
}

.p-label{
  margin-top:8px;
  font-size:14px;
  color:#6B7280;
}

.p-label.active{
  color:#EF4444;
  font-weight:600;
}

.p-line{
  flex:1;
  height:3px;
  background:#E5E7EB;
  margin:0 10px 25px;
  position:relative;
}

.p-line::after{
  content:"";
  position:absolute;
  left:0;
  top:0;
  height:100%;
  width:0%;
  background:#EF4444;
  transition:width .4s ease;
}

.p-line.completed::after{
  width:100%;
}

`}</style>
    </>
  );
}

