# REACT 

## Componente con funciones
Si son presentacionales, no necesitan trabajar con el estado ciclo de vida. Y solo necesita props.

## Componente de orden superior

Es una función que recibe un componente lo procesa según la lógica y devuelve otro componente.
Nos permite reutilizar lógica a lo largo de la aplicación en diversos componentes.
Para nombrar los HOC (Higher-Order Components) se recomienda:
- Que comience con la palabra with (estándar de nomeclatura) y seguido palabra de lo que hace, descriptivo
- su extensión del archivo es .js

## Constructor
- Iniciar el estado del componente
- Enlazar eventos
- Setear variables globales

## ComponentWillMount
- Modificar el estado
- No debe realizar llamados a APIS
- No realizar suscripción a eventos

Hasta acá no se muestra componente

## Render (UI Component)
- Debe ser una función pura
- No debe modificar el estado

## ComponentDidMount
- Se puede llamar API's
- Realizar suscripciones a eventos
- Modificar estado

## ComponentWillReceiveProps (nextProps)
- Realizar cambios en los estados basado en las nuevas props

## ComponentWillUnmount
- Dejar de escuchar eventos
- Desuscribirse de un websockets
- Cancelar peticiones HTTP

Realiza limpieza antes de que se desmote

## React Router

### Menú con `NavLink`

NavLink tiene la opción de la clase activo en la URL

## Hooks

Algunos vienen por defecto de react desde la version 16

- useState: Permite usar el estado y poder modificarlo
- useEffect: Se ejecuta cada vez que el componente se renderiza, es decir cuando recibe nuevas props o cambia su estado. Recibe un callback.
