import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { User } from "@/App"
import { useState } from "react"

type CreateNewChatModalProps = {
    isNewChatModalOpen: boolean
    userList: Array<User>
}

export const CreateNewChatModal = ({ isNewChatModalOpen, userList }: CreateNewChatModalProps) => {
    const [selectedUsers, setSelectedUsers] = useState<Array<User>>([])
    
    return (
        <Dialog open={isNewChatModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Search for the name of the user you want to message
                </DialogDescription>
                <DialogFooter>
                    <Button>Create Chat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}