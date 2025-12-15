import { createServer } from 'http'
import { Server } from 'socket.io'
import { getExistingChat } from './getExistingChat'

export type User = {
    username: string
    id: string
}

export type Message = {
    text: string
    date: string
    user: User
}

export type Chat = {
    id: string
    users: User[]
    messages: Message[]
}

const server = createServer()
const io = new Server(server, { transports: ['websocket', 'polling'] })

const users: Record<string, User> = {}
const chats: Record<string, Chat> = {}

io.on('connection', client => {
    client.on('getUserList', () => {
        io.emit('users', Object.values(users))
        io.emit('updateChats', Object.values(chats))
    })

    client.on('username', username => {
        const user: User = {
            username: username,
            id: client.id
        }
        users[client.id] = user
        io.emit('connected', user)
        io.emit('users', Object.values(users))
    })

    client.on('send', (messageText, chat, currUser) => {
        chats[chat.id].messages.push({
            text: messageText,
            date: new Date().toISOString(),
            user: users[currUser.id]
        })
        io.emit('message', chats[chat.id])
        io.emit('updateChats', Object.values(chats))
    })

    client.on('createNewChat', selectedUsers => {
        const existingChat = getExistingChat(selectedUsers, Object.values(chats))
        if (!existingChat) {
            const chat: Chat = {
                id: crypto.randomUUID(),
                users: selectedUsers,
                messages: [],
            }
            chats[chat.id] = chat
            io.emit('newChatCreated', chat)
        } else {
            io.emit('openExistingChat', existingChat)
        }
    })

    // client.on('disconnect', () => {
    //     delete users[client.id]
    //     io.emit('disconnected', client.id)
    // })
})

server.listen(3001)