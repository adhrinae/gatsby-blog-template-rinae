import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import Helmet from "react-helmet";

import "typeface-noto-sans";
import "bulma";
import "mdi/scss/materialdesignicons.scss";
import "prismjs/themes/prism-solarizedlight.css";
import "./layout-style.scss";

const Header = ({ toggled, handleToggled }) => (
  <nav className="navbar is-info" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link to="/" className="navbar-item navbar-title" style={{ fontWeight: "bold" }}>
        Rinae's playground
      </Link>

      <div
        className={toggled ? "navbar-burger is-active" : "navbar-burger"}
        onClick={() => handleToggled()}
      >
        <span />
        <span />
        <span />
      </div>
    </div>

    <div className={toggled ? "navbar-menu is-active" : "navbar-menu"}>
      <div className="navbar-end">
        <Link className="navbar-item" to="/">
          Posts
        </Link>
        <Link className="navbar-item" to="/categories">
          Categories
        </Link>
        <Link className="navbar-item" to="/tags">
          Tags
        </Link>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="content has-text-centered">
        <p>All content copyright rinae © 2017 • All rights reserved.</p>
        <p>
          Powered by <a href="https://www.gatsbyjs.org">Gatsby.js</a> and{" "}
          <a href="https://bulma.io">Bulma</a>
        </p>
      </div>
    </div>
  </footer>
);

class TemplateWrapper extends Component {
  state = {
    toggled: false
  };

  handleToggled = () => {
    this.setState({ toggled: !this.state.toggled });
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Rinae's playground</title>
        </Helmet>
        <Header toggled={this.state.toggled} handleToggled={this.handleToggled} />
        <div>{children()}</div>
        <Footer />
      </div>
    );
  }
}

Header.propTypes = {
  toggled: PropTypes.bool,
  handleToggled: PropTypes.func
};

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;
