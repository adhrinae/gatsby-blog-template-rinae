import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Hero from '../components/Hero'
import PostList from '../components/PostList'

export default function Tags({ pathContext }) {
  const { postsByTags, postsByTag, tagName } = pathContext

  if (postsByTag) {
    const len = postsByTag.length

    return (
      <div>
        <Hero
          title={`${len > 1 ? len + ' posts' : len + ' post'} about ${tagName}`}
        />
        <div className="container">
          <PostList postsData={postsByTag} />
        </div>
      </div>
    )
  } else {
    const lengthByTags = Object.keys(postsByTags)
      .map(tag => ({ tagName: tag, length: postsByTags[tag].length }))
      .sort((a, b) => b.length - a.length)

    return (
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
    )
  }
}
