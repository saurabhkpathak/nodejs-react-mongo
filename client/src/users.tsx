import React, { useEffect, useState } from 'react';

export const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getUsers = () => {
        fetchUsers().then((response: any[]) => {
            setUsers(response);
        }).catch(() => {
            setUsers([]);
        }).finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getUsers();
    }, []);
    return isLoading ? <div>Loading...</div> : <>{users.length === 0 ? 'Fetching failed' : usersList(users)}</>;
};

const fetchUsers = async () => {
    const users = await fetch('https://api.github.com/users');
    return users.json();
};

const usersList = (users: any[]) => users.map((user: any) => <div>github users list<span>{user.login}</span><img src={user.avatar_url} alt='user pic' /></div>);