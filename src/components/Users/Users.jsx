import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users-service";
import PropTypes from 'prop-types';
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { Box, Grid, Text } from "@chakra-ui/react";


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

    const colors = ['rgb(255, 25, 52)', 'rgb(255, 0, 54)', 'rgb(128, 0, 128)', 'rgb(204, 204, 0)', 'rgb(0, 153, 0)'];

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
      };

    return (
        <Box borderRadius="md" boxShadow="1g" w="1200px" ml='100px'>
        <Grid templateColumns="1fr 1fr 1fr 1fr"  h="25vh">
            {filteredUsers.map((user, index) => (
                <Box key={index} id="user-data" display="flex" alignItems="center" >
                    <ProfilePicture handle={user.handle} type='users'/>
                    <Text as="h4" ml='25px' fontSize="17px" fontWeight="700" isTruncated maxWidth="200px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" color={getRandomColor()}>{`${user.firstName}${user.lastName} `} </Text>
                </Box>
            ))}
        </Grid>
    </Box>
    );
};

Users.propTypes = {
    search: PropTypes.string
};