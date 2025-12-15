import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { MessageCirclePlus } from "lucide-react"
import type { Chat, User } from "@/App"

type ChatSidebarProps = {
    createNewChat: (isOpen: boolean) => void
    onClickOpenChat: (chat: Chat) => void
    chats: Array<Chat>
    currUser: User
    currChat: Chat | undefined
}

export const ChatSidebar = ({ createNewChat, onClickOpenChat, chats, currUser, currChat }: ChatSidebarProps) => {

    const renderOpenChatButton = (chat: Chat) => {
        const usersInChat = chat.users.filter(user => user.id !== currUser.id)
        const usernames = usersInChat.map(user => user.username).join(', ')
        let lastMessageInChat = "Empty chat"
        
        if (chat.messages.at(-1)?.text) {
            lastMessageInChat = chat.messages.at(-1)?.user.username + ': ' + chat.messages.at(-1)?.text
        }

        return (
            <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton asChild>
                    <div 
                        className={`flex h-full border ${currChat && chat.id === currChat.id ? 'bg-chart-1': 'bg-background'} hover:bg-accent pointer-events-auto`}
                        onClick={() => onClickOpenChat(chat)}
                    >
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-bold text-xl">{usernames}</p>
                            <p className="font-light text-xs">{lastMessageInChat}</p>
                        </div>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <Button onClick={() => createNewChat(true)}>New Chat <MessageCirclePlus /></Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {chats.length > 0
                        ?
                        (<SidebarGroupLabel>Chats</SidebarGroupLabel>)
                        :
                        (<SidebarGroupLabel>Empty</SidebarGroupLabel>)
                    }
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {chats.filter(chat => chat.users.some(user => user.id === currUser.id)).map((chat) => renderOpenChatButton(chat))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <p>{currUser.username}</p>
            </SidebarFooter>
        </Sidebar>
    )
}