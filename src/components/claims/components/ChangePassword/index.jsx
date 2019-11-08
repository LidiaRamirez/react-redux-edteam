import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import '../../styles.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  render() {
   return(
     <div>
       <div className="claims-rrgg-user-content">      
        <Form className="change-password-form">
          <Form.Item>
            <Input
              size="large"
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Input
              size="large"
              placeholder="Confirmar contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Input
              size="large"
              placeholder="Nombres"
            />
          </Form.Item>
          <Form.Item>
            <Input 
              size="large"
              placeholder="Apellidos"
            />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              loading={this.state.loading}
              className="change-password-button"
              type="primary">
              Enviar
            </Button>
          </Form.Item>
        </Form>
       </div>
     </div>
   )
 }
}

export default ChangePassword