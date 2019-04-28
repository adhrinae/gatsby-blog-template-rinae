const path = require('path')

const createTagPages = (createPage, edges) => {
  const tagTemplate = path.resolve('src/templates/Tags.js')
  const postsByTags = {}

  edges.forEach(({ node }) => {
    node.frontmatter.tags.forEach(tag => {
      if (!postsByTags[tag]) {
        postsByTags[tag] = []
      }

      postsByTags[tag].push(node)
    })
  })

  // create All Tags page
  createPage({
    path: '/tags',
    component: tagTemplate,
    context: { postsByTags }
  })

  // create individual tag page
  Object.entries(postsByTags).forEach(([tagName, postsByTag]) => {
    createPage({
      path: `/tags/${tagName}`,
      component: tagTemplate,
      context: {
        postsByTag,
        tagName
      }
    })
  })
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(`src/templates/Post.js`)

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
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
              category
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      console.error(result.errors)
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    createTagPages(createPage, posts)

    posts.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {}
      })
    })
  })
}
