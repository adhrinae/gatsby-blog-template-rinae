import PropTypes from 'prop-types'
import React from 'react'

const Hero = ({ title, subtitle }) => (
  <section className="hero is-light">
    <div className="hero-body">
      <div className="container">
        <h1 className="title">{title}</h1>
        {subtitle && <h2 className="subtitle">{subtitle}</h2>}
      </div>
    </div>
  </section>
)

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

export default Hero
