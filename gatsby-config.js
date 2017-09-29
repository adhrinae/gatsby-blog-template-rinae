module.exports = {
  siteMetadata: {
    siteUrl: "https://emaren84.github.io/blog",
    title: "rinae's blog",
    author: {
      name: "Dohyung Ahn(Rinae)",
      email: "emaren84@gmail.com",
      twitter: "https://twitter.com/devRinae",
      github: "https://github.com/emaren84"
    }
  },
  pathPrefix: "/blog",
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-sass",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-twitter",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages"
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-"
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    "gatsby-remark-responsive-iframe"
  ]
};
