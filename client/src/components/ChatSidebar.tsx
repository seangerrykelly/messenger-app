import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MessageCirclePlus } from "lucide-react"
import type { Chat, User } from "@/App"

type ChatSidebarProps = {
    createNewChat: (isOpen: boolean) => void
    chats: Array<Chat>
    currUser: User
}

export const ChatSidebar = ({ createNewChat, chats, currUser }: ChatSidebarProps) => {

    const renderOpenChatButton = (chat: Chat) => {
        const usersInChat = chat.users.filter(user => user.id !== currUser.id)
        const usernames = usersInChat.map(user => user.username).join(' ,')

        return (
            <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton asChild>
                    <Button>{usernames}</Button>
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
                            {chats.map((chat, index) => renderOpenChatButton(chat))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* Avatar goes here with username + button to log out */}
            </SidebarFooter>
        </Sidebar>
    )
}