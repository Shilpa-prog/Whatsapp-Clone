import React, { useContext, useState, useCallback, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketContext'
import { useContacts } from './ContactsContext'

const ConversationsContext = React.createContext()

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
  const socket = useSocket()
  const { contacts } = useContacts()
  const [conversations, setConversations] = useLocalStorage('conversations', [])
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
  const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
    setConversations(prevConversations => {
      let madeChange = false
      const newMessage = { sender, text }
      const newConversations = prevConversations.map(conversation => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true
          return { ...conversation, messages: [...conversation.messages, newMessage] }
        }

        return conversation
      })

      if (madeChange === false) {
        return [...prevConversations, { recipients, messages: [newMessage] }]
      } else {
        return newConversations
      }

    })
  }, [setConversations])

  useEffect(() => {
    if (socket == null) return
    socket.on('receive-message', addMessageToConversation)

    return () => { socket.off('receive-message') }
  }, [socket, addMessageToConversation])

  function sendMessage(recipients, text) {
    socket.emit('send-message', { recipients, text })
    
    addMessageToConversation({ recipients, text, sender: id })
  }

  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages: [] }]
    })

    setSelectedConversationIndex(conversations.length)
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map(recipient => {
      const contact = contacts.find(contact => contact.id === recipient)
      const name = (contact && contact.name) || recipient
      return { id: recipient, name }
    })
    const messages = conversation.messages.map(message => {
      const contact = contacts.find(contact => contact.id === message.sender)
      const name = (contact && contact.name) || message.sender
      const fromMe = id === message.sender
      return { ...message, senderName: name, fromMe }
    })
    const selected = index === selectedConversationIndex
    return { ...conversation, recipients, messages, selected }
  })

  const value = {
    sendMessage,
    createConversation,
    selectedConversation: formattedConversations[selectedConversationIndex],
    selectConversationIndex: setSelectedConversationIndex,
    conversations: formattedConversations
  }

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((element, index) => {
    return element === b[index]
  })
}