import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import About from '../components/About'

import './blog-post.scss'

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const TagList = ({ tags }) => (
  <div>
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

export default function Template({ data }) {
  const { markdownRemark: post } = data
  const tags = post.frontmatter.tags

  return (
    <div className="container">
      <div className="columns is-mobile">
        <div className="column is-10-mobile is-offset-1-mobile is-8-tablet is-offset-2-tablet is-8-desktop is-offset-2-desktop">
          <div className="content">
            <Helmet title={`${post.frontmatter.title} - Rinae's playground`} />
            <div className="post-title">
              <h1>{post.frontmatter.title}</h1>
              <span className="has-text-grey-light is-size-6">
                {post.frontmatter.date}
              </span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <hr />
            <TagList tags={tags} />
            <About />
            <ButtonWrapper>
              <Link to="/" className="button is-info is-large">
                <span className="icon is-medium">
                  <i className="mdi mdi-36px mdi-format-list-bulleted" />
                </span>
                <span>Back to All posts</span>{' '}
              </Link>
            </ButtonWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        path
        title
        tags
      }
    }
  }
`
