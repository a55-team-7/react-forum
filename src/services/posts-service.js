import { get, ref, query, equalTo, orderByChild, update, push, remove } from "firebase/database";
import { db } from "../config/firebase-setup";

export const addPost = async (author, content, title, tags) => {

    return push(ref(db, 'posts'), {
        author,
        title,
        content,
        createdOn: Date.now(),
        comments: {},
        likedBy: {},
        tags: tags || []
    });

}

export const getAllPosts = async () => {   //this function can show all posts by sreation order , but it can also filter posts by title (for now)
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));

    if (!snapshot.exists()) {
        return [];
    }

    const allPosts = snapshot.val();

    const likedByArray = Object.entries(allPosts).map((post) => {
        const postId = post[0]
        const postData = post[1]

        return {
            postId: postId,
            likedBy: postData.likedBy ? postData.likedBy : {}
        };
    })

    const posts = Object.keys(allPosts).map((key => ({
        id: key, //the key
        ...allPosts[key], //console.log  //the key value pairs of this id object
        createdOn: new Date(allPosts[key].createdOn).toString(),
        likedBy: allPosts[key].likedBy ? Object.keys(likedByArray.filter((post) => post.postId === key)[0].likedBy) : [],
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
        tags: snapshot.val().tags ? snapshot.val().tags : [],
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


export const getPostsByNewest = async () => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));

    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.values(snapshot.val()).map((post, id) => ({
        id,
        ...post,
        createdOn: new Date(post.createdOn).toString(),
        likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    }));

    // Sort posts by date in descending order
    posts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

    return posts;
};

export const getPostsByOldest = async () => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));

    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.values(snapshot.val()).map((post, id) => ({
        id,
        ...post,
        createdOn: new Date(post.createdOn).toString(),
        likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    }));

    // Sort posts by date in ascending order
    posts.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));

    return posts;
};


export const commentPost = async (postId, userHandle, comment) => {
    const newCommentRef = push(ref(db, `posts/${postId}/comments`));
    await update(newCommentRef, {
        userHandle,
        comment,
        createdOn: Date.now(),
    });
};

export const deleteCommentById = async (postId, commentId) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await remove(commentRef);
};


export const likePost = (handle, postId) => {
    const updateLikes = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

    return update(ref(db), updateLikes);
};

export const dislikePost = (handle, postId) => {
    const updateLikes = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/users/${handle}/likedPost/${postId}`] = null;

    return update(ref(db), updateLikes);
};

export const updatePostById = async (postId, updatedPost) => {
    const postRef = ref(db, `posts/${postId}`);

    const snapshot = await get(postRef);
    if (!snapshot.exists()) {
        return;
    }

    await update(postRef, {
      ...snapshot.val(),
      title: updatedPost.title,
      content: updatedPost.content
    });
  }

export const updateCommentById = async (postId, commentId, updatedContent) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);

    const snapshot = await get(commentRef);
    if (!snapshot.exists()) {
        return;
    }

    await update(commentRef, {
        ...snapshot.val(),
        comment: updatedContent
    });
};