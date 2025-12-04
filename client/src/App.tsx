import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { ChatContainer } from '@/components/ChatContainer'
import { InputMessage } from '@/components/InputMessage'
import { MessageList } from '@/components/MessageList'
import { MessageContainer } from './components/MessageContainer'

// const username = prompt('What is your username?')


const socket: Socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
})


export type User = {
  id: string;
  name: string;
}

export type Message = {
  text: string;
  date: string;
  user: User;
}

function App() {
  const [users, setUsers] = useState<Array<User>>([])
  const [currUser, setCurrUser] = useState<User>()
  const [messages, setMessages] = useState<Array<Message>>([])

  useEffect(() => {
    console.log('user list: ', users)
    console.log('message list: ', messages)
  }, [users, messages])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('username', 'username')
    })

    socket.on('users', userList => {
      setUsers(userList)
    })

    socket.on('message', handleUpdateMessages)

    // Cleanup to prevent duplicate listeners
    return () => {
      socket.off('message', handleUpdateMessages)
    }
  }, [])

  const handleUpdateMessages = (newMessage: any) => {
    setMessages(messages => [...messages, newMessage]);
  }

  const handleSubmitChatMessage = (messageText: string) => {
    socket.emit('send', messageText)
  }

  return (
    <>
      <ChatContainer>
        <MessageList>
          {messages.map((message, index) => (
            <MessageContainer 
              messageData={message} 
            />
          ))}
        </MessageList>
        <InputMessage handleSubmitMessage={handleSubmitChatMessage} />
      </ChatContainer>
    </>
  )
}

export default App
