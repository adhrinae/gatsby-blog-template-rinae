import React from 'react'

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="content has-text-centered">
        <p>
          All content copyright rinae © {new Date().getFullYear()} • All rights
          reserved.
        </p>
        <p>
          Powered by <a href="https://www.gatsbyjs.org">Gatsby.js</a> and{' '}
          <a href="https://bulma.io">Bulma</a>
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
