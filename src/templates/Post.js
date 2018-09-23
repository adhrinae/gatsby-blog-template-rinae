import { graphql, Link } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'

import About from '../components/About'
import Layout from '../components/Layout'
import TagList from '../components/TagList'

import './Post.style.scss'

function initUtterances() {
  const utterancesConfig = {
    src: 'https://utteranc.es/client.js',
    repo: 'adhrinae/gatsby-blog',
    branch: 'master',
    async: true,
    'issue-term': 'pathname',
  }
  const utterances = document.createElement('script')
  const aboutBox = document.querySelector('.box')

  Object.keys(utterancesConfig).forEach(configKey => {
    utterances.setAttribute(configKey, utterancesConfig[configKey])
  })

  aboutBox.insertAdjacentElement('afterend', utterances)
}

class Post extends React.Component {
  componentDidMount() {
    initUtterances()
  }

  render() {
    const { markdownRemark: post } = this.props.data
    const tags = post.frontmatter.tags

    return (
      <Layout>
        <div className="container">
          <div className="columns is-mobile">
            <div className="column is-10-mobile is-offset-1-mobile is-8-tablet is-offset-2-tablet is-8-desktop is-offset-2-desktop">
              <div className="content">
                <Helmet
                  title={`${post.frontmatter.title} - Rinae's playground`}
                />
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
                <div className="button-wrapper">
                  <Link to="/" className="button is-info is-large">
                    <span className="icon is-medium">
                      <i className="mdi mdi-36px mdi-format-list-bulleted" />
                    </span>{' '}
                    <span>BACK TO ALL POSTS</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
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
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`

export default Post
