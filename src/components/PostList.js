import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const PostList = ({ postsData }) => (
  <div>
    {postsData.map(post => (
      <div key={post.id} className="box" style={{ marginTop: '1rem' }}>
        <p>
          <Link to={post.frontmatter.path}>
            <strong>{post.frontmatter.title}</strong>
          </Link>
          {' - '}
          <small>{post.frontmatter.date}</small>{' '}
          <span className="tag is-info">{post.frontmatter.category}</span>
        </p>
        <p>{post.excerpt}</p>
      </div>
    ))}
  </div>
)

PostList.propTypes = {
  postsData: PropTypes.arrayOf(
    PropTypes.shape({
      excerpt: PropTypes.string,
      html: PropTypes.string,
      id: PropTypes.string,
      frontmatter: PropTypes.shape({
        date: PropTypes.string,
        path: PropTypes.string,
        tags: PropTypes.array,
        title: PropTypes.string,
      }),
    })
  ),
}

export default PostList
