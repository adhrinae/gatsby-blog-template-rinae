import React from "react";
import Helmet from "react-helmet";

import About from "../components/About";

import "./blog-post.scss";

export default function Template({ data }) {
  const { markdownRemark: post } = data;
  return (
    <div className="container">
      <div className="columns is-mobile">
        <div className="column is-10 is-offset-1">
          <div className="content">
            <Helmet title={`${post.frontmatter.title} - Rinae's playground`} />
            <div className="post-title">
              <h1>{post.frontmatter.title}</h1>
              <span className="has-text-grey-light is-size-6">{post.frontmatter.date}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <About />
          </div>
        </div>
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        path
        title
      }
    }
  }
`;
