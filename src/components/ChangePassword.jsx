import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Auth } from "aws-amplify";
import styled from "styled-components";
import logo from "../../resources/images/logo-rimac.png";
import withNewPasswordRequiredValidation from "../validations/withNewPasswordRequiredValidation";
import privadaCuentaNueva from "../../resources/images/privada_cuentanueva.png";
import logoRed from "../../resources/images/logo-rimac-red.png";
import APP_ROUTES from "../../core/config/routing";
import validation from "../validations/form.validation";
import * as actions from "../../actions/actions";
import * as _ from "lodash";
import "./SignIn.css";

const ChangePasswordContainer = styled.div`
  margin-top: 2em;
  margin-bottom: 2em;
`;

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.constraints = validation.login.constraints;
    this.formValidator = validation.formValidator;
    this.fieldValidator = validation.fieldValidator;
    this.state = {
      campos: {
        defaultTheme: true,
        name: "",
        password: "",
        confirmPassword: "",
        family_name: ""
      },
      touched: {
        name: false,
        password: false,
        confirmPassword: false,
        family_name: false
      },
      errors: {
        name: "",
        password: "",
        confirmPassword: "",
        family_name: ""
      },
      sending: false,
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
          name: false,
          password: false,
          confirmPassword: false,
          family_name: false
        }
      })
    });
    return result.success;
  };

  completeNewPassword = async () => {
    try {
      this.setState({
        sending: true,
        showAlert: false,
        typeAlert: "info",
        error: "",
        description: ""
      });
      const user = this.props.auth.cognitoInstance;
      const { requiredAttributes } = user.challengeParam;
      const newAttributes = _.zipObject(
        requiredAttributes,
        requiredAttributes.map(field => this.state.campos[field])
      );
      const data = await Auth.completeNewPassword(
        user,
        this.state.campos.password,
        newAttributes
      );
    } catch (err) {
      if (this._isMounted) {
        const state = {
          sending: false,
          showAlert: true,
          typeAlert: "error",
          error: "",
          description: ""
        };

        this.setState(state);
      }
    }
  };

  _onSubmit = e => {
    e.preventDefault();
    if (!this.validateForm()) {
      e.stopPropagation();
      return;
    }
    this.completeNewPassword();
  };

  render() {
    const {
      campos,
      touched,
      errors,
      showAlert,
      typeAlert,
      error,
      description
    } = this.state;
    const className = `card p-4 z-depth-3 y-depth-3 x-depth-3 ${
      !campos.defaultTheme ? "deep-orange darken-3" : ""
    } d-flex justify-content-center ${this.props.className}`.trim();
    return this.props.auth.authenticated ? (
      <Redirect to={APP_ROUTES.URL_INICIO} />
    ) : (
      <ChangePasswordContainer className={className}>
        <img
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
                style={{ maxWidth: "100%", margin: "0 auto" }}
                src={privadaCuentaNueva}
              />
            </div>
            <div className="col-12 col-md-6">
              <div>
                <h5
                  className={`subtitle mt-2 font-weight-bold ${
                    campos.defaultTheme ? "text-muted darken-3" : ""
                  }`}
                >
                  Cambiar mi contraseña
                </h5>
                {showAlert && (
                  <Alert message={error} type={typeAlert} showIcon closable />
                )}
                <div className="signin-box">
                  <div className="mt-4">
                    <form
                      className="needs-validation d-flex flex-column justify-content-center"
                      noValidate={true}
                      autoComplete="off"
                      onSubmit={this._onSubmit}
                    >
                      <p className="text-muted">
                        Por favor ingresa tu nueva contraseña.
                      </p>
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

                          <label
                            htmlFor="confirmPassword"
                            className="text-muted"
                          >
                            Confirmar Contraseña
                          </label>
                        </div>
                        {this.shouldMarkError("confirmPassword") && (
                          <div className="invalid-feedback d-block">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="form-label-group">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className={`form-control form-control-sm ${
                              this.shouldMarkError("name")
                                ? "is-invalid"
                                : touched.name
                                ? "is-valid"
                                : ""
                            }`}
                            value={campos.name}
                            placeholder="Nombres"
                            onChange={this._handleInputChange}
                            onBlur={this._handleBlur("name")}
                            required={true}
                          />
                          <label htmlFor="name" className="text-muted">
                            Nombres
                          </label>
                        </div>
                        {this.shouldMarkError("name") && (
                          <div className="invalid-feedback d-block">
                            {errors.name}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="form-label-group">
                          <input
                            id="family_name"
                            name="family_name"
                            type="text"
                            className={`form-control ${
                              this.shouldMarkError("family_name")
                                ? "is-invalid"
                                : touched.family_name
                                ? "is-valid"
                                : ""
                            }`}
                            value={campos.family_name}
                            placeholder="Apellidos"
                            onChange={this._handleInputChange}
                            onBlur={this._handleBlur("family_name")}
                            required={true}
                          />

                          <label htmlFor="family_name" className="text-muted">
                            Apellidos
                          </label>
                        </div>
                        {this.shouldMarkError("family_name") && (
                          <div className="invalid-feedback d-block">
                            {errors.family_name}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className={`btn ant-btn ${
                            !campos.defaultTheme
                              ? "btn-white"
                              : "btn-danger deep-orange darken-3"
                          } btn-md waves-light waves-effect`}
                          disabled={this.state.sending}
                        >
                          {this.state.sending ? (
                            <React.Fragment>
                              <FontAwesomeIcon
                                icon="spinner"
                                className="mr-2"
                                spin
                              />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChangePasswordContainer>
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
)(withNewPasswordRequiredValidation(ChangePassword));
