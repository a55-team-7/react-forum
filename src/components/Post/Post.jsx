import PropTypes from 'prop-types';
import Container from '../Container/Container';
import './Post.css';
import { useNavigate, useParams } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const Post = ({ post, postType='post' }) => {
    //const [post, setPost] = useState(null);
    const navigate = useNavigate();
   
    return (
        <div id="post-container">
            <Container>
                {/*author will be displayed with his profile pic and next to him - his name/username*/}
                <div id="post-header-container">
                    {postType==='post' ? <ProfilePicture handle={post.author} type={postType}/> : []}
                    <button onClick={() => navigate(`/posts/${post.id}`)} >see more</button>
                    {postType==='post' ? <p>{post.author}</p> : []}
                </div>
                <h4>{post.title}</h4>
                {/* content needt to be in a container*/}
                <div id="content-container">
                    <p >Content: {post.content}</p>
                </div>
                {/*Created on only for the detailed Post view */}
                {/*<p>Created on: {post.createdOn}</p>*/}
                {/*likes and comments need to be in a seperaye grid */}
                <div id="likes-comments-container">
                    <p> Likes: {post.likes ? Object.values(post.likes).length : 0}  Comments: {post.comments ? Object.values(post.comments).length : 0}</p>
                </div>
            </Container>
        </div>
    )
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    postType: PropTypes.string
};

export default Post;