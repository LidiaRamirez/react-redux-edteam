import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Auth } from "aws-amplify";
import {
  AWS_AUTHENTICATION,
  APP_CONSTANTES
} from "../../core/config/constantes";
import ReCAPTCHA from "react-google-recaptcha";
import styled from "styled-components";
import logo from "../../resources/images/logo-rimac.png";
import privadaIngresa from "../../resources/images/privada_ingresa.png";
import logoRed from "../../resources/images/logo-rimac-red.png";
import APP_ROUTES from "../../core/config/routing";
import validation from "../validations/form.validation";
import * as actions from "../../actions/actions";
import "./SignIn.css";

const StyledButton = styled.button`
  /* Adapt the colors based on primary prop */
  margin: 1.5em 2em;
  padding: 0.25em 1em;
`;

const SignInContainer = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;
`;

const TEST_SITE_KEY = "6Lco7LgUAAAAADATep5npwzRHXzIxzYf5tsz11Lg";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this._reCaptchaRef = React.createRef();
    this._isMounted = false;
    this.constraints = validation.login.constraints;
    this.formValidator = validation.formValidator;
    this.fieldValidator = validation.fieldValidator;
    this.state = {
      campos: {
        defaultTheme: true,
        username: "",
        password: "",
        captcha: ""
      },
      touched: {
        username: false,
        password: false,
        captcha: false
      },
      errors: {
        username: "",
        password: "",
        captcha: ""
      },
      signing: false,
      signingAD: false,
      showAlert: false,
      typeAlert: "info",
      error: "",
      description: ""
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
  };
  componentWillUnmount = () => {
    this._isMounted = false;
  };

  _handleBlur = field => event => {
    this.setState(
      {
        touched: { ...this.state.touched, [field]: true }
      },
      () => {
        this.validateField(field);
      }
    );
  };

  _handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        campos: {
          ...this.state.campos,
          [name]: value
        }
      },
      () => {
        this.validateField(name);
      }
    );
  };

  _handleCaptchaChange = value => {
    this.setState({ campos: { ...this.state.campos, captcha: value } }, () => {
      this.validateField("captcha");
    });
  };

  shouldMarkError = field => !!this.state.errors[field];

  resetCaptcha = () => {
    if (this._reCaptchaRef && this._reCaptchaRef.current)
      this._reCaptchaRef.current.reset();
  };

  validateField = field => {
    const context = {};
    const result = this.fieldValidator(
      field,
      this.state.campos,
      context,
      this.constraints
    );
    this.setState({
      errors: {
        ...this.state.errors,
        [field]: result.error
      }
    });

    return result.success;
  };

  validateForm = () => {
    const context = {};
    const result = this.formValidator(
      this.state.campos,
      context,
      this.constraints
    );
    this.setState({
      errors: result.errors,
      ...(result.success && {
        touched: {
          username: false,
          password: false,
          captcha: false
        }
      })
    });
    return result.success;
  };

  signIn = async () => {
    try {
      const { username, password, captcha } = this.state.campos;
      this.setState({
        signing: true,
        showAlert: false,
        typeAlert: "info",
        error: "",
        description: ""
      });
      let user = await Auth.signIn(username.trim(), password);
      if (
        user.challengeName === "SMS_MFA" ||
        user.challengeName === "SOFTWARE_TOKEN_MFA"
      ) {
        
      } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        this.props.actualizarEstadoUsuarioSesion({
          cognitoInstance: user,
          challenges: {
            ...this.props.auth.challenges,
            newPasswordRequired: true
          }
        });
        this.props.history.push(APP_ROUTES.URL_CHANGE_PASSWORD);
      } else if (user.challengeName === "MFA_SETUP") {
      
      } else if (user.challengeName === "CUSTOM_CHALLENGE") {
        user = await Auth.sendCustomChallengeAnswer(user, captcha);
      }
    } catch (err) {
      if (this._isMounted) {
        const state = {
          signing: false,
          showAlert: true,
          typeAlert: "error",
          error: "",
          description: ""
        };

        if (err.code === APP_CONSTANTES.CONST_AUTHN_USER_NOT_FOUND_CODE) {
          Object.assign(state, {
            campos: {
              ...this.state.campos,
              captcha: ""
            },
            error: APP_CONSTANTES.CONST_AUTHN_USER_NOT_FOUND_MESSAGE,
            description: err.message
          });
          this.resetCaptcha();
        } else if (
          err.code === APP_CONSTANTES.CONST_AUTHN_PASSWORD_RESET_REQUIRED_CODE
        ) {
          Object.assign(state, {
            typeAlert: "warning",
            error: APP_CONSTANTES.CONST_AUTHN_PASSWORD_RESET_REQUIRED_MESSAGE,
            description: err.message
          });
        } else if (
          err.code === APP_CONSTANTES.CONST_AUTHN_USER_NOT_CONFIRMED_CODE
        ) {
          Object.assign(state, {
            typeAlert: "warning",
            error: APP_CONSTANTES.CONST_AUTHN_USER_NOT_CONFIRMED_MESSAGE,
            description: err.message
          });
        } else if (
          err.code === APP_CONSTANTES.CONST_AUTHN_NOT_AUTHORIZED_CODE
        ) {
          Object.assign(state, {
            campos: {
              ...this.state.campos,
              captcha: ""
            },
            error: APP_CONSTANTES.CONST_AUTHN_NOT_AUTHORIZED_MESSAGE,
            description: err.message
          });
          this.resetCaptcha();
        } else {
          Object.assign(state, {
            campos: {
              ...this.state.campos,
              captcha: ""
            },
            error: err.code,
            description: err.message
          });
          this.resetCaptcha();
        }
        this.setState(state);
      }
    }
  };

  signInWithAD = () => {
    this.setState({
      signingAD: true,
      showAlert: false,
      typeAlert: "info",
      error: "",
      description: ""
    });
    window.location = AWS_AUTHENTICATION.URL_SEND_TO_SIGNIN;
  };

  _onSubmit = e => {
    e.preventDefault();
    if (!this.validateForm()) {
      e.stopPropagation();
      return;
    }
    this.signIn();
  };

  render() {
    let {
      className,
      auth: { authenticated },
      location
    } = this.props;
    let { from } = location.state || {
      from: { pathname: APP_ROUTES.URL_INICIO }
    };
    const {
      campos,
      touched,
      errors,
      showAlert,
      typeAlert,
      error,
      description
    } = this.state;
    className = `card p-4 z-depth-3 y-depth-3 x-depth-3 ${
      !campos.defaultTheme ? "deep-orange darken-3" : ""
    } d-flex justify-content-center ${className}`.trim();
    return authenticated ? (
      <Redirect push={false} to={from} />
    ) : (
      <SignInContainer className={className}>
        <img
          alt="logo_Rimac"
          style={{ maxWidth: "180px", margin: "0 auto" }}
          src={!campos.defaultTheme ? logo : logoRed}
        />
        <h4
          className={`subtitle mt-2 font-weight-bold ${
            campos.defaultTheme ? "text-muted darken-3" : ""
          }`}
        >
          Claims RRGG
        </h4>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6 d-none d-md-block">
              <img
                alt="privada_ingreso"
                style={{ maxWidth: "100%", margin: "0 auto" }}
                src={privadaIngresa}
              />
            </div>
            <div className="col-12 col-md-6">
              <h5
                className={`subtitle mt-2 font-weight-bold ${
                  campos.defaultTheme ? "text-muted darken-3" : ""
                }`}
              >
                Ingresar a mi cuenta
              </h5>
              {showAlert && (
                <Alert message={error} type={typeAlert} showIcon closable />
              )}
              <div className="signin-box">
                <div className="mt-4">
                  <form
                    className="needs-validation d-flex flex-column justify-content-center"
                    noValidate={true}
                    onSubmit={this._onSubmit}
                  >
                    <div className="mb-4">
                      <div className="form-label-group">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          className={`form-control form-control-sm ${
                            this.shouldMarkError("username")
                              ? "is-invalid"
                              : touched.username
                              ? "is-valid"
                              : ""
                          }`}
                          value={campos.username}
                          placeholder="Usuario"
                          onChange={this._handleInputChange}
                          onBlur={this._handleBlur("username")}
                          required={true}
                        />
                        <label htmlFor="username" className="text-muted">
                          <FontAwesomeIcon
                            className="mr-1"
                            icon={["far", "user"]}
                          />
                          Usuario
                        </label>
                      </div>
                      {this.shouldMarkError("username") && (
                        <div className="invalid-feedback d-block">
                          {errors.username}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="form-label-group">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className={`form-control ${
                            this.shouldMarkError("password")
                              ? "is-invalid"
                              : touched.password
                              ? "is-valid"
                              : ""
                          }`}
                          value={campos.password}
                          placeholder="Contraseña"
                          onChange={this._handleInputChange}
                          onBlur={this._handleBlur("password")}
                          required={true}
                        />

                        <label htmlFor="password" className="text-muted">
                          <FontAwesomeIcon className="mr-1" icon="lock" />
                          Contraseña
                        </label>
                      </div>
                      {this.shouldMarkError("password") && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                      <Link to={APP_ROUTES.URL_FORGOT_PASSWORD}>
                        Olvidé mi contraseña
                      </Link>
                    </div>
                    <div className="mb-3">
                      <ReCAPTCHA
                        className="g-recaptcha"
                        ref={this._reCaptchaRef}
                        sitekey={TEST_SITE_KEY}
                        onChange={this._handleCaptchaChange}
                      />
                      {this.shouldMarkError("captcha") && (
                        <div className="invalid-feedback d-block">
                          {errors.captcha}
                        </div>
                      )}
                    </div>
                    <div className="d-flex align-items-center flex-column">
                      <StyledButton
                        type="submit"
                        className={`btn ant-btn ${
                          !campos.defaultTheme
                            ? "btn-white"
                            : "btn-danger deep-orange darken-3"
                        } btn-md waves-light waves-effect`}
                        disabled={this.state.signingAD || this.state.signing}
                      >
                        {this.state.signing ? (
                          <FontAwesomeIcon
                            icon="spinner"
                            className="mr-2"
                            spin
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon="sign-in-alt"
                            className="mr-2"
                          />
                        )}
                        Ingresar
                      </StyledButton>
                      <button
                        type="button"
                        className={`btn ant-btn ${
                          !campos.defaultTheme
                            ? "btn-white"
                            : "btn-danger deep-orange darken-3"
                        } btn-md waves-light waves-effect`}
                        disabled={this.state.signingAD || this.state.signing}
                        onClick={this.signInWithAD}
                      >
                        {this.state.signingAD && (
                          <FontAwesomeIcon
                            icon="spinner"
                            className="mr-2"
                            spin
                          />
                        )}
                        Ingresa con tu cuenta de rimac
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignInContainer>
    );
  }
}

const mapStateToProps = ({ auth }) => ({ auth });
const mapDispatchToProps = dispatch => ({
  actualizarEstadoUsuarioSesion: newState => {
    dispatch(actions.updateUserSessionState(newState));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
