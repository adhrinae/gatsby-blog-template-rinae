import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ toggled, handleToggled }) => (
  <nav
    className="navbar is-info"
    role="navigation"
    aria-label="main navigation"
  >
    <div className="navbar-brand">
      <Link
        to="/"
        className="navbar-item navbar-title"
        style={{ fontWeight: 'bold' }}
      >
        Rinae's playground
      </Link>

      <div
        className={toggled ? 'navbar-burger is-active' : 'navbar-burger'}
        onClick={handleToggled}
      >
        <span/>
        <span/>
        <span/>
      </div>
    </div>

    <div className={toggled ? 'navbar-menu is-active' : 'navbar-menu'}>
      <div className="navbar-end">
        <Link className="navbar-item" to="/">
          Posts
        </Link>
        <Link className="navbar-item" to="/tags">
          Tags
        </Link>
        <a className="navbar-item" href="/rss.xml">
          RSS Feed
        </a>
      </div>
    </div>
  </nav>
)

Header.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggled: PropTypes.func.isRequired,
}

export default Header
