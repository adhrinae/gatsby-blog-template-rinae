module.exports = {
  siteMetadata: {
    siteUrl: 'YOUR_SITE_URL',
    title: 'YOUR_SITE_TITLE',
    description: 'YOUR_SITE_DESCRIPTION',
    author: {
      name: 'YOUR_NAME',
      email: 'YOUR_EMAIL',
      twitter: 'YOUR_TWITTER_ADDRESS',
      github: 'YOUR_GITHUB_ADDRESS'
    }
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    'gatsby-plugin-twitter',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'YOUR_SITE_URL',
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }]
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }]
          }
        }
      }
    },
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
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-'
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 790,
              linkImagesToOriginal: false
            }
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-copy-linked-files'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'YOUR_GA_TRACKING_ID',
        anonymize: true
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  custom_elements: [{ 'content:encoded': edge.node.html }]
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      frontmatter {
                        title
                        date
                        path
                      }
                    }
                  }
                }
              }
            `,
            output: `/rss.xml`
          }
        ]
      }
    },
    'gatsby-remark-responsive-iframe'
  ]
}
