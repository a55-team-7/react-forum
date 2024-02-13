import PropTypes from 'prop-types';

const Post = ( {post} ) => {

    return (
        <div>
            <h2>Title: {post.title}</h2>
            <p>Author: {post.author}</p>
            <p>Content: {post.content}</p>
            <p>Created on: {post.createdOn}</p>
            <p>Comments: {post.comments.length}</p>
        </div>
    )
};

Post.propTypes = {
    post: PropTypes.object.isRequired
};

export default Post;