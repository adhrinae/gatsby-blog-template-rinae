import { Link } from 'gatsby'
import React from 'react'
import PropTypes from 'prop-types'

import Hero from '../components/Hero'
import Layout from '../components/Layout'
import PostList from '../components/PostList'

const Tags = ({ pageContext }) => {
  const { postsByTags, postsByTag, tagName } = pageContext

  if (postsByTag) {
    const postCount = postsByTag.length

    return (
      <Layout>
        <Hero
          title={`${
            postCount > 1 ? postCount + ' posts' : postCount + ' post'
          } about ${tagName}`}
        />
        <div className="container">
          <PostList postsData={postsByTag} />
        </div>
      </Layout>
    )
  } else {
    const lengthByTags = Object.keys(postsByTags)
      .map(tag => ({ tagName: tag, count: postsByTags[tag].length }))
      .sort((a, b) => b.count - a.count)

    return (
      <Layout>
        <Hero
          title="List of all tags"
          subtitle="sorted by the frequency being tagged"
        />
        <div className="container">
          <div className="tag-list">
            {lengthByTags.map(tag => (
              <div className="tags has-addons" key={tag.tagName}>
                <Link to={`/tags/${tag.tagName}`}>
                  <span className="tag is-info is-large">{tag.tagName}</span>
                  <span className="tag is-large">{tag.count}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    postsByTags: PropTypes.object,
    postsByTag: PropTypes.array,
    tagName: PropTypes.string
  })
}

export default Tags
