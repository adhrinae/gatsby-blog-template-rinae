import React from 'react'

const About = () => (
  <div className="box" style={{ margin: '2rem 0' }}>
    <article className="media">
      <div className="media-left is-hidden-mobile">
        <figure className="image">
          <img
            src="https://gravatar.com/avatar/9524cc46254070122cb0ac9fb286acd3"
            alt="gravatar image"
            style={{ borderRadius: '50%' }}
          />
        </figure>
      </div>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>Rinae(Ahn Dohyung)</strong>
            <br />
            Junior frontend developer. Highly interested in React and Vue.js
            these days. also having enthusiasm for learning and sharing new
            programming issues, especially with translation.
          </p>
        </div>
        <nav className="level">
          <div className="level-left">
            <a href="mailto:adhrinae@gmail.com" className="level-item">
              <span className="icon has-text-info">
                <i className="mdi mdi-24px mdi-email" />
              </span>
            </a>
            <a href="https://github.com/adhrinae" className="level-item">
              <span className="icon has-text-info">
                <i className="mdi mdi-24px mdi-github-circle" />
              </span>
            </a>
            <a href="https://twitter.com/adhrinae" className="level-item">
              <span className="icon has-text-info">
                <i className="mdi mdi-24px mdi-twitter" />
              </span>
            </a>
          </div>
        </nav>
      </div>
    </article>
  </div>
)

export default About
