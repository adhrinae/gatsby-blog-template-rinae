import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Helmet from 'react-helmet'

import Footer from './Footer'
import Header from './Header'

import favicon from '../assets/favicon.ico'

import '@mdi/font/scss/materialdesignicons.scss'
import 'bulma'
import 'prismjs/themes/prism-solarizedlight.css'
import './Layout.style.scss'

class Layout extends Component {
  state = {
    toggled: false
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
          <title>Rinae's devlog</title>
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
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
}

export default Layout
