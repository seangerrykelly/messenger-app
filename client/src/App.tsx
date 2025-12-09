import { io, Socket } from 'socket.io-client'
import { useEffect, useState, type FormEvent } from 'react'
import { ChatContainer } from '@/components/ChatContainer'
import { ChatSidebar } from '@/components/ChatSidebar'
import { CreateNewChatModal } from '@/components/CreateNewChatModal'
import { InputMessage } from '@/components/InputMessage'
import { Login } from '@/components/Login'
import { MessageList } from '@/components/MessageList'
import { MessageContainer } from '@/components/MessageContainer'
import { SidebarProvider } from './components/ui/sidebar'

export type User = {
  id: string;
  username: string;
}

export type Message = {
  text: string;
  date: string;
  user: User;
}

export type Chat = {
  id: string
  users: Array<User>
  messages: Array<Message>
}

const socket: Socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
})

function App() {
  const [users, setUsers] = useState<Array<User>>([])
  const [messages, setMessages] = useState<Array<Message>>([])

  // Initialize user from local storage if it exists. Otherwise show login
  const [currUser, setCurrUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem('currUser')
    return storedUser ? JSON.parse(storedUser) : undefined
  })

  const [currChat, setCurrChat] = useState<Chat | undefined>()
  const [chats, setChats] = useState<Array<Chat>>([])

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState<boolean>(false)

  useEffect(() => {
    socket.on('connect', handleSocketInitConnect)
    socket.on('connected', handleNewUserConnected)
    socket.on('users', handleUpdateUsers)
    socket.on('message', handleUpdateMessages)
    socket.on('disconnected', handleSocketDisconnected)
    socket.on('newChatCreated', handleNewChatCreated)

    // Cleanup to prevent duplicate listeners
    return () => {
      socket.off('connect', handleSocketInitConnect)
      socket.off('connected', handleNewUserConnected)
      socket.off('users', handleUpdateUsers)
      socket.off('message', handleUpdateMessages)
      socket.off('disconnected', handleSocketDisconnected)
      socket.off('newChatCreated', handleNewChatCreated)
    }
  }, [])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const loginData = new FormData(event.currentTarget)
    const username = loginData.get('username') as string
    socket.emit('username', username)
    if (socket.id && username) {
      const user: User = {
        id: socket.id,
        username: username,
      }
      setCurrUser(user)
      localStorage.setItem('currUser', JSON.stringify(user))
    }
  }

  // Socket event listeners
  const handleSocketInitConnect = () => {
    // TODO: Check if socket is working and add error state if it isn't
    socket.emit('getUserList')
  }

  const handleSocketDisconnected = (id: string) => {
    setUsers(users => {
      return users.filter(user => user.id !== id)
    })
  }

  const handleUpdateUsers = (userList: Array<User>) => {
    console.log('userList: ', userList)
    setUsers(userList)
  }

  const handleNewUserConnected = (user: User) => {
    // setUsers(users => [...users, user])
  }

  const handleUpdateMessages = (newMessage: any) => {
    setMessages(messages => [...messages, newMessage]);
  }

  const handleSubmitChatMessage = (messageText: string) => {
    socket.emit('send', messageText, currChat, currUser)
  }

  const toggleOpenCreateNewChatModal = (isOpen: boolean) => {
    setIsNewChatModalOpen(isOpen)
  }

  const createNewChat = (selectedUsers: Array<User>) => {
    toggleOpenCreateNewChatModal(false)
    console.log('create new chat between curr: ', currUser?.username, 'and ', selectedUsers.at(0)!.username)
    socket.emit('createNewChat', [...selectedUsers, currUser])
  }

  const handleNewChatCreated = (chat: Chat) => {
    console.log('chat: ', chat)
    setChats(chats => [...chats, chat])
    // TODO: update list of chats and show them in the sidebar list
  }

  const handleOpenChat = (chat: Chat) => {
      console.log('open chat: ', chat)
      setCurrChat(chat)
  }

  if (!currUser) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Login handleSubmitLogin={handleLogin} />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <ChatSidebar 
        createNewChat={toggleOpenCreateNewChatModal} 
        onClickOpenChat={handleOpenChat}
        chats={chats}
        currUser={currUser}
      />
      <CreateNewChatModal 
        currUser={currUser}
        onClickCreateChat={createNewChat}
        isNewChatModalOpen={isNewChatModalOpen} 
        userList={users}
      />
      {currChat && (
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
      )}
    </SidebarProvider>
  )
}

export default App
