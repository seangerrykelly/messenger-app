import type { ReactNode } from "react"

type MessageListProps = {
    children: ReactNode
}

export const MessageList = ({ children }: MessageListProps) => {

    return (
        <div className="flex-1">
            {children}
        </div>
    )
}