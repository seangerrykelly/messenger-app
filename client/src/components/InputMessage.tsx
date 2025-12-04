import { Input } from "@/components/ui/input"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

type InputMessageProps = {
    handleSubmitMessage: (messageText: string) => void
}

export const InputMessage = ({ handleSubmitMessage }: InputMessageProps) => {
    const [currMessage, setCurrMessage] = useState<string>('')

    const onSubmitMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const inputMessageData = new FormData(event.currentTarget)
        const messageText = inputMessageData.get('currMessage') as string
        handleSubmitMessage(messageText)
        setCurrMessage('')
    }

    const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrMessage(event.target.value)
    }

    return (
        <form
            className="flex gap-1"
            onSubmit={onSubmitMessage}>
            <Input 
                type="text"
                name="currMessage"
                id="currMessage"
                placeholder="Try saying hello"
                value={currMessage}
                onChange={handleChangeMessage}
            />
            <Button type="submit">Send</Button>
        </form>
    )
}