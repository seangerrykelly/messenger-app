import { Input } from "@/components/ui/input"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

type InputMessageProps = {

}

export const InputMessage = () => {
    const [currMessage, setCurrMessage] = useState<string>('')

    const handleSubmitMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('submitted')
        setCurrMessage('')
    }

    const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrMessage(event.target.value)
    }

    return (
        <form
            className="flex gap-1"
            onSubmit={handleSubmitMessage}>
            <Input 
                type="text" 
                placeholder="Try saying hello"
                value={currMessage}
                onChange={handleChangeMessage}
            />
            <Button type="submit">Send</Button>
        </form>
    )
}