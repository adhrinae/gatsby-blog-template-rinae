import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";

import Hero from "../components/Hero";

export default function Tags({ pathContext }) {
  const { postsByTags, tags, tag, tagName } = pathContext;

  if (tag) {
    const len = tag.length;
  } else {
    const lengthByTags = Object.keys(postsByTags)
      .map(tag => ({ tagName: tag, length: postsByTags[tag].length }))
      .sort((a, b) => b.length - a.length);

    return (
      <div>
        <Hero title="List of all tags" subtitle="sorted by the frequency being tagged" />
        <div className="container">
          <div className="tag-list">
            {lengthByTags.map(tag => (
              <span className="tags has-addons">
                <span className="tag is-info is-large">{tag.tagName}</span>
                <span className="tag is-large">{tag.length}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
