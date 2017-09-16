module.exports = {
  siteMetadata: {
    siteUrl: "https://emaren84.github.io/blog",
    title: "Ticking with Code",
    author: {
      name: "Dohyung Ahn(Rinae)",
      email: "emaren84@gmail.com",
      twitter: "https://twitter.com/devRinae",
      github: "https://github.com/emaren84"
    }
  },
  pathPrefix: '/blog',
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: []
      }
    }
  ],
}
