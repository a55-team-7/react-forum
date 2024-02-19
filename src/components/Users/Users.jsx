import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users-service";
import PropTypes from 'prop-types';
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { Box, Grid } from "@chakra-ui/react";


export const Users = ({ search }) => {

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
        <Box h="100vh">
            {filteredUsers.map((user, index) => (
                <div key={index} id="user-data">
                    <h2>{`${user.firstName}${user.lastName} `} </h2>
                    <p>{user.email}</p>
                    <ProfilePicture handle={user.handle} type='users' />
                    {/* Render other user properties as needed */}
                </div>
            ))}
        </Box>
    );
};

Users.propTypes = {
    search: PropTypes.string
};