import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import 'typeface-noto-sans';
import 'bulma';

const Header = ({ toggled, handleToggled }) => (
  <nav className="navbar is-info" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link to="/" className="navbar-item navbar-title" style={{ fontWeight: 'bold' }}>
        Rinae's playground
      </Link>

      <div
        className={toggled ? 'navbar-burger is-active' : 'navbar-burger'}
        onClick={() => handleToggled()}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>


    <div className={toggled ? 'navbar-menu is-active' : 'navbar-menu'}>
      <div className="navbar-end">
        <Link className="navbar-item" to="/posts">Posts</Link>
        <Link className="navbar-item" to="/categories">Categories</Link>
        <Link className="navbar-item" to="/tags">Tags</Link>
      </div>
    </div>
  </nav>
);

class TemplateWrapper extends Component {
  state = {
    toggled: false
  }

  handleToggled = () => {
    this.setState({ toggled: !this.state.toggled });
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        <Helmet defaultTitle="Rinae's playground" />
        <Header
          toggled={this.state.toggled}
          handleToggled={this.handleToggled}
        />
        <div>
          {children()}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  toggled: PropTypes.bool,
  handleToggled: PropTypes.func
};

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper
