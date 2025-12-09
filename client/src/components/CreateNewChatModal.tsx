import type { User } from "@/App"
import { useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"


type CreateNewChatModalProps = {
    currUser: User
    onClickCreateChat: (selectedUsers: Array<User>) => void
    isNewChatModalOpen: boolean
    userList: Array<User>
}

export const CreateNewChatModal = ({ currUser, onClickCreateChat, isNewChatModalOpen, userList }: CreateNewChatModalProps) => {
    const [selectedUsers, setSelectedUsers] = useState<Array<User>>([])

    const onUserSelected = (checked: boolean, user: User) => {
        if (checked) {
            setSelectedUsers(selectedUsers => [...selectedUsers, user])
        } else {
            setSelectedUsers(selectedUsers => {
                return selectedUsers.filter(selectedUser => selectedUser.id !== user.id)
            })
        }
    }

    const onClickCreateChatButton = () => {
        onClickCreateChat(selectedUsers)
        setSelectedUsers([])
    }
    
    return (
        <Dialog open={isNewChatModalOpen}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Search for the name of the user you want to message
                </DialogDescription>
                <div>
                    {userList.filter(user => user.id !== currUser.id).map((user, index) => (
                        <Label className="hover:bg-accent flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-chart-1">
                            <Checkbox 
                                id={`user-checkbox-${index}`}
                                onCheckedChange={(checked: boolean) => onUserSelected(checked, user)}
                            />
                            {user.username}
                        </Label>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={onClickCreateChatButton}>Create Chat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}