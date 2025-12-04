import type { ReactNode } from "react"

type ChatContainerProps = {
    children: ReactNode
}

export const ChatContainer = ({ children }: ChatContainerProps) => {
    return (
        <div className="flex flex-col w-screen h-screen p-2">
            {children}
        </div>
    )
}