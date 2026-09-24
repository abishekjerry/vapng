import { useState, useEffect, useRef } from "react";
import PTypography from "../../component/PTypography/PTypography";
import PTextField from "../../component/PTextField/PTextField";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import PButton from "../../component/PButton/PButton";
import { Labels } from "../../utils/constants/labels";
import LoginImg from "../../utils/assets/images/Login.png";
import "./login.css";
import { CommonColors } from "../../utils/constants/colors";
import PDialog from "../../component/PDialog/PDialog";
import { validatePassword, validateName, isSuccess, toast } from "../../utils/commonFunction/common";
import { userDetails, clearUserDetails } from "../../redux/actionType/actionType";
import { connect } from "react-redux";
import { AppNavigation } from "../../navigations/appNavigation";
import { labelRoutes } from "../../navigations/labelRoutes";
import Logo from "../../utils/assets/images/Valogo.png"
import { PostApi } from "../../utils/api/networking";
import { Account_API } from "../../utils/api/apiUrl";
import PGrid from "../../component/PGrid/PGrid";
import { useNavigate, useSearchParams } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [openRecover, setOpenRecover] = useState(false);
  const [searchParams] = useSearchParams();

  // ✅ Refs for focus
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    resetUsername: "",
    newPassword: "",
    confirmPassword: "",
    default: false,
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
    const params = new URLSearchParams(window.location.search);
    const username = params.get("Username");
    const token = params.get("Token");
    const enquiryID = params.get("Enquiryid");
    if (username && token) {
      autoLogin(username, token, enquiryID);
    }
    navigate(labelRoutes.home);
  }, []);

  const currency = {
    INR: "₹",
    IDR: "Rp",
    MYR: "RM",
    PHP: "₱",
    SGD: "$",
    THB: "฿",
    VND: "₫"
  };
  //vapng autologin
  const autoLogin = async (username, token, enquiryID) => {
    const res = await PostApi(Account_API.Login, {
      userName: username,
      token: token,
    });

    if (isSuccess(res)) {
      const user = res?.data;

      props.saveUserDetails({
        userName: user?.username,
        email: user?.email,
        fkID: user?.fkID,
        userID: user?.userID,
        role: user?.role,
        currency: user?.currency,
        country: user?.country,
        countryID: user?.countryId,
        userType: user?.usertype,
        menuId: 1,
        symbol: currency[user?.currency],
        portal: false,
      });

      if (enquiryID) {
        navigate(labelRoutes.eqDashboard, {
          state: { enquiryID }
        });
      } else {
        navigate(labelRoutes.eqDashboard);
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        password: res?.data || "Login failed",
      }));
    }
  };

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
        errorMsg = value !== formData.newPassword ? Labels.loginPage.passwordDoNotMatch : "";
      }
      return {
        ...prev,
        [name]: errorMsg,
      };
    });
  };

  //vapng normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    const isValid = loginValidation();
    if (formData.password.toLowerCase() === "password") {
      setFormData((prev) => ({
        ...prev,
        default: true,
      }));
      return;
    }
    if (isValid) {
      const res = await PostApi(Account_API.Login, {
        userName: formData.userName,
        password: formData.password,
      });

      if (isSuccess(res)) {
        const user = res?.data;
        props.saveUserDetails({
          userName: user?.username,
          email: user?.email,
          fkID: user?.fkID,
          userID: user?.userID,
          role: user?.role,
          currency: user?.currency,
          country: user?.country,
          countryID: user?.countryId,
          userType: user?.usertype,
          menuId: 0,
          symbol: currency[user?.currency],
          portal: false
        });
        navigate(labelRoutes.dashboard);
      } else {
        setErrors((prev) => ({
          ...prev,
          password: res?.data || "Login failed",
        }));
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

  //vapng change password
  const passwordValidation = () => {
    const requiredFields = [
      Labels.login.newPassword,
      Labels.login.confirmPassword
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const isValid = passwordValidation();
    if (isValid) {
      const res = await PostApi(Account_API.ChangePassword, {
        username: formData.userName,
        password: formData.password,
        newPassword: formData.newPassword,
      });

      if (isSuccess(res)) {
        toast(Labels.status.success, res.data);
        setFormData((prev) => ({
          ...prev,
          default: false,
          userName: "",
          password: "",
          confirmPassword: "",
          newPassword: ""
        }));
      } else {
        toast(Labels.status.failure, res.data);
        setFormData((prev) => ({
          ...prev,
          default: true,
        }));
      }
    }
  };

  return (
    <>
      <form onSubmit={formData.default ? handleChangePassword : handleLogin} noValidate>
        <div className="login-container">
          <div className="login-right">
            <img src={LoginImg} alt="Login" className="login-image" />
          </div>

          {formData.default ? (
            <div className="login-left">
              <div className="login-box">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={Logo} alt="Logo" style={{ height: 80, width: 100, margin: 10, }} />
                </div>

                <PTextField
                  label={`${Labels.loginPage.newPassword} ${Labels.symbols.required}`}
                  name={Labels.login.newPassword}
                  value={formData.newPassword}
                  helperText={errors?.newPassword}
                  startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
                  flag={Labels.flag.password}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <PTextField
                  label={`${Labels.loginPage.confirmPassword} ${Labels.symbols.required}`}
                  name={Labels.login.confirmPassword}
                  value={formData.confirmPassword}
                  helperText={errors?.confirmPassword}
                  startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
                  flag={Labels.flag.password}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <PButton
                  type="submit"
                  label={Labels.buttonLabel.changePassword}
                  fullWidth
                />
              </div>
            </div>
          ) : (

            <div className="login-left">
              <div className="login-box">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={Logo} alt="Logo" style={{ height: 80, width: 100, margin: 10, }} />
                </div>

                <PTextField
                  label={`${Labels.loginPage.userName} ${Labels.symbols.required}`}
                  name={Labels.login.userName}
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
                  sx={{ mb: 3 }}
                />

                <PTextField
                  label={`${Labels.loginPage.password} ${Labels.symbols.required}`}
                  name={Labels.login.password}
                  value={formData.password}
                  helperText={errors?.password}
                  startIcon={<LockIcon sx={{ color: "#9CA3AF" }} />}
                  flag={Labels.flag.password}
                  onChange={handleChange}
                  inputRef={passwordRef}
                  sx={{ mb: 3 }}
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
              label={`${Labels.loginPage.userName} ${Labels.symbols.required}`}
              name={Labels.login.resetUsername}
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