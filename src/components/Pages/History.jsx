import React from 'react'

const History = ( { match, location, history }) => (
  <div>    
    <div>{ JSON.stringify(match) }</div>
    <div>{ JSON.stringify(location) }</div>
    <div>{ JSON.stringify(history) }</div>
  </div>
)

export default History