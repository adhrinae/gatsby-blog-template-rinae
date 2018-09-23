import { Link } from 'gatsby'
import React from 'react'

import Hero from '../components/Hero'
import Layout from '../components/Layout'
import PostList from '../components/PostList'

const Tags = ({ pageContext }) => {
  const { postsByTags, postsByTag, tagName } = pageContext

  if (postsByTag) {
    const len = postsByTag.length

    return (
      <Layout>
        <div>
          <Hero
            title={`${
              len > 1 ? len + ' posts' : len + ' post'
            } about ${tagName}`}
          />
          <div className="container">
            <PostList postsData={postsByTag} />
          </div>
        </div>
      </Layout>
    )
  } else {
    const lengthByTags = Object.keys(postsByTags)
      .map(tag => ({ tagName: tag, length: postsByTags[tag].length }))
      .sort((a, b) => b.length - a.length)

    return (
      <Layout>
        <div>
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
                    <span className="tag is-large">{tag.length}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Tags
