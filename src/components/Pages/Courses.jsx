import React, { Component } from 'react'
import axios from 'axios'
import CourseGrid from '../Organisms/CourseGrid'

class Courses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      responseCourses: [],
    }
  }

  componentDidMount() {
    axios.get('http://my-json-server.typicode.com/LidiaRamirez/json-cursos/cursos')
    .then(response => {
      this.setState({ responseCourses: response.data })
    })
  }

  render() {
    const { responseCourses } = this.state
    return <CourseGrid courses = { responseCourses } />
  }
} 

export default Courses