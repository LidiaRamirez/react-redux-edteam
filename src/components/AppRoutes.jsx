import React from 'react'
import Form from "./Pages/Form";
import Courses from "./Pages/Courses";
import Course from './Pages/Course';
import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';
import MainMenu from './Organisms/MainMenu';
import History from './Pages/History';
import Home from './Pages/Home';
import Users from './Pages/Users'

const AppRoute = () => (
  <Router>
    <MainMenu />
    <Switch>
      <Route path="/" exact component={ Home } />
      <Route path="/cursos/:id" exact component={ Course } />
      <Route path="/cursos" exact component={ Courses } />
      <Route path="/historial/:valor" component = { History } />
      <Route path="/historial" component = { History } />
      <Route path="/usuarios" component = { Users } />
      <Route path="/formulario" exact component={ () => <Form name="pruebaaaaaaa"/> } />
      <Route component={ () => (
        <div className="ed-grid">
          <h1>Error 404</h1>
          <span>Página no encontrada</span>
        </div>
      ) } />
    </Switch>    
  </Router>
)

export default AppRoute