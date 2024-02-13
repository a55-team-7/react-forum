import PropTypes from 'prop-types'
import './Comment.css'

export default function Comment ({comment}) {
    return (
        <div className='comment'>
            <p>{comment.comment}</p>
            <p>by {comment.userHandle} on {new Date(comment.createdOn).toLocaleDateString('bg-BG')}</p>
        </div>
    )
}

Comment.propTypes = {
    comment: PropTypes.shape({
        userHandle: PropTypes.string,
        createdOn: PropTypes.string,
        comment: PropTypes.string,
    })
}