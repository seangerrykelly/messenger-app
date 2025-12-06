import { io, Socket } from 'socket.io-client'
import { useEffect, useState, type FormEvent } from 'react'
import { ChatContainer } from '@/components/ChatContainer'
import { InputMessage } from '@/components/InputMessage'
import { Login } from '@/components/Login'
import { MessageList } from '@/components/MessageList'
import { MessageContainer } from '@/components/MessageContainer'

export type User = {
  id: string;
  name: string;
}

export type Message = {
  text: string;
  date: string;
  user: User;
}

const socket: Socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
})

function App() {
  const [users, setUsers] = useState<Array<User>>([])
  const [currUser, setCurrUser] = useState<User>()
  const [messages, setMessages] = useState<Array<Message>>([])

  useEffect(() => {
    socket.on('connect', handleSocketInitConnect)
    socket.on('connected', handleNewUserConnected)
    socket.on('message', handleUpdateMessages)
    socket.on('disconnected', handleSocketDisconnected)

    // Cleanup to prevent duplicate listeners
    return () => {
      socket.off('connect', handleSocketInitConnect)
      socket.off('connected', handleNewUserConnected)
      socket.off('message', handleUpdateMessages)
      socket.off('disconnected', handleSocketDisconnected)
    }
  }, [])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const loginData = new FormData(event.currentTarget)
    const username = loginData.get('username') as string
    socket.emit('username', username)
    if (socket.id && username) {
      setCurrUser({
        id: socket.id,
        name: username
      })
      // TODO: add user info to local storage so login doesn't appear on refresh
    }
    console.log('username: ', username)
  }

  // Socket event listeners
  const handleSocketInitConnect = () => {
    // TODO: Check if currUser can be found in local/session storage
  }

  const handleSocketDisconnected = (id: string) => {
    setUsers(users => {
      return users.filter(user => user.id !== id)
    })
  }

  const handleNewUserConnected = (user: User) => {
    setUsers(users => [...users, user])
  }

  const handleUpdateMessages = (newMessage: any) => {
    setMessages(messages => [...messages, newMessage]);
  }

  const handleSubmitChatMessage = (messageText: string) => {
    socket.emit('send', messageText)
  }

  if (!currUser) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Login handleSubmitLogin={handleLogin} />
      </div>
    )
  }

  return (
    <>
      <ChatContainer>
        <MessageList>
          {messages.map((message, index) => (
            <MessageContainer
              key={`message-${index}`}
              messageData={message}
              currUser={currUser}
            />
          ))}
        </MessageList>
        <InputMessage handleSubmitMessage={handleSubmitChatMessage} />
      </ChatContainer>
    </>
  )
}

export default App
