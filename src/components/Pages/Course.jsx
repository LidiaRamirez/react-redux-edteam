import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Course = ({ match }) => {
  const [course, setCourse] = useState({})
  const [comment, setComment] = useState('Sin comentarios')


  useEffect(() => {
    axios.get(`http://my-json-server.typicode.com/LidiaRamirez/json-cursos/cursos/${match.params.id}`)
    .then(response => setCourse( response.data ))
  }, [])

  const myComment = e => {
    setComment(e.target.value)
  }
  
  return (
    <div className="ed-grid m-grid-3">
      {
        course 
        ? (
            <div className="ed-grid">
              <div>
                <h1 className="m-cols-3"> { course.title } </h1>
                <img className="m-cols-1" src= { course.image } alt={ course.title }/>
                <p className="m-cols-2">Profesor: { course.teacher }</p>
              </div>
              <div className="ed-grid">
                <h2>Escribe tu comentario</h2>
                <input type="text" placeholder="Escribe..." onChange={myComment.bind(this)}/>
                <p>{ comment }</p>
              </div>
            </div>
          ) 
        : <h1>El curso no existe</h1>
      }
      
    </div>
  )
}

export default Course