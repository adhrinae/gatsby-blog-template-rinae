import React from 'react'

import Layout from '../components/Layout'

const NotFoundPage = () => (
  <Layout>
    <section className="hero is-danger">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Page not found</h1>
          <h2 className="subtitle">
            Sorry, you just hit the route that doesn't exist.
          </h2>
        </div>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage
