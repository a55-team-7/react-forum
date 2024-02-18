import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function Logo() {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const storage = getStorage();
        const storageRef = ref(storage, 'logo/logo.png'); // replace with your image path

        getDownloadURL(storageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            {imageUrl && <img src={imageUrl} alt="logo"  />}
        </div>
    );
}

export default Logo;