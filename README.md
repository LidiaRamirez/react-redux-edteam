# REACT - REDUX

## Redux

Es una librería javascript que implementa arquitectura de datos, como evolución y mejora de las ideas de Flux.

## Conceptos Iniciales

### Store
Es el estado global.
Objeto que contiene todos los datos que la aplicación que se va a manejar. Almacén de la data de la aplicación. Puede ser consultada por cualquier componente

### Action
Definen una 'API interna' para la app y son la forma de interactuar con la app.
Objetos simples que contiene una identificación y la data necesaria para ejecutarse.
Debe de tener una propiedad type,
normalmente son definidos como strings constantes.
~~~
{
  type: "tipo de accion'
  data: datos
}
~~~

~~~
export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}
~~~
### Dispatcher

Función que despacha las acciones para que el store sea modificado.

~~~
store.dispatch({ accion })
~~~

### View
Es lo que el usuario ve. La vista cambia si el estado cambia.

## Conceptos adicionales

### Initial Store
Objeto como va empezar el store. Ejm:
~~~
const initialState = {
  user: {
    error: null,
    email: null
  },
  products: {
    list: [],
    loading: true,
    error: null
  },
  currentProduct: {
    product: null,
    loading: true,
    error: null
  },
  cart: {
    items: [],
    total: 0
  }
};
~~~

### Reducers

Función encargada de modificar el store, entonces sus parametros que recibe es estado y la acción que va a ejecutar. Retorna el nuevo estado.

~~~
reducer(state, action)
~~~

### CreateStore

Función que crea un store de Redux que mantiene el árbol de estado de la aplicación.

~~~
createStore(reducer, initialState) 
~~~

### Provider

Todos los componentes contenedores necesitan acceso al store Redux para que puedan suscribirse a ella. Una opción sería pasarlo como un prop a cada componente, pero lo más óptimo es usar `Provider` (proveedor) para que el store esté **disponible** para todos los componentes del contenedor en la aplicación sin pasarlo explícitamente. Sólo es necesario utilizarlo una vez al renderizar el componente raíz

### Connect
Permite conectar el store con los componentes.
Para usar connect(), es necesario definir una función especial llamada mapStateToProps

#### mapStateToProps
Mapear el estado global de la aplicación y pasarle al componente de presentación lo que necesite por props (propiedades)

~~~
const mapStateToProps = state => ({
  props : state.props
})
~~~

#### mapDispatchToProps
Recibe el método dispatch() y devuelve los callback props que se desea inyectar en el componente de presentación. 

## Agregar a proyecto `redux` y `react-redux`
~~~
yarn add redux react-redux
~~~

## Pasos para utilizar para implementar con redux

1. Crear estado e iniciarlo, crear el reducer que es el único que puede manejar y modificar el estado. Aplicar el createStore.

2. Encapsular la aplicación con el componente Provider de react-redux que recibe el único parámetro store

~~~
const App = () => (
  <Provider store={store}>
    <AppRoute />
  </Provider>
)
~~~

3. Definir que componentes van a acceder a Store, ya que no todos lo van a necesitar. Para hacer eso necesitamos conectar nuestros componentes a Redux, esto se logra con connect.

> Referencias  
[Documentación redux](https://es.redux.js.org/)  
[Curso: React - Manejo del estado de la aplicación ](https://ed.team/cursos/react-state)


