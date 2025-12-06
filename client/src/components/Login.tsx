import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { FormEvent } from "react"
import { Button } from "./ui/button"

type LoginProps = {
    handleSubmitLogin: (event: FormEvent<HTMLFormElement>) => void
}

export const Login = ({ handleSubmitLogin }: LoginProps) => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">
                    Welcome!
                </CardTitle>
                <CardDescription>
                    Please enter a username to begin chatting
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    className="grid gap-2"
                    onSubmit={handleSubmitLogin}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                            id="username" 
                            name="username" 
                            type="text"
                            placeholder="JoeSchmoe"
                            required
                        />
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </CardContent>
        </Card>
    )
}