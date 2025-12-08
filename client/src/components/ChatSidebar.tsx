import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MessageCirclePlus } from "lucide-react"

type ChatSidebarProps = {
    createNewChat: () => void
}

export const ChatSidebar = ({ createNewChat }: ChatSidebarProps) => {
    return (
        <Sidebar>
            <SidebarHeader>
                <Button onClick={createNewChat}>New Chat <MessageCirclePlus /></Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                {/* Avatar goes here with username + button to log out */}
            </SidebarFooter>
        </Sidebar>
    )
}