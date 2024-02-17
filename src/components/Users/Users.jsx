import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users-service";
import PropTypes from 'prop-types';



export const Users = ({search}) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers()
            .then(users => {
                console.log(users); // Add this line to log the users
                setUsers(users);
            })
            .catch(console.error)
    }, [search]); // refetch when search changes

    const filteredUsers = users && users.filter(user =>
        (user.handle && user.handle.toLowerCase().includes(search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
        (user.displayName && user.displayName.toLowerCase().includes(search.toLowerCase())) ||
        (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase()))
    );
    
    return (
        <>
        {filteredUsers.map(user => (
            <div key={user.id} id="user-data">
                <h2>{`${user.firstName}${user.lastName} `} </h2> 
                <p>{user.email}</p>
                {/* Render other user properties as needed */}
            </div>
        ))}
    </>
    );
};

Users.propTypes = {
    search: PropTypes.string
};