import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, { transports: ['websocket', 'polling'] });
const users = {};
const chats = {};

io.on('connection', client => {
    client.on('getUserList', () => {
        io.emit('users', Object.values(users))
    })

    client.on('username', username => {
        const user = {
            username: username,
            id: client.id
        };
        users[client.id] = user;
        io.emit('connected', user);
        io.emit('users', Object.values(users));
    });

    client.on('send', (message, chat, currUser) => {
        chats[chat.id].messages.push(message);
        io.emit('message', {
            text: message,
            date: new Date().toISOString(),
            user: users[currUser.id],
        });
    });

    client.on('createNewChat', users => {
        const chat = {
            id: crypto.randomUUID(),
            users,
            messages: [],
        }
        chats[chat.id] = chat
        io.emit('newChatCreated', chat)
    })

    // client.on('disconnect', () => {
    //     delete users[client.id];
    //     io.emit('disconnected', client.id);
    // });
});

server.listen(3001);