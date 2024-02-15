import { useEffect, useState } from 'react';
import { getProfilePictureByHandle } from '../../services/users-service';
import './ProfilePicture.css';

export default function ProfilePicture ({ handle }) {
    const [profilePictureURL, setProfilePictureURL] = useState(null);
    const defaultPictureURL = 'https://firebasestorage.googleapis.com/v0/b/readit-22759.appspot.com/o/profilePictures%2Fdefault.jpg?alt=media&token=9361446f-e56a-4e40-af34-3d3f1610a3be';

    useEffect(() => {
        getProfilePictureByHandle(handle).then(setProfilePictureURL);
    }, [handle]);

    return (
        profilePictureURL ? <img src={profilePictureURL} alt="User's profile picture" width="100" height="100" /> : <img src={defaultPictureURL} alt="User's profile picture" width="100" height="100" />
    );
}
