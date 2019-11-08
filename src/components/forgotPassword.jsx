import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Auth } from "aws-amplify";
import styled from "styled-components";
import logo from "../../resources/images/logo-rimac.png";
import privadaOlvideContrasena from "../../resources/images/privada_olvidecontrasena.png";
import logoRed from "../../resources/images/logo-rimac-red.png";
import APP_ROUTES from "../../core/config/routing";
import validation from "../validations/form.validation";
import * as _ from "lodash";
import "./SignIn.css";

const ForgotPasswordContainer = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;
`;

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.constraints = validation.forgotPassword.constraints;
    this.formValidator = validation.formValidator;
    this.fieldValidator = validation.fieldValidator;
    this.fieldsToValidate = {
      requestCode: ["email"],
      confirmation: ["code", "password", "confirmPassword"]
    };
    this.state = {
      campos: {
        defaultTheme: true,
        code: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      touched: {
        code: false,
        email: false,
        password: false,
        confirmPassword: false
      },
      errors: {
        code: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      codeSent: false,
      confirmed: false,
      isSendingCode: false,
      isConfirming: false,
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

  shouldMarkError = field => !!this.state.errors[field];

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

  validateForm = fieldsToValidate => {
    const campos = _.pick(this.state.campos, fieldsToValidate);
    const context = {};
    const result = this.formValidator(campos, context, this.constraints);
    this.setState({
      errors: result.errors,
      ...(result.success && {
        touched: {
          code: false,
          email: false,
          password: false,
          confirmPassword: false
        }
      })
    });
    return result.success;
  };

  handleSendCodeClick = async () => {
    this.setState({
      isSendingCode: true,
      showAlert: false,
      typeAlert: "info",
      error: "",
      description: ""
    });

    try {
      await Auth.forgotPassword(this.state.campos.email.trim());
      this.setState({ codeSent: true });
    } catch (e) {
      /** Exceptions */
      /** "InvalidPasswordException", "CodeMismatchException", "UserNotFoundException" */
      console.log(e);
      if (this._isMounted) {
        const state = {
          isSendingCode: false,
          showAlert: true,
          typeAlert: "error",
          error: e.message,
          description: ""
        };
        this.setState(state);
      }
    }
  };

  handleConfirmClick = async () => {
    this.setState({
      isConfirming: true,
      showAlert: false,
      typeAlert: "info",
      error: "",
      description: ""
    });

    try {
      await Auth.forgotPasswordSubmit(
        this.state.campos.email,
        this.state.campos.code,
        this.state.campos.password
      );
      this.setState({ confirmed: true });
    } catch (e) {
      console.log(e);
      if (this._isMounted) {
        const state = {
          isConfirming: false,
          showAlert: true,
          typeAlert: "error",
          error: e.message,
          description: ""
        };
        this.setState(state);
      }
    }
  };

  renderRequestCodeForm() {
    const { campos, touched, errors, showAlert, typeAlert, error } = this.state;
    return (
      <React.Fragment>
        <p className="text-muted">
          Ingresa tu correo electrónico abajo y te enviaremos un mensaje para
          restablecer tu contraseña
        </p>
        {showAlert && (
          <Alert
            className="mb-3"
            message={error}
            type={typeAlert}
            showIcon
            closable
          />
        )}
        <div className="signin-box">
          <form
            className="needs-validation d-flex flex-column justify-content-center"
            noValidate={true}
            autoComplete="off"
            onSubmit={this._onSubmit(this.fieldsToValidate.requestCode)(
              this.handleSendCodeClick
            )}
          >
            <div className="mb-4">
              <div className="form-label-group">
                <input
                  id="email"
                  name="email"
                  type="text"
                  className={`form-control form-control-sm ${
                    this.shouldMarkError("email")
                      ? "is-invalid"
                      : touched.email
                      ? "is-valid"
                      : ""
                  }`}
                  value={campos.email}
                  placeholder="Correo electrónico"
                  onChange={this._handleInputChange}
                  onBlur={this._handleBlur("email")}
                  required={true}
                />
                <label htmlFor="email" className="text-muted">
                  <FontAwesomeIcon className="mr-1" icon="envelope" />
                  Correo electrónico
                </label>
              </div>
              {this.shouldMarkError("email") && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-end">
              <button
                type="submit"
                className={`btn ant-btn ${
                  !campos.defaultTheme
                    ? "btn-white"
                    : "btn-danger deep-orange darken-3"
                } btn-md waves-light waves-effect`}
                disabled={this.state.isSendingCode}
              >
                {this.state.isSendingCode ? (
                  <React.Fragment>
                    <FontAwesomeIcon icon="spinner" className="mr-2" spin />
                    Enviando
                  </React.Fragment>
                ) : (
                  <React.Fragment>Enviar</React.Fragment>
                )}
                <FontAwesomeIcon
                  icon={["far", "paper-plane"]}
                  className="ml-2"
                />
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  renderConfirmationForm() {
    const { campos, touched, errors, showAlert, typeAlert, error } = this.state;
    return (
      <React.Fragment>
        {showAlert && (
          <Alert
            className="mb-3"
            message={error}
            type={typeAlert}
            showIcon
            closable
          />
        )}
        <div className="signin-box">
          <form
            className="needs-validation d-flex flex-column justify-content-center"
            noValidate={true}
            autoComplete="off"
            onSubmit={this._onSubmit(this.fieldsToValidate.confirmation)(
              this.handleConfirmClick
            )}
          >
            <div>
              <div className="form-label-group">
                <input
                  id="code"
                  name="code"
                  type="text"
                  className={`form-control form-control-sm ${
                    this.shouldMarkError("code")
                      ? "is-invalid"
                      : touched.code
                      ? "is-valid"
                      : ""
                  }`}
                  value={campos.code}
                  placeholder="Código de confirmación"
                  onChange={this._handleInputChange}
                  onBlur={this._handleBlur("code")}
                  required={true}
                />
                <label htmlFor="code" className="text-muted">
                  Código de confirmación
                </label>
              </div>
              {this.shouldMarkError("code") && (
                <div className="invalid-feedback d-block">{errors.code}</div>
              )}
            </div>
            <p className="text-muted">
              Por favor revisa en tu email({campos.email}) por el código de
              confirmación.
            </p>
            <div className="border-top mb-4"></div>
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
                  Contraseña
                </label>
              </div>
              {this.shouldMarkError("password") && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="mb-3">
              <div className="form-label-group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${
                    this.shouldMarkError("confirmPassword")
                      ? "is-invalid"
                      : touched.confirmPassword
                      ? "is-valid"
                      : ""
                  }`}
                  value={campos.confirmPassword}
                  placeholder="Confirmar Contraseña"
                  onChange={this._handleInputChange}
                  onBlur={this._handleBlur("confirmPassword")}
                  required={true}
                />

                <label htmlFor="confirmPassword" className="text-muted">
                  Confirmar Contraseña
                </label>
              </div>
              {this.shouldMarkError("confirmPassword") && (
                <div className="invalid-feedback d-block">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center align-items-end">
              <button
                type="submit"
                className={`btn ant-btn ${
                  !campos.defaultTheme
                    ? "btn-white"
                    : "btn-danger deep-orange darken-3"
                } btn-md waves-light waves-effect`}
                disabled={this.state.isConfirming}
              >
                {this.state.isConfirming ? (
                  <React.Fragment>
                    <FontAwesomeIcon icon="spinner" className="mr-2" spin />
                    Confirmando
                  </React.Fragment>
                ) : (
                  <React.Fragment>Confirmar</React.Fragment>
                )}
                <FontAwesomeIcon icon="check-circle" className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  renderSuccessMessage() {
    return (
      <div className="d-flex align-items-center flex-column mt-4">
        <FontAwesomeIcon className="text-danger my-4" icon="check" size="2x" />
        <p className="text-center text-muted">
          Tu contraseña ha sido restablecida.
        </p>
        <p>
          <Link to={APP_ROUTES.URL_SIGNIN}>
            Click para inicar sesión con tus nuevas credenciales.
          </Link>
        </p>
      </div>
    );
  }

  _onSubmit = fieldsToValidate => action => e => {
    e.preventDefault();
    if (!this.validateForm(fieldsToValidate)) {
      e.stopPropagation();
      return;
    }
    action();
  };

  render() {
    const { campos } = this.state;
    const className = `card p-4 z-depth-3 y-depth-3 x-depth-3 ${
      !campos.defaultTheme ? "deep-orange darken-3" : ""
    } d-flex justify-content-center ${this.props.className}`.trim();
    return this.props.auth.authenticated ? (
      <Redirect to={APP_ROUTES.URL_INICIO} />
    ) : (
      <ForgotPasswordContainer className={className}>
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
                alt="olvide_contraseña"
                style={{ maxWidth: "100%", margin: "0 auto" }}
                src={privadaOlvideContrasena}
              />
            </div>
            <div className="col-12 col-md-6">
              <div>
                <h5
                  className={`subtitle my-4 font-weight-bold ${
                    campos.defaultTheme ? "text-muted darken-3" : ""
                  }`}
                >
                  Olvidé mi contraseña
                </h5>
                {!this.state.codeSent
                  ? this.renderRequestCodeForm()
                  : !this.state.confirmed
                  ? this.renderConfirmationForm()
                  : this.renderSuccessMessage()}
              </div>
            </div>
          </div>
        </div>
      </ForgotPasswordContainer>
    );
  }
}

const mapStateToProps = ({ auth }) => ({ auth });
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
