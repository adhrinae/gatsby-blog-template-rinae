import React, { Component } from 'react'
import Link from 'gatsby-link'

import Hero from '../components/Hero'
import PostList from '../components/PostList'

class IndexPage extends Component {
  render() {
    const edges = this.props.data.allMarkdownRemark.edges
    const postsData = edges.map(edge => edge.node)

    return (
      <div>
        <Hero
          title="Welcome to my writing playground"
          subtitle="about Translation, Ruby, Javascript, Practical Dev etc."
        />

        <div className="container">
          <div className="columns">
            <div className="column is-10-mobile is-offset-1-mobile is-10-tablet is-offset-1-tablet">
              <PostList postsData={postsData} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 1000
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            category
            date(formatString: "YYYY/MM/DD")
            path
          }
        }
      }
    }
  }
`
