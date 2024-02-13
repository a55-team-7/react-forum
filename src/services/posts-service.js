import { get, ref, query, equalTo, orderByChild, update, push, remove } from "firebase/database";
import { db } from "../config/firebase-setup";

export const addPost = async (author, content, title) => {

    return push(ref(db, 'posts'), {
        author,
        title,
        content,
        createdOn: Date.now(),
    });

}

export const getAllPost = async () => {   //this function can show all posts by sreation order , but it can also filter posts by title (for now)
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));

    if (!snapshot.exists()) {
        return [];
    }

    console.log(Object.values(snapshot.val()));
    console.log(Object.keys(snapshot.val()));

    const posts = Object.keys(snapshot.val()).map((key => ({
        id: key, //the key
        ...snapshot.val()[key], //console.log  //the key value pairs of this id object
        createdOn: new Date(snapshot.val()[key].createdOn).toString(),
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    })))
        // .filter(post => post.title.toLowerCase().includes(search.toLowerCase()));

    return posts;
}

export const getPostById = async (id) => {

    const snapshot = await get(ref(db, `posts/${id}`));
    if (!snapshot.exists()) {
        return null;
    }

    const post = {
        id,
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn).toString(),
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    };

    return post;
};

export const getPostByAuthor = async (author) => {

    const snapshot = await get(ref(db, `posts/${author}`));
    if (!snapshot.exists()) {
        return null;
    }

    const post = {
        id: author, // assuming the author's name is unique and can be used as the id
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn).toString(),
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    };

    return post;
};

//admin only / except for the user's own posts
export const deletePost = async (id) => {
    const postRef = ref(db, `posts/${id}`);
    await remove(postRef);
};


{/* 
export const getPostsByMostLikes = async () => {
    const snapshot = await get(ref(db, 'posts'));

    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.values(snapshot.val()).map((post, id) => ({
        id,
        ...post,
        createdOn: new Date(post.createdOn).toString(),
        likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    }));

    // Sort posts by likes
    posts.sort((a, b) => b.likedBy.length - a.likedBy.length);

    return posts;
};

export const getPostsByMostComments = async () => {
    const snapshot = await get(ref(db, 'posts'));

    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.values(snapshot.val()).map((post, id) => ({
        id,
        ...post,
        createdOn: new Date(post.createdOn).toString(),
        comments: post.comments ? Object.keys(post.comments) : [],
    }));

    // Sort posts by comments
    posts.sort((a, b) => b.comments.length - a.comments.length);

    return posts;
};
*/}


export const commentPost = async (postId, userHandle, comment) => {
    const newCommentRef = push(ref(db, `posts/${postId}/comments`));
    await update(newCommentRef, {
        userHandle,
        comment,
        createdOn: Date.now(),
    });
};


export const likePost = (handle, postId) => {
    const updateLikes = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

    return update(ref(db), updateLikes);
};

export const dislikeTweet = (handle, postId) => {
    const updateLikes = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/users/${handle}/likedPost/${postId}`] = null;

    return update(ref(db), updateLikes);
};

