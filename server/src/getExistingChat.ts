import { User, Chat } from "./server";

export function getExistingChat(users: User[], chats: Chat[]) {
    for (let i = 0; i < chats.length; i++) {
        const currChat = chats[i]
        if (currChat.users.length === users.length) {
            // Compare the users lists here
            let isMatch = true
            const userIds = new Set(users.map(user => user.id))
            const userIdsInChat = new Set(currChat.users.map(user => user.id))
            
            for (const userId in userIds) {
                if (!userIdsInChat.has(userId)) {
                    isMatch = false
                    break
                }
            }
            if (isMatch) {
                console.log('chat already exists')
                return currChat
            }
        }
    }
    return undefined
}