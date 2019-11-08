import validaciones from "../../utils/Validaciones";
import constantes from "../../core/config/core.constantes";
import {
  isTipoProductoTransporte3001,
  isNaturalezaEmbarqueInconterms,
  isFormaPagoAbono
} from "./core.validation";
import { isRolCentralEmergencias } from "./role.validation";

const match = {
  validations: [
    {
      name: "lessthan",
      rule: validaciones.lessThan,
      message: validaciones.lessThanMessage
    },
    {
      name: "greaterthan",
      rule: validaciones.greaterThan,
      message: validaciones.greaterThanMessage
    }
  ]
};

export default {
  match,
  formValidator: (fields, context, constraints) => {
    const errors = {};
    let success = true;
    const keys = Object.keys(fields);
    keys.forEach(key => {
      const fieldConstraints = constraints[key] || [];
      const results = fieldConstraints.map(({ rule, message }) => {
        const validation = rule(fields[key], fields, context);
        return {
          validation,
          message: !validation ? message(key, fields, context) : ""
        };
      });

      if (results.some(({ validation }) => !validation)) {
        const fails = results.filter(t => !t.validation);
        errors[key] = fails.map(({ message }) => message)[0] || "";
        success = false;
      } else errors[key] = "";
    });
    return { success, errors };
  },
  fieldValidator: (field, campos, context, constraints) => {
    let error = "";
    let success = true;

    const fieldConstraints = constraints[field] || [];
    const results = fieldConstraints.map(({ rule, message }) => {
      const validation = rule(campos[field], campos, context);
      return {
        validation,
        message: !validation ? message(field, campos, context) : ""
      };
    });

    if (results.some(({ validation }) => !validation)) {
      const fails = results.filter(t => !t.validation);
      error = fails.map(({ message }) => message)[0] || "";
      success = false;
    }
    return { success, error };
  },
  login: {
    constraints: {
      username: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Usuario")
        }
      ],
      password: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Contraseña")
        }
      ],
      captcha: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Captcha")
        }
      ],
      confirmPassword: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Confirmar Contraseña")
        },
        {
          rule: (value, object) =>
            validaciones.equals(value, object["password"]),
          message: field => "Contraseñas no son iguales"
        }
      ],
      email: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Correo eletrónico")
        },
        {
          rule: validaciones.onlyEmail,
          message: () => validaciones.onlyEmailMessage()
        }
      ],
      name: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Nombres")
        }
      ],
      family_name: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Apellidos")
        }
      ]
    }
  },
  forgotPassword: {
    constraints: {
      code: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Code")
        }
      ],
      email: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Correo eletrónico")
        },
        {
          rule: validaciones.onlyEmail,
          message: () => validaciones.onlyEmailMessage()
        }
      ],
      password: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Contraseña")
        }
      ],
      confirmPassword: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Confirmar Contraseña")
        },
        {
          rule: (value, object) =>
            validaciones.equals(value, object["password"]),
          message: field => "Contraseñas no son iguales"
        }
      ]
    }
  },
  busquedaPolizas: {
    constraints: {
      producto: [
        {
          rule: (value, object, context) => {
            if (isRolCentralEmergencias(context.rol)) return true;
            return validaciones.notNullOrEmpty(value);
          },
          message: field => validaciones.requiredMessage("Producto")
        }
      ],
      poliza: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Póliza")
        },
        {
          rule: (value, object, context) => validaciones.digits(value),
          message: validaciones.onlyNumbersMessage
        },
        {
          rule: (value, object, others) => validaciones.maxLength(value, 30),
          message: field => validaciones.maxLengthMessage("Póliza", 30)
        }
      ],
      asegurado: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Asegurado")
        }
      ]
    }
  },
  busquedaCertificados: {
    constraints: {
      aplicacion: [
        {
          rule: (value, object, others) => {
            if (isTipoProductoTransporte3001(others.codProd))
              return validaciones.isNotEmpty(object);
            return true;
          },
          message: field => validaciones.requiredMessage("Aplicación")
        },
        {
          rule: value => validaciones.maxLength(value, 20),
          message: field => validaciones.maxLengthMessage("Aplicación", 20)
        }
      ],
      planilla: [
        {
          rule: (value, object, others) => {
            if (isTipoProductoTransporte3001(others.codProd))
              return validaciones.isNotEmpty(object);
            return true;
          },
          message: field => validaciones.requiredMessage("Planilla")
        },
        {
          rule: value => validaciones.maxLength(value, 20),
          message: field => validaciones.maxLengthMessage("Planilla", 20)
        }
      ],
      certificado: [
        {
          rule: (value, object, others) => {
            if (isTipoProductoTransporte3001(others.codProd))
              return validaciones.isNotEmpty(object);
            return true;
          },
          message: field => validaciones.requiredMessage("Certificado")
        },
        {
          rule: (value, object, others) => validaciones.digits(value),
          message: validaciones.onlyNumbersMessage
        },
        {
          rule: value => validaciones.maxLength(value, 10),
          message: field => validaciones.maxLengthMessage("Certificado", 10)
        }
      ]
    }
  },
  busquedaSiniestros: {
    constraints: {
      producto: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Producto")
        }
      ],
      poliza: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Póliza")
        },
        {
          rule: value => validaciones.digits(value),
          message: validaciones.onlyNumbersMessage
        },
        {
          rule: (value, object, others) => validaciones.maxLength(value, 30),
          message: field => validaciones.maxLengthMessage("Póliza", 30)
        }
      ],
      asegurado: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Asegurado")
        }
      ],
      numeroSiniestro: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Número de Siniestro")
        },
        {
          rule: value => validaciones.maxLength(value, 10),
          message: field =>
            validaciones.maxLengthMessage("Número de Siniestro", 10)
        }
      ],
      estadoSiniestro: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Estado Siniestro")
        }
      ],
      numeroCertificado: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field =>
            validaciones.requiredMessage("Número de Certificado")
        },
        {
          rule: value => validaciones.digits(value),
          message: validaciones.onlyNumbersMessage
        },
        {
          rule: value => validaciones.maxLength(value, 10),
          message: field =>
            validaciones.maxLengthMessage("Número de Certificado", 10)
        }
      ],
      caso: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Número Caso")
        }
      ]
    }
  },
  busquedaAsegurados: {
    constraints: {
      numeroDocumento: [
        {
          rule: (value, object, context) => {
            if (context.tabTipo === "2")
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Número de Documento")
        },
        {
          rule: (value, object, context) => {
            return validaciones.digits(value);
          },
          message: field =>
            validaciones.onlyNumbersMessage("Número de Documento")
        },
        {
          rule: value => validaciones.maxLength(value, 30),
          message: field =>
            validaciones.maxLengthMessage("Número de Documento", 30)
        }
      ],
      tipoDocumento: [
        {
          rule: (value, object, context) => {
            if (context.tabTipo === "2")
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Documento")
        }
      ],
      razonSocial: [
        {
          rule: (value, object, context) => {
            if (context.tabTipo === "1" && context.tabTipoPersona === "4")
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Razón Social")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field => validaciones.maxLengthMessage("Razón Social", 100)
        }
      ],
      nombre: [
        {
          rule: (value, object, context) => {
            if (context.tabTipo === "1" && context.tabTipoPersona === "3")
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Nombres")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field => validaciones.maxLengthMessage("Nombres", 100)
        }
      ],
      apellidoPaterno: [
        {
          rule: (value, object, context) => {
            if (context.tabTipo === "1" && context.tabTipoPersona === "3")
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Apellido Paterno")
        },
        {
          rule: value => validaciones.maxLength(value, 110),
          message: field =>
            validaciones.maxLengthMessage("Apellido Paterno", 110)
        }
      ],
      apellidoMaterno: [
        {
          rule: (value, object, context) => {
            if (context.tabTipo === "1" && context.tabTipoPersona === "3")
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Apellido Materno")
        },
        {
          rule: value => validaciones.maxLength(value, 110),
          message: field =>
            validaciones.maxLengthMessage("Apellido Materno", 110)
        }
      ]
    }
  },
  busquedaTerceros: {
    tipoDocumento: {
      numeroDocumento: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Número de Documento")
        },
        {
          rule: (value, object, context) => {
            return validaciones.digits(value);
          },
          message: field =>
            validaciones.onlyNumbersMessage("Número de Documento")
        },
        {
          rule: value => validaciones.maxLength(value, 30),
          message: field =>
            validaciones.maxLengthMessage("Número de Documento", 30)
        }
      ],
      tipoDocumento: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Documento")
        }
      ]
    },
    personaNatural: {
      nombres: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Nombres")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field => validaciones.maxLengthMessage("Nombres", 100)
        }
      ],
      apellidoPaterno: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Apellido Paterno")
        },
        {
          rule: value => validaciones.maxLength(value, 110),
          message: field =>
            validaciones.maxLengthMessage("Apellido Paterno", 110)
        }
      ],
      apellidoMaterno: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Apellido Materno")
        },
        {
          rule: value => validaciones.maxLength(value, 110),
          message: field =>
            validaciones.maxLengthMessage("Apellido Materno", 110)
        }
      ]
    },
    personaJuridica: {
      razonSocial: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Razón Social")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field => validaciones.maxLengthMessage("Razón Social", 100)
        }
      ]
    }
  },
  datoInspeccion: {
    constraints: {
      medioTransporte: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Medio Transporte")
        }
      ],
      fechaInspeccion: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Fecha Inspeccion")
        },
        {
          rule: (value, object) => {
            if (object["fechaLlegada"])
              return validaciones.isBetween(value, object["fechaLlegada"]);
            return true;
          },
          message: field =>
            validaciones.isBetweenMessage(
              "Fecha Inspeccion(Debe ser mayor a fecha Llegada)"
            )
        }
      ],
      fechaLlegada: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Fecha Llegada")
        },
        {
          rule: (value, object) => {
            if (object["fechaEmbarque"])
              return validaciones.isBetween(value, object["fechaEmbarque"]);
            return true;
          },
          message: field =>
            validaciones.isBetweenMessage(
              "Fecha Llegada(Debe ser mayor a fecha Embarque)"
            )
        }
      ],
      fechaEmbarque: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Fecha Embarque")
        },
        {
          rule: (value, object, others) => {
            if (others["fecIng"])
              return validaciones.isBetween(
                value,
                others["fecIng"],
                others["fecFin"],
                "YYYYMMDD",
                "YYYYMMDD"
              );
            return true;
          },
          message: field =>
            validaciones.isBetweenMessage(
              "Fecha Embarque(Debe estar entre fecha vigencia del certificado)"
            )
        }
      ],
      lugarEmbarque: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Lugar de Embarque")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field =>
            validaciones.maxLengthMessage("Lugar de Embarque", 100)
        }
      ],
      lugarDescarga: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Lugar de Descarga")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field =>
            validaciones.maxLengthMessage("Lugar de Descarga", 100)
        }
      ],
      transporteOriginal: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Transporte Original")
        },
        {
          rule: value => validaciones.maxLength(value, 50),
          message: field =>
            validaciones.maxLengthMessage("Transporte Original", 50)
        }
      ],
      transbordo: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Transbordo")
        }
      ],
      lstTransbordo: [
        {
          rule: (value, object) => {
            if (object["transbordo"] === "S")
              return validaciones.required(value);
            return true;
          },
          message: field =>
            validaciones.requiredMessage("Información transbordo")
        }
      ],
      naturalezaEmbarque: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Naturaleza Embarque")
        }
      ],
      lstIncoterms: [
        {
          rule: (value, object) => {
            if (isNaturalezaEmbarqueInconterms(object["naturalezaEmbarque"]))
              return validaciones.required(value);
            return true;
          },
          message: field =>
            validaciones.requiredMessage("Información incoterms")
        }
      ],
      contenido: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Contenido")
        },
        {
          rule: value => validaciones.maxLength(value, 100),
          message: field => validaciones.maxLengthMessage("Contenido", 100)
        }
      ],
      tipoMercaderia: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Tipo de Mercaderia")
        },
        {
          rule: value => validaciones.maxLength(value, 50),
          message: field =>
            validaciones.maxLengthMessage("Tipo de Mercaderia", 50)
        }
      ]
    }
  },
  datoSiniestro: {
    constraints: {
      tipoSiniestro: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Tipo Siniestro")
        }
      ],
      fechaOcurrencia: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Fecha Ocurrencia")
        },
        {
          rule: (value, object, others) => {
            if (others["fecIng"])
              return validaciones.isBetween(
                value,
                others["fecIng"],
                others["fecFin"],
                "YYYYMMDD",
                "YYYYMMDD"
              );
            return true;
          },
          message: field =>
            validaciones.isBetweenMessage(
              "Fecha Ocurrencia(Debe estar entre fecha vigencia del certificado)"
            )
        }
      ],
      fechaAviso: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Fecha Aviso")
        },
        {
          rule: (value, object, others) => {
            if (object["fechaOcurrencia"])
              return validaciones.isBetween(value, object["fechaOcurrencia"]);
            return true;
          },
          message: field =>
            "Fecha de Aviso debe ser mayor o igual a fecha de ocurrencia"
        }
      ],
      descripcionSiniestro: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field =>
            validaciones.requiredMessage("Descripcion Siniestro")
        },
        {
          rule: (value, object, others) => validaciones.maxLength(value, 100),
          message: field =>
            validaciones.maxLengthMessage("Descripcion Siniestro", 100)
        }
      ],
      empresaTransporte: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Empresa Transporte")
        }
      ],
      nombreChofer: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Nombre Chofer")
        }
      ],
      placa: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Placa")
        }
      ],
      medioTransporte: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Medio Transporte")
        }
      ],
      terceroAfectado: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Tercero Afectado")
        }
      ],
      tipoPerdida: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Tipo Perdida")
        }
      ],
      detallePerdida: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Detalle Perdida")
        }
      ],
      tipoEvento: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Tipo Evento")
        }
      ],
      ubicacion: [
        {
          rule: validaciones.validUbicacion,
          message: field => validaciones.requiredMessage("Ubicación")
        },
        {
          rule: (value, object, others) => {
            const { direccion } = value;
            return validaciones.maxLength(direccion, 100);
          },
          message: field => validaciones.maxLengthMessage("Dirección", 100)
        }
      ]
    }
  },
  seleccionCobertura: {
    constraints: {
      // ramo: [
      //   {
      //     rule: validaciones.notNullOrEmpty,
      //     message: field => validaciones.requiredMessage("Ramo")
      //   }
      // ],
      cobertura: [
        // {
        //   rule: validaciones.notNullOrEmpty,
        //   message: field => validaciones.requiredMessage("Cobertura")
        // },
        {
          rule: (value, object, context) =>
            validaciones.notRepeated(
              value,
              context.coberturas.map(({ codCobertura }) => codCobertura)
            ),
          message: (field, object) =>
            validaciones.notRepeatedMessage("Cobertura")
        },
        {
          rule: (value, object, context) => {
            const {
              rangoFechasValidas,
              fechaOcurrencia,
              validando,
              validacionError
            } = context;
            if (!fechaOcurrencia || !value || validando || validacionError)
              return true;
            if (rangoFechasValidas.length === 0) return false;
            return rangoFechasValidas.some(x =>
              validaciones.isBetween(
                fechaOcurrencia,
                x.fecinivig,
                x.fecfinvig,
                "YYYYMMDD"
              )
            );
          },
          message: (field, object) =>
            "Cobertura no válida para fecha de ocurrencia seleccionada"
        }
      ],
      // causa: [
      //   {
      //     rule: validaciones.notNullOrEmpty,
      //     message: field => validaciones.requiredMessage("Causa")
      //   }
      // ],
      // consecuencia: [
      //   {
      //     rule: validaciones.notNullOrEmpty,
      //     message: field => validaciones.requiredMessage("Consecuencia")
      //   }
      // ],
      codMoneda: [
        {
          rule: (value, object, context) => {
            if (!object.montoAproximadoReclamado) return true;
            return validaciones.notNullOrEmpty(value);
          },
          message: (field, object) => validaciones.requiredMessage("Moneda")
        }
      ],
      montoAproximadoReclamado: [
        // {
        //   rule: validaciones.notNullOrEmpty,
        //   message: field =>
        //     validaciones.requiredMessage("Monto Aproximado Reclamado")
        // },
        {
          rule: value =>
            value === null || value === undefined || value === ""
              ? true
              : validaciones.onlyNumbers(value),
          message: validaciones.onlyNumbersMessage
        },
        {
          rule: (value, object) =>
            value === null || value === undefined || value === ""
              ? true
              : validaciones.greaterThan(value),
          message: (field, object) =>
            validaciones.greaterThanMessage(
              "Monto aproximado reclamado",
              object[field]
            )
        },
        {
          rule: value =>
            value === null || value === undefined || value === ""
              ? true
              : validaciones.decimals(value),
          message: () => validaciones.decimalsMessage(2)
        },
        {
          rule: (value, object, context) => {
            if (
              !context.atenderSinPoliza &&
              object.ramo &&
              object.idcobertura
            ) {
              return validaciones.lessOrEqualThan(value, object.sumaseg);
            }
            return true;
          },
          message: (field, object) => {
            return validaciones.lessOrEqualThanMessage(
              "Monto aproximado reclamado",
              object[field],
              object.sumaseg
            );
          }
        },
        {
          rule: (value, object, context) =>
            validaciones.lessOrEqualThan(value, 99999999999999.99),
          message: (field, object) =>
            validaciones.lessOrEqualThanMessage(
              "Monto aproximado reclamado",
              object[field],
              "99999999999999.99"
            )
        }
      ]
    }
  },
  datoCoberturas: {
    constraints: {
      coberturas: [
        {
          rule: validaciones.required,
          message: field => validaciones.requiredMessage("Coberturas")
        }
      ]
    }
  },
  datoAdicional: {
    constraints: {
      ajustador: [
        {
          rule: (value, object) => {
            if (object && !object["ramos"].some(({ codRamo }) => !!codRamo))
              return true;
            return validaciones.notNullOrEmpty(value);
          },
          message: field => validaciones.requiredMessage("Ajustador")
        }
      ],
      asegurado: {
        nombres: [
          {
            rule: validaciones.notNullOrEmpty,
            message: field => validaciones.requiredMessage("(Asegurado) Nombre")
          },
          {
            rule: validaciones.onlyCompanyNames,
            message: field =>
              validaciones.onlyValidCharacters("(Asegurado) Nombre")
          },
          {
            rule: value => validaciones.maxLength(value, 100),
            message: field =>
              validaciones.maxLengthMessage("(Asegurado) Nombre", 100)
          }
        ],
        email: [
          {
            rule: validaciones.notNullOrEmpty,
            message: field =>
              validaciones.requiredMessage("(Asegurado) Correo Electrónico")
          },
          {
            rule: validaciones.onlyEmail,
            message: field => validaciones.onlyEmailMessage("(Asegurado) ")
          },
          {
            rule: value => validaciones.maxLength(value, 50),
            message: field =>
              validaciones.maxLengthMessage(
                "(Asegurado) Correo Electrónico",
                50
              )
          }
        ],
        telefono: [
          {
            rule: validaciones.notNullOrEmpty,
            message: field =>
              validaciones.requiredMessage("(Asegurado) Teléfono")
          },
          {
            rule: validaciones.onlyPhoneNumber,
            message: field =>
              validaciones.onlyValidCharacters("(Asegurado) Teléfono")
          },
          {
            rule: value => validaciones.maxLength(value, 10),
            message: field =>
              validaciones.maxLengthMessage("(Asegurado) Teléfono", 10)
          }
        ]
      },
      corredor: {
        nombres: [
          // {
          //   rule: validaciones.notNullOrEmpty,
          //   message: field => validaciones.requiredMessage("(Corredor) Nombre")
          // },
          {
            rule: validaciones.onlyCompanyNames,
            message: field =>
              validaciones.onlyValidCharacters("(Corredor) Nombre")
          },
          {
            rule: value => validaciones.maxLength(value, 100),
            message: field =>
              validaciones.maxLengthMessage("(Corredor) Nombre", 100)
          }
        ],
        email: [
          // {
          //   rule: validaciones.notNullOrEmpty,
          //   message: field =>
          //     validaciones.requiredMessage("(Corredor) Correo Electrónico")
          // },
          {
            rule: validaciones.onlyEmail,
            message: field => validaciones.onlyEmailMessage("(Corredor) ")
          },
          {
            rule: value => validaciones.maxLength(value, 50),
            message: field =>
              validaciones.maxLengthMessage("(Corredor) Correo Electrónico", 50)
          }
        ],
        telefono: [
          // {
          //   rule: validaciones.notNullOrEmpty,
          //   message: field =>
          //     validaciones.requiredMessage("(Corredor) Teléfono")
          // },
          {
            rule: validaciones.onlyPhoneNumber,
            message: field =>
              validaciones.onlyValidCharacters("(Corredor) Teléfono")
          },
          {
            rule: value => validaciones.maxLength(value, 10),
            message: field =>
              validaciones.maxLengthMessage("(Corredor) Teléfono", 10)
          }
        ]
      }
    }
  },
  cargaSustentos: {
    constraints: {
      documentos: [
        {
          rule: (value, object, context) => {
            return value.every(d => validaciones.notNullOrEmpty(d.archivos));
          },
          message: field => validaciones.requiredMessage("Documentos")
        }
      ],
      montoAproximadoReclamado: [
        {
          rule: (value, object, context) => {
            return validaciones.notNullOrEmpty(value);
          },
          message: field =>
            validaciones.requiredMessage("Monto aproximado reclamado")
        },
        {
          rule: (value, object, context) => validaciones.onlyNumbers(value),
          message: validaciones.onlyNumbersMessage
        },
        {
          rule: (value, object) => {
            return validaciones.greaterThan(value);
          },
          message: () =>
            validaciones.greaterThanMessage("Monto aproximado reclamado")
        },
        {
          rule: value => validaciones.decimals(value),
          message: () => validaciones.decimalsMessage(2)
        },
        {
          rule: (value, object, { polizaDetalle, siniestroDetalle }) => {
            const ramosPoliza = (polizaDetalle || {}).listRamos;
            const ramosSiniestro = ((siniestroDetalle || {}).siniestro || {})
              .ramos;
            if (
              ramosSiniestro &&
              ramosPoliza &&
              ramosSiniestro.some(s =>
                ramosPoliza.some(p => p.codRamo === s.codigo)
              )
            ) {
              const ramoPoliza = ramosPoliza.find(p =>
                ramosSiniestro.some(s => s.codigo === p.codRamo)
              );
              const ramoSiniestro = ramosSiniestro.find(
                s => s.codigo === ramoPoliza.codRamo
              );
              const cobertura = ramoPoliza.listCoberturas.find(x =>
                ramoSiniestro.coberturas.some(
                  y => y.codCobertura === x.codCobert
                )
              );
              return cobertura
                ? validaciones.lessOrEqualThan(value, cobertura.sumAseg)
                : true;
            }
            return true;
          },
          message: (field, object, { polizaDetalle, siniestroDetalle }) => {
            const ramosPoliza = (polizaDetalle || {}).listRamos;
            const ramosSiniestro = ((siniestroDetalle || {}).siniestro || {})
              .ramos;
            if (
              ramosSiniestro &&
              ramosPoliza &&
              ramosSiniestro.some(s =>
                ramosPoliza.some(p => p.codRamo === s.codigo)
              )
            ) {
              const ramoPoliza = ramosPoliza.find(p =>
                ramosSiniestro.some(s => s.codigo === p.codRamo)
              );
              const ramoSiniestro = ramosSiniestro.find(
                s => s.codigo === ramoPoliza.codRamo
              );
              const cobertura = ramoPoliza.listCoberturas.find(x =>
                ramoSiniestro.coberturas.some(
                  y => y.codCobertura === x.codCobert
                )
              );
              return cobertura
                ? validaciones.lessOrEqualThanMessage(
                    "Monto aproximado reclamado",
                    object[field],
                    cobertura.sumAseg
                  )
                : "";
            }
            return "";
          }
        },
        {
          rule: (value, object, context) =>
            validaciones.lessOrEqualThan(value, 99999999999999.99),
          message: (field, object) =>
            validaciones.lessOrEqualThanMessage(
              "Monto aproximado reclamado",
              object[field],
              "99999999999999.99"
            )
        }
      ],
      formaPago: [
        {
          rule: validaciones.notNullOrEmpty,
          message: field => validaciones.requiredMessage("Forma de pago")
        }
      ],
      tipoCuenta: [
        {
          rule: (value, object, context) => {
            if (isFormaPagoAbono(object.formaPago))
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Tipo de cuenta")
        }
      ],
      entidadFinanciera: [
        {
          rule: (value, object, context) => {
            if (isFormaPagoAbono(object.formaPago))
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Entidad financiera")
        }
      ],
      monedaCuenta: [
        {
          rule: (value, object, context) => {
            if (isFormaPagoAbono(object.formaPago))
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Moneda de cuenta")
        }
      ],
      numeroCuenta: [
        {
          rule: (value, object, context) => {
            if (isFormaPagoAbono(object.formaPago))
              return validaciones.notNullOrEmpty(value);
            return true;
          },
          message: field => validaciones.requiredMessage("Número de cuenta")
        },
        {
          rule: (value, object, context) => {
            if (isFormaPagoAbono(object.formaPago))
              return validaciones.digits(value);
            return true;
          },
          message: field => validaciones.onlyNumbersMessage("Número de cuenta")
        },
        {
          rule: (value, object, context) => {
            var digits = -1;
            if (
              isFormaPagoAbono(object.formaPago) &&
              object.tipoCuenta &&
              object.entidadFinanciera
            ) {
              digits = constantes.obtenerLongitudNumeroCuentaPorEF(
                object.tipoCuenta,
                object.entidadFinanciera
              );

              return digits > 0
                ? validaciones.equalLength(value, digits)
                : false;
            }
            return true;
          },
          message: (field, object, context) => {
            var digits = -1;
            if (isFormaPagoAbono(object.formaPago)) {
              digits = constantes.obtenerLongitudNumeroCuentaPorEF(
                object.tipoCuenta,
                object.entidadFinanciera
              );

              return digits > 0
                ? validaciones.equalLengthMessage("Número de cuenta", digits)
                : "";
            }
            return "";
          }
        }
      ]
    }
  }
};
