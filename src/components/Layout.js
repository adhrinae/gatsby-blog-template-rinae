import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Helmet from 'react-helmet'

import Footer from './Footer'
import Header from './Header'

import favicon from '../assets/favicon.ico'

import '@mdi/font/scss/materialdesignicons.scss'
import 'bulma'
import 'prismjs/themes/prism-tomorrow.css'
import './Layout.style.scss'

class Layout extends Component {
  state = {
    toggled: false,
  }

  handleToggled = () => {
    this.setState({ toggled: !this.state.toggled })
  }

  render() {
    const { children } = this.props

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Rinae's playground</title>
          <link rel="shortcut icon" href={favicon} />
        </Helmet>
        <Header
          toggled={this.state.toggled}
          handleToggled={this.handleToggled}
        />
        {children}
        <Footer />
      </>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default Layout
