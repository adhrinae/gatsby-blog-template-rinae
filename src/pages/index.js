import React, { Component } from 'react';
import Link from 'gatsby-link';

import Hero from '../components/Hero';

class IndexPage extends Component {
  render() {
    const postsData = this.props.data.allMarkdownRemark.edges;
    const posts = postsData.map(({ node: post }) => (
      <div
        key={post.id}
        className="box"
        style={{ marginTop: "1rem" }}
      >
        <p>
          <Link to={post.frontmatter.path}>
            <strong>{post.frontmatter.title}</strong>
          </Link>
          {" "}<small>{post.frontmatter.date}</small>
          {" "}
          <span className="tag is-info">{post.frontmatter.category}</span>
        </p>
        <p>{post.excerpt}</p>
      </div>
    ));

    return (
      <div>
        <Hero
          title="Welcome to my writing playground"
          subtitle="about Translation, Ruby, Javascript, Practical Dev etc."
        />

        <div className="container">
          {posts}
        </div>
      </div>
    );
  }
}


export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 1000,
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
`;