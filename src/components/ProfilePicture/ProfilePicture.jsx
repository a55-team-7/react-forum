import { Avatar } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { getProfilePictureByHandle } from '../../services/users-service';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function ProfilePicture ({ handle, type, src }) {
    const [profilePictureURL, setProfilePictureURL] = useState(null);
    const defaultPictureURL = 'https://firebasestorage.googleapis.com/v0/b/readit-22759.appspot.com/o/profilePictures%2Fdefault.jpg?alt=media&token=9361446f-e56a-4e40-af34-3d3f1610a3be';
    const navigate = useNavigate();

    const onPictureClick = () => {
        if (type === 'post' || type === 'comment' || type === 'postDetails' || type === 'users') navigate(`/home/users/${handle}`);
    }

    let size = "150px";

    if (type === 'post' || type=== 'comment' || type === 'users') {
        size = "40px";
    }

    if ( type === 'postDetails' ) {
        size = "60px";
    }

    useEffect(() => {
        getProfilePictureByHandle(handle).then(setProfilePictureURL);
    }, [handle]);

    useEffect(() => {
        if (src) {
            setProfilePictureURL(src);
        }
    }, [src]);

    return (
        <Avatar
            src={profilePictureURL || defaultPictureURL}
            alt="User's profile picture"
            boxSize={size}
            onClick={onPictureClick}
        />
    );
}

ProfilePicture.propTypes = {
    handle: PropTypes.string.isRequired,
    type: PropTypes.string,
    src: PropTypes.string
}