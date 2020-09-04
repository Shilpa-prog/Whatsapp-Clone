import React from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import useLocalStorage from '../hooks/useLocalStorage'
import { SocketProvider } from '../contexts/SocketContext'
import { ContactsProvider } from '../contexts/ContactsContext'
import { ConversationsProvider } from '../contexts/ConversationsContext'

export default function App() {
  const [id, setId] = useLocalStorage('id', '')

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )

  return id ? dashboard : <Login onIdSubmit={setId} />
}