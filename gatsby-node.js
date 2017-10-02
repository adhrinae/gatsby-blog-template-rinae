const path = require("path");

const createTagPages = (createPage, edges) => {
  const tagTemplate = path.resolve("src/templates/tags.js");
  const postsByTags = {};

  edges.forEach(({ node }) => {
    node.frontmatter.tags.forEach(tag => {
      if (!postsByTags[tag]) {
        postsByTags[tag] = [];
      }

      postsByTags[tag].push(node);
    });
  });

  const tags = Object.keys(postsByTags);

  // create All Tags page
  createPage({
    path: "/tags",
    component: tagTemplate,
    context: { postsByTags }
  });

  // create individual tag page
  tags.forEach(tagName => {
    const tag = postsByTags[tagName];
    createPage({
      path: `/tags/${tagName}`,
      component: tagTemplate,
      context: {
        tags,
        tag,
        tagName
      }
    });
  });
};

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

  return graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            excerpt(pruneLength: 250)
            html
            id
            frontmatter {
              date
              path
              title
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      console.error(result.errors);
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;

    createTagPages(createPage, posts);

    posts.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {}
      });
    });
  });
};
