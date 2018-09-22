import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Hero from '../components/Hero'
import PostList from '../components/PostList'

export default function IndexPage(props) {
  const edges = props.data.allMarkdownRemark.edges
  const postsData = edges
    .filter(({ node }) => new Date(node.frontmatter.date) < new Date()) // hide reserved posts
    .map(edge => edge.node)

  return (
    <Layout>
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
    </Layout>
  )
}

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
