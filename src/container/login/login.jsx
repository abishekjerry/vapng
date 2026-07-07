import React, { useState, useEffect, useRef } from "react";
import PTypography from "../../component/PTypography/PTypography";
import PTextField from "../../component/PTextField/PTextField";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import PButton from "../../component/PButton/PButton";
import { Labels } from "../../utils/constants/labels";
import LoginImg from "../../utils/assets/images/Login.png";
import "./login.css";
import { CommonColors } from "../../utils/constants/colors";
import PContainer from "../../component/PContainer/PContainer";
import PDialog from "../../component/PDialog/PDialog";
import {
  allowOnlyAlphabets,
  validatePassword,
  validateName, isSuccess
} from "../../utils/commonFunction/common";
import { userDetails, clearUserDetails } from "../../redux/actionType/actionType";
import { connect } from "react-redux";
import { AppNavigation } from "../../navigations/appNavigation";
import { labelRoutes } from "../../navigations/labelRoutes";
import Logo from "../../utils/assets/Navbar/Logo.svg";
import { PostApi } from "../../utils/api/networking";
import { Account_API, Dashboard_API } from "../../utils/api/apiUrl";
import PGrid from "../../component/PGrid/PGrid";

function Login(props) {
  const { navigate } = props;
  const [isLogin, setIsLogin] = useState(false);
  const [openRecover, setOpenRecover] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  // ✅ Refs for focus
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    resetUsername: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
    resetUsername: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    userNameRef.current?.focus();
    navigate(labelRoutes.home);
  }, []);

  const handleOpenRecover = () => {
    setOpenRecover(true);
  };

  const handleCloseRecover = () => {
    setOpenRecover(false);
    setFormData((prev) => ({
      ...prev,
      resetUsername: "",
    }));
    setErrors((prev) => ({
      ...prev,
      resetUsername: "",
    }));
  };

  const handleSendRecover = () => {
    const isValid = resetUserNameValidation();
    if (isValid) {

    }
    setOpenRecover(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validation
    setErrors((prev) => {
      let errorMsg = "";

      if (name === Labels.login.userName) {
        errorMsg = value ? validateName(value) : "";
      }

      if (name === Labels.login.newPassword) {
        errorMsg = value ? validatePassword(value) : "";

        // also validate confirm password
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          return {
            ...prev,
            newPassword: errorMsg,
            confirmPassword: Labels.loginPage.passwordDoNotMatch,
          };
        }
      }

      if (name === Labels.login.confirmPassword) {
        errorMsg =
          value !== formData.newPassword
            ? Labels.loginPage.passwordDoNotMatch
            : "";
      }

      return {
        ...prev,
        [name]: errorMsg,
      };
    });
  };

  const handleLogin = async (e, isLogin) => {
    e.preventDefault();
    const isValid = loginValidation();
    if (isValid) {
      const res = await PostApi(Account_API.Login, {
        userName: formData.userName,
        password: formData.password,
      });
      if (isLogin) {
        if (isSuccess(res)) {
          const user = res?.data;
          props.saveUserDetails({
            UserName: user?.username,
            Email: user?.email,
            fkID: user?.fkID,
            userID: user?.userID,
            role: user?.role,
            currency: user?.currency,
            country: user?.country,
            countryID: user?.countryId,
          });
          localStorage.setItem("user", res?.data?.username);
          localStorage.setItem("email", res?.data?.email);
          localStorage.setItem("agancyUserID", res?.data?.fkID);
          localStorage.setItem("userID", res?.data?.userID);
          localStorage.setItem("countryID", res?.data?.countryId);
          localStorage.setItem("role", res?.data?.role);
          localStorage.setItem("currency", res?.data?.currency);
          localStorage.setItem("country", res?.data?.country);
          navigate(labelRoutes.dashboard);
        } else {
          setErrors((prev) => ({
            ...prev,
            password: res?.data || "Login failed",
          }));
        }
      } else {
        if (isSuccess(res)) {
          setIsLogin(true);
        } else {
          setErrors((prev) => ({
            ...prev,
            password: res?.data || "Login failed",
          }));
        }
      }
    }
  };

  const resetUserNameValidation = () => {
    const requiredFields = [
      Labels.login.resetUsername,
    ];

    let newErrors = {};
    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || value.trim() === "") {
        newErrors[field] = Labels.commonLabel.required;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const loginValidation = () => {
    const requiredFields = [
      Labels.login.userName,
      Labels.login.password
    ];

    let newErrors = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value || value.trim() === "") {
        newErrors[field] = Labels.commonLabel.required;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <form onSubmit={(e) => handleLogin(e, true)} noValidate>
        <div className="login-container">
          <div className="login-right">
            <img src={LoginImg} alt="Login" className="login-image" />
          </div>

          {isForgetPassword ? (
            <div className="login-left">
              <div className="login-box">
                <img src={Logo} alt="Logo" style={{ height: 80, margin: 10 }} />

                <PTextField
                  name={Labels.login.newPassword}
                  label={Labels.loginPage.newPassword}
                  value={formData.newPassword}
                  helperText={errors?.newPassword}
                  startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
                  flag={Labels.flag.password}
                  onChange={handleChange}
                />

                <PTextField
                  name={Labels.login.confirmPassword}
                  label={Labels.loginPage.confirmPassword}
                  value={formData.confirmPassword}
                  helperText={errors?.confirmPassword}
                  startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
                  flag={Labels.flag.password}
                  onChange={handleChange}
                />

                <PButton
                  type="submit"
                  label={Labels.buttonLabel.changePassword}
                  fullWidth
                //onClick={(e) => handleLogin(e, true)}
                />
              </div>
            </div>
          ) : (

            <div className="login-left">
              <div className="login-box">
                <img src={Logo} alt="Logo" style={{ height: 80, margin: 10 }} />

                <PTextField
                  name={Labels.login.userName}
                  label={Labels.loginPage.userName}
                  value={formData.userName}
                  helperText={errors?.userName}
                  startIcon={<PersonIcon sx={{ color: "#9CA3AF" }} />}
                  onChange={handleChange}
                  inputRef={userNameRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // stop form submit
                      passwordRef.current?.focus();
                    }
                  }}
                />

                <PTextField
                  name={Labels.login.password}
                  label={Labels.loginPage.password}
                  value={formData.password}
                  helperText={errors?.password}
                  startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
                  flag={Labels.flag.password}
                  onChange={handleChange}
                  inputRef={passwordRef}
                />

                <div className="forgot-password">
                  <PTypography
                    labelText={Labels.loginPage.forgotPassword}
                    color={CommonColors.primary}
                    flag={Labels.xs}
                    onClick={handleOpenRecover}
                  />
                </div>

                <PButton
                  type="submit"
                  label={Labels.buttonLabel.login}
                  fullWidth
                // onClick={(e) => handleLogin(e, true)}
                />
              </div>
            </div>
          )}
        </div>
      </form>

      <PDialog
        open={openRecover}
        onClose={handleCloseRecover}
        title={Labels.loginPage.recoverPasswordByYourUserName}
        showCloseIcon={true}
        actions={
          < PGrid className="d-flex align-items-center justify-content-end gap-2" >
            <PButton
              label={Labels.buttonLabel.backToLogin}
              variant="outlined"
              onClick={handleCloseRecover}
              color={CommonColors.grey.main}
              width={180}
            />
            <PButton
              label={Labels.buttonLabel.submit}
              variant={Labels.contained}
              onClick={handleSendRecover}
              color={CommonColors.green.main}
              width={120}
            />
          </PGrid>
        }
      >
        <PGrid container>
          <PGrid item xs={12} sm={12} md={12}>
            <PTextField
              name={Labels.login.resetUsername}
              label={Labels.loginPage.userName}
              value={formData.resetUsername}
              onChange={handleChange}
              helperText={errors?.resetUsername}
            />
          </PGrid>
        </PGrid>
      </PDialog>

    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.userDetails.user,
});

const mapDispatchToProps = (dispatch) => ({
  saveUserDetails: (user) =>
    dispatch({ type: userDetails, payload: user }),
  clearUserData: () => dispatch({ type: clearUserDetails }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppNavigation(Login));