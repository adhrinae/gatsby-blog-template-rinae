import { Link } from 'gatsby'
import React from 'react'

const TagList = ({ tags }) => (
  <div className="tag-lists">
    <h2 className="title">Similar posts about ...</h2>
    <div className="tags">
      {tags.map(tag => (
        <Link className="tag is-info is-medium" to={`/tags/${tag}`} key={tag}>
          {tag}
        </Link>
      ))}
    </div>
  </div>
)

export default TagList