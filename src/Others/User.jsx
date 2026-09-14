import React, { useEffect, useState } from 'react'
import { Button } from '@blueprintjs/core'

const UserDetails = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("https://bookstore-u3rm.onrender.com/user/get")
      .then((response) => response.json())
      .then((json) => {
        console.log(json, "API response")
        setUsers(json.data || [])  
      })
  }, [])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user._id}>
              <td>{user.Name}</td>
              <td>{user.Email}</td>
              <td>
                <Button intent='danger'>Block</Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserDetails
