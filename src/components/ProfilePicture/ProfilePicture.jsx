import { useEffect, useState } from 'react';
import { getProfilePictureByHandle } from '../../services/users-service';
import PropTypes from 'prop-types';
import './ProfilePicture.css';
import { useNavigate } from 'react-router-dom';

export default function ProfilePicture ({ handle, type, src }) {
    const [profilePictureURL, setProfilePictureURL] = useState(null);
    const defaultPictureURL = 'https://firebasestorage.googleapis.com/v0/b/readit-22759.appspot.com/o/profilePictures%2Fdefault.jpg?alt=media&token=9361446f-e56a-4e40-af34-3d3f1610a3be';
    const navigate = useNavigate();

    //the type prop tells us what the picture is for
    //if it is for a standard post clicking it will take us to the user profile of the author
    const onPictureClick = () => {
        if (type === 'post') navigate(`../../users/${handle}`);
    }

    let size = 100;

    //size of picture determined by what it's for
    if (type === 'post') {
        size = 40;
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
        profilePictureURL ? <img src={profilePictureURL} alt="User's profile picture" width={size} height={size} onClick={onPictureClick}/> : <img src={defaultPictureURL} alt="User's profile picture" width={size} height={size} />
    );
}

ProfilePicture.propTypes = {
    handle: PropTypes.string.isRequired,
    type: PropTypes.string,
    src: PropTypes.string
}
