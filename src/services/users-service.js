import { get, set, ref, query, equalTo, orderByChild, update, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../config/firebase-setup.js";

//(hande='pesho') - give me everything which pesho contains
export const getUserByHandle = async (handle) => { //search a user by email or name for example?
  const snapshot = await get(ref(db, `users/${handle}`)); //we use references to access data in the database / it points to it

  if (!snapshot.exists()) {
    return null;
  }

  const user = {
    handle,
    ...snapshot.val(),
    createdOn: new Date(snapshot.val().createdOn).toString(),
  };

  return user;
}

//we want to add value to the handle object , which is in the users object in this case
export const createUserHandle = (handle, uid, email, firstName, lastName) => {
  return set(ref(db, `users/${handle}`), // we are using this function write or set data to a defined path in the database
    {                                              //null objects may be ignored
      handle, uid, email, firstName, lastName, createdOn: new Date().valueOf(), likedTweets: {} //here we are creating the user object with the handle, uid, email, createdOn and likedTweets
      //and sending it to the database in the required path
    }
  );
}

//query returns a query object that can be used to read data from the database as it 
//can chain multiple methods to filter the data and return the results
export const getUserData = async (uid) => {  //retrieve data for a single user by his id
  const userRef = (query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return await get(userRef); // we are getting the query object we received
}

//make someone admin 
export const makeUserAdmin = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef,
    { isAdmin: true });
};

//an example function that will allow admin actions (a test for now)
export const performAdminAction = async (userId, db) => {
  const userRef = ref(db, `users/${userId}`);
  const snapshot = await get(userRef);
  if (snapshot.val().isAdmin) {
    // Perform the admin action
  } else {
    // Deny the action
  }
};

//remove admin rights
// export const removeAdminRights = async (uid) => {
//   const userRef = ref(db, `users/${uid}`);
//   await update(userRef, { isAdmin: false });
// };

//remove yours, or someone else's account
export const deleteAccount = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  await remove(userRef);
};


//block a user
export const blockUser = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { isBlocked: true });
};

//unblock a user
export const unblockUser = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { isBlocked: false });
};

//upload profile picture by user handle
export const uploadProfilePictureByHandle = async (handle, file, setStatus) => {
  const storage = getStorage();
  const profilePictureStorageRef = storageRef(storage, 'profilePictures/' + handle + '.jpg');

  let contentType;
  switch (file.name.split('.').pop()) {
    case 'png':
      contentType = 'image/png';
      break;
    case 'jpg':
    case 'jpeg':
      contentType = 'image/jpeg';
      break;
    default:
      contentType = 'application/octet-stream'; // Fallback to binary data
  }

  const metadata = {
    contentType
  };

  const uploadTask = uploadBytesResumable(profilePictureStorageRef, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const status = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setStatus('Upload is ' + status + '% done');
      },
      (error) => {
        console.log('Upload failed', error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

export const getProfilePictureByHandle = async (handle) => {
  const storage = getStorage();
  const profilePictureStorageRef = storageRef(storage, 'profilePictures/' + handle + '.jpg');
  let url;
  try {
    url = await getDownloadURL(profilePictureStorageRef);
  } catch (error) {
    console.log('error getting profile pic');
  }

  return url;
}

export const updateUserByHandle = async (handle, updatedUser) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, {
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    isBlocked: updatedUser.isBlocked,
  });
}


// var spaceRef = imagesRef.child('space.jpg');

