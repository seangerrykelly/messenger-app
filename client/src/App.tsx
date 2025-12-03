import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

const username = prompt('What is your username?')
const socket: Socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
})

function App() {
  const [users, setUsers] = useState<Array<any>>([])
  const [currUser, setCurrUser] = useState()
  const [messages, setMessages] = useState<Array<any>>([])

  useEffect(() => {
    console.log('user list: ', users)
  }, [users])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('username', username)
    })

    socket.on('users', userList => {
      setUsers(userList)
    })


  }, [])

  return (
    <>
      what up
    </>
  )
}

export default App
