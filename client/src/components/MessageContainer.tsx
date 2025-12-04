import type { Message, User } from "@/App"

type MessageProps = {
    messageData: Message
    currUser: User
}

export const MessageContainer = ({ messageData, currUser }: MessageProps) => {
    const isCurrUser = messageData.user.id === currUser.id
    const background = isCurrUser ? 'bg-sidebar-primary' : 'bg-muted-foreground'
    const alignSelf = isCurrUser ? 'self-end' : 'self-start'

    return (
        <div className={`text-primary-foreground rounded px-2 py-1 max-w-2/3 ${background} ${alignSelf}`}>
            {messageData.text}
        </div>
    )
    
}