'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api'; // your axios instance

export default function AllUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await api.get('/users');
                console.log(allUsers.data.Users);
                setUsers(allUsers.data.Users);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='flex items-center justify-center'>
            <div className="bg-blue-200 p-4 m-5 rounded">

                <h1 className="text-dark-300 text-xl">All Users</h1>
                {users.map((user: any) => (
                    <p key={user.id}>
                        <br />
                        <h1>First Name: {user.first_name}</h1>
                        <h1>last Name: {user.last_name}</h1>
                        <h1>Email: {user.email}</h1>
                        <h1>Gender: {user.gender}</h1>
                        <h1>Age: {user.age}</h1>
                    </p>
                ))}
            </div>
        </div>
    );
}
