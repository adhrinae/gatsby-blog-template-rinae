import React from "react";
import PropTypes from "prop-types";

function omit(targetObj, omitProps) {
  let copiedObj = Object.assign({}, targetObj);
  Object.keys(omitProps).forEach(prop => {
    delete copiedObj[prop];
  });
  return copiedObj;
}

// Disqus for Reactcomponent
export default class Disqus extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  componentWillMount() {
    if (typeof window != "undefined" && window.document) {
      const component = this;
      window.disqus_config = function() {
        this.page.identifier = component.state.identifier;
        this.page.title = component.state.title;
        this.page.url = component.state.url;
        this.page.category_id = component.state.category_id;
        this.callbacks.onNewComment = component.state.onNewComment;
      };
      const script = document.createElement("script");
      script.src = `//${this.state.shortname}.disqus.com/embed.js`;
      script.async = true;
      document.body.appendChild(script);
    }
  }

  render() {
    const props = omit(this.props, Disqus.propTypes);
    return <div id="disqus_thread" {...props} />;
  }
}

Disqus.propTypes = {
  /**
   * `shortname` tells the Disqus service your forum's shortname,
   * which is the unique identifier for your website as registered
   * on Disqus. If undefined , the Disqus embed will not load.
   */
  shortname: PropTypes.string.isRequired,

  /**
   * `identifier` tells the Disqus service how to identify the
   * current page. When the Disqus embed is loaded, the identifier
   * is used to look up the correct thread. If disqus_identifier
   * is undefined, the page's URL will be used. The URL can be
   * unreliable, such as when renaming an article slug or changing
   * domains, so we recommend using your own unique way of
   * identifying a thread.
   */
  identifier: PropTypes.string,

  /**
   * `title` tells the Disqus service the title of the current page.
   * This is used when creating the thread on Disqus for the first time.
   * If undefined, Disqus will use the <title> attribute of the page.
   * If that attribute could not be used, Disqus will use the URL of the page.
   */
  title: PropTypes.string,

  /**
   * `url` tells the Disqus service the URL of the current page.
   * If undefined, Disqus will take the global.location.href.
   * This URL is used to look up or create a thread if disqus_identifier
   * is undefined. In addition, this URL is always saved when a thread is
   * being created so that Disqus knows what page a thread belongs to.
   */
  url: PropTypes.string,

  /**
   * `category_id` tells the Disqus service the category to be used for
   * the current page. This is used when creating the thread on Disqus
   * for the first time.
   */
  category_id: PropTypes.string,

  /**
   * `onNewComment` function accepts one parameter `comment` which is a
   * JavaScript object with comment `id` and `text`. This allows you to track
   * user comments and replies and run a script after a comment is posted.
   */
  onNewComment: PropTypes.func
};
