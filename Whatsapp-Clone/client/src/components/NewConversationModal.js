import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsContext'
import { useContacts } from '../contexts/ContactsContext'

export default function NewConversationModal({ closeModal }) {
  const { contacts } = useContacts()
  const { createConversation } = useConversations()
  const [selectedContactIds, setSelectedContactIds] = useState([])

  function handleSubmit(e) {
    e.preventDefault()

    createConversation(selectedContactIds)
    closeModal()
  }

  function handleCheckboxChange(id) {
    setSelectedContactIds(prevSelectedContactIds => {
      if (prevSelectedContactIds.includes(id)) {
        return prevSelectedContactIds.filter(prevId => id === prevId)
      } else {
        return [...prevSelectedContactIds, id]
      }
    })
  }

  return (
    <>
      <Modal.Header closeButton>
        Create Conversation
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map(contact => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                value={selectedContactIds.includes(contact.id)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  )
}
