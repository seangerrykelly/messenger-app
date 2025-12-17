import { io, Socket } from 'socket.io-client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ChatContainer } from '@/components/ChatContainer'
import { ChatSidebar } from '@/components/ChatSidebar'
import { CreateNewChatModal } from '@/components/CreateNewChatModal'
import { InputMessage } from '@/components/InputMessage'
import { Login } from '@/components/Login'
import { MessageList } from '@/components/MessageList'
import { MessageContainer } from '@/components/MessageContainer'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'

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

  // Initialize user from local storage if it exists. Otherwise show login
  const [currUser, setCurrUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem('currUser')
    return storedUser ? JSON.parse(storedUser) : undefined
  })

  const [currChat, setCurrChat] = useState<Chat | undefined>()
  const [chats, setChats] = useState<Array<Chat>>([])

  const currChatRef = useRef<Chat | undefined>(undefined)
  const chatListRef = useRef<Array<Chat>>([])

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState<boolean>(false)

  useEffect(() => {
    socket.on('connect', handleSocketInitConnect)
    socket.on('connected', handleNewUserConnected)
    socket.on('users', handleUpdateUsers)
    socket.on('message', handleUpdateMessages)
    socket.on('disconnected', handleSocketDisconnected)
    socket.on('newChatCreated', handleNewChatCreated)
    socket.on('openExistingChat', handleOpenChat)
    socket.on('updateChats', handleUpdateChats)

    // Cleanup to prevent duplicate listeners
    return () => {
      socket.off('connect', handleSocketInitConnect)
      socket.off('connected', handleNewUserConnected)
      socket.off('users', handleUpdateUsers)
      socket.off('message', handleUpdateMessages)
      socket.off('disconnected', handleSocketDisconnected)
      socket.off('newChatCreated', handleNewChatCreated)
      socket.off('openExistingChat', handleOpenChat)
      socket.off('updateChats', handleUpdateChats)
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

  const handleUpdateMessages = (chat: Chat) => {
    console.log('new chat: ', chat)
    console.log('currChatRef: ', currChatRef.current)
    if (currChatRef.current?.id === chat.id) {
      console.log('updating messages in chat')
      setCurrChat(chat);
    }
  }

  const handleUpdateChats = (chatList: Array<Chat>) => {
    setChats(chatList)
    chatListRef.current = chatList
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

  // Only go here if the chat doesn't exist already
  const handleNewChatCreated = (chat: Chat) => {
    console.log('chat: ', chat)
    const newChatList = [...chats, chat]
    setChats(newChatList)
    chatListRef.current = newChatList
  }

  // Go here if the chat exists already
  const handleOpenChat = (chat: Chat) => {
    // TODO: fix bug here where chat opens on all clients instead of just currUser's
    setCurrChat(chatListRef.current.find(c => c.id === chat.id))
    currChatRef.current = chat
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
        currChat={currChat}
      />
      <SidebarTrigger />
      <CreateNewChatModal 
        currUser={currUser}
        onClickCreateChat={createNewChat}
        isNewChatModalOpen={isNewChatModalOpen} 
        userList={users}
      />
      {currChat && (
        <ChatContainer>
          <MessageList>
            {currChat.messages.map((message, index) => (
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
