import React, { useRef } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { Form, Button, Container } from 'react-bootstrap'

export default function Login({ onIdSubmit }) {
  const idRef = useRef()

  function createNewId() {
    onIdSubmit(uuidV4())
  }
  
  function handleSubmit(e) {
    e.preventDefault()
    onIdSubmit(idRef.current.value)
  }

  return (
    <Container className="align-items-center d-flex" style={{ height: '100vh' }}>
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group>
          <Form.Label>Enter Your Id</Form.Label>
          <Form.Control type="text" ref={idRef} required />
        </Form.Group>
        <Button type="submit" variant="primary" className="mr-2">Login</Button>
        <Button variant="secondary" onClick={createNewId}>Create A New Id</Button>
      </Form>
    </Container>
  )
}
