import type { Message } from "@/App"

type MessageProps = {
    messageData: Message
}

export const MessageContainer = ({ messageData }: MessageProps) => {
    return (
        <div>
            {messageData.text}
        </div>
    )
    
}