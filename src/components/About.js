import React from 'react'

const About = () => (
  <div className="box" style={{ margin: '2rem 0' }}>
    <article className="media">
      <div className="media-left is-hidden-mobile">
        <figure className="image">
          <img
            src="https://gravatar.com/avatar/02026487bc28d395fbbee71bed30c43a"
            alt="gravatar of Ahn Dohyung"
            style={{ borderRadius: '50%' }}
          />
        </figure>
      </div>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>Rinae (Ahn Dohyung)</strong>
            <br />
            Frontend developer. Highly interested in ReactJS, Testing and
            Programming Fundamentals & Typescript. Also, Have the enthusiasm for learning and
            sharing new programming issues, especially with translation.
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
