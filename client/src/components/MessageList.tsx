import type { ReactNode } from "react"

type MessageListProps = {
    children: ReactNode
}

export const MessageList = ({ children }: MessageListProps) => {

    return (
        <div className="flex flex-1 flex-col gap-2 overflow-y-scroll">
            {children}
        </div>
    )
}