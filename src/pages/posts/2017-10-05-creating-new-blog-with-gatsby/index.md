---
path: "/posts/creating-new-blog-with-gatsby"
date: "2017-10-05"
title: "Gatsby를 활용한 블로그 재구성"
category: Gatsby
tags:
  - Markdown
  - React
  - GraphQL
---

## 새로운 도전의 시작

올 여름 이런저런 일을 겪고 나서, 많은 고민 끝에 한동안 프론트엔드 개발자로 커리어를 쌓아가기로 결정하였습니다. 이전에는 루비 백엔드를 기반으로 한 그냥저냥한 웹 개발자였습니다만.. 오랫동안 업무에서 루비를 쓸 일이 없겠네요. (물론 여전히 루비라는 언어 자체는 사랑하고 관심은 계속 가지고 있습니다)

기존에도 프론트엔드 라이브러리로 React와 Vue.js에 많은 관심을 가지고 있었는데, 이제 본격적으로 리액트를 업무에 사용하게 되었기 때문에 **리액트로 뭘 만들어볼까?** 하다가 가장 만만한 블로그부터 다시 만들어 보기로 결심했습니다. 블로그를 만들고자 했던 이유는 몇 가지 더 있었습니다.

1. 기왕 하는거 간단한 디자인 및 프로토타이핑까지 하여 하나의 사이트 개발을 처음부터 끝까지 직접 해 보고 싶다.
1. 기존 블로그는 테마를 바로 가져다 썼는데, 충분히 좋지만 불필요한 요소나 레이아웃을 걷어내고 최대한 간소하게 만들어보고 싶다.
1. 간소하게 만들면서 관리 및 유지보수가 더 원활한 형태로 재구성하고 싶다.

결론부터 말씀드리자면 1번은 절반의 성공만 거두고 나머지는 성공했습니다. 종이에다 어떤 모양이 나와야하는지 그려본 뒤에, 그 모습을 실제 코드로 옮기는데 성공했지만 CSS를 밑바닥부터 그려낼 실력은 되지 않아 [Bulma](https://bulma.io)를 활용하여 만들었습니다.

그러면 2, 3번은 어떻게 달성했을까요?


## Gatsby를 만나다

이전에 ‘리액트를 학습하는 과정’ 을 안내하는 포스팅을 읽은 적이 있는데 *기본을 익혔다면 [Gatsby](https://www.gatsbyjs.org)같은 리액트 기반의 정적 페이지 생성기를 사용하여 리액트를 연습해보라* 라는 내용이 적혀있더군요. **어떻게 리액트로 정적 페이지를 만들 수 있을까?** 하며 궁금해하면서 이름을 기억해두고 있었습니다.

보통 정적 페이지 생성기를 사용하여 블로그를 만든다고 하면 루비를 이용한 [Jekyll](https://jekyllrb.com)과 Node.js를 이용한 [Hexo](https://hexo.io) 등을 사용하게 됩니다. 각각의 포스팅을 마크다운으로 작성하고 생성기가 이를 html 파일로 변환해주며, 특정 정보가 삽입되어야 할 때(날짜, 사용자가 직접 입력한 정보 등)는 템플릿 엔진이 페이지 생성을 도와주는 형식으로 되어 있습니다.

그런데 당시 제가 아는 수준에서 리액트로 블로그를 만드는 것은 굉장히 기술을 과하게 사용하는 일이었습니다. 먼저 블로그를 정말 메모장 대신으로 쓸 것이 아니면 검색 엔진에 노출 되는 것이 좋다고 생각하는데, 리액트로 SPA(Single Page Application)을 제작하게되면 검색엔진 봇이 내용을 수집하기 힘듭니다. 아니면 별도로 라우팅과 SSR(Server Side Rendering)을 구성해야 합니다.

하지만 Gatsby의 도움을 받으면 비교적 간단하게 리액트를 활용하여 빠르고 유연한 정적 페이지를 생성할 수 있습니다. Gatsby를 활용할 때 생기는 장점 소개는 공식 사이트의 소개와 [이 포스팅](https://blog.scottnonnenberg.com/static-site-generation-with-gatsby-js/)으로 가볍게 미루겠습니다.

**여담이지만 이번에 Facebook에서 React 16 발매와 함께 [웹사이트](https://reactjs.org)를 개편할 때 Gatsby를 사용했습니다** 😏

제가 블로그를 다시 만들면서 했던 일들은 기본적인 프로젝트 설정을 한 뒤에, 일반적인 리액트 애플리케이션 만들듯이 컴포넌트를 작성하고 배포 커맨드를 입력한 정도밖에 되지 않았습니다. (실제로는 자잘한 작업들이 더 있긴 했지만 큰 틀은 이렇습니다) 이제부터 실제로 이 블로그를 제작한 과정 일부와 문제 해결 과정을 코드와 함께 소개해 드리겠습니다.

**아래 내용을 보시기에 앞서 [Gatsby 공식 튜토리얼](https://www.gatsbyjs.org/tutorial/)을 참고하시기 바랍니다. 대부분은 공식 튜토리얼에서 사용한 코드 및 Gatsby로 만들어진 블로그의 코드 일부를 참고하였습니다.**

**또한 아래에 정리하는 내용은 기초 수준 이상의 리액트 라이브러리의 이해를 전제로 작성하였습니다.**


## 프로젝트 설정

먼저 이 블로그를 만들기 시작한 시점의 로컬 개발환경은 다음과 같습니다

- **Yarn**: `1.1.0` (npm은 사용하지 않았습니다)
- **Node.js**: `8.6.0`

핵심은 이 둘이고 나머지는 필요한 패키지만 설치하면 가능한 한 최신 버전으로 유지하시면서 개발하시면 됩니다.

### Gatsby 프로젝트 생성

먼저 Gatsby의 CLI를 설치합니다.

```
yarn global add gatsby-cli
```

그리고 레일즈 등의 프로젝트를 생성하듯이 터미널에 명령어를 `gatsby new blog` 명령어를 입력하시면 되는데, 만약 마음에 드는 Gatsby 스타터(보일러플레이트)를 발견하시면 Git 주소를 인자로 입력하실 수 있습니다.

```
# 빈 프로젝트 생성
gatsby new blog

# 보일러플레이트 이용 예
gatsby new blog https://github.com/dschau/gatsby-blog-starter-kit
```

그리고 `blog` 폴더를 에디터로 열어 작업하시면 됩니다. 저는 Visual Studio Code를 사용했습니다.

### Prettier 설정

기존에는 프로젝트에 ESLint를 활용해서 코드 스타일을 유지했는데, [Prettier](https://github.com/prettier/prettier)를 활용하기 시작하면서 굳이 필요가 없게 되었습니다. 특히 이 트윗을 보고 나서 `prettier-eslint` 플러그인마저 필요 없다는 사실을 뒤늦게 깨달았습니다.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">PSA: I&#39;m no longer using prettier-eslint. I use raw prettier and disable all eslint style rules.<br><br>My life has been better ever since...</p>&mdash; Kent C. Dodds (@kentcdodds) <a href="https://twitter.com/kentcdodds/status/913760103118991361?ref_src=twsrc%5Etfw">September 29, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

여러분들도 가독성있는 코드 스타일을 유지하는데 관심이 있으시다면 다음 설정을 참고해 보시기 바랍니다.
먼저 프로젝트에 Prettier를 추가합니다.

```
yarn add prettier --dev
```

VS Code 사용자 기준으로 다음 플러그인도 설치하셔야 합니다.

[Prettier - JavaScript formatter - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

그리고 커맨드 팔레트(macOS기준 Cmd+Shift+P)를 열어 `Preferences: Open Workspace Settings` 를 선택하신 뒤에 Prettier 스타일 세팅 및 저장시 자동 적용을 활성화 하시면 됩니다.

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "prettier.printWidth": 100
}
```

저는 스타일 기본값을 사용하고 한 줄당 길이만 100이 되도록 설정하였습니다. 앞으로는 저장 시 자동으로 파일마다 Prettier가 작동하여 코드의 스타일을 다듬어줍니다.

### 플러그인 설치

Gatsby의 다양한 플러그인을 활용하여 사용자가 더 편하게 웹페이지를 제작할 수 있습니다. 특히 보통 리액트를 사용할 때 많이 활용하는 패키지와 Gatsby가 잘 결합되도록 따로 플러그인을 만들어 배포하고 있습니다. 예를 들어 `react-helmet` 을 사용하시려면 `gatsby-plugin-react-helmet` 플러그인을 설치하여 설정 파일에서 불러오도록 만들어야 합니다. 사용 가능한 플러그인 리스트는 [공식 문서](https://www.gatsbyjs.org/docs/plugins/)를 참고해주세요.

저는 제 블로그를 구현하기 위한 기능을 먼저 정의한 뒤에 필요한 부분만 플러그인을 추가 & 설정하였습니다.

- 유동적으로 HTML `head` 태그가 바뀌어야 한다(제목 등) -> `gatsby-react-helmet`
- Sass(SCSS)를 사용한다 -> `gatsby-plugin-sass`
- (당연하지만) 본문에 마크다운을 사용한다 -> `gatsby-transformer-remark`
	- 마크다운에 트위터 임베딩이 필요하다 -> `gatsby-plugin-twitter`
	- 마크다운에 Syntax highlighting이 필요하다 -> `gatsby-remark-prismjs`
	- …
- …

실제 적용된 플러그인의 전체 목록은 소스코드를 참고해 주시기 바랍니다.

플러그인은 프로젝트 폴더에 `gatsby-config.js` 파일을 만들어서 자바스크립트 객체로 내보내시면 됩니다.

```javascript
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: "https://emaren84.github.io",
    title: "rinae's blog",
    description: "about Translation, Ruby, Javascript, Practical Dev etc.",
    // ...
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-sass",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-twitter",
    // ...
    "gatsby-remark-responsive-iframe"
  ]
};
```


## 실제 블로그 포스트를 가져오기
### 프로젝트 폴더 구성

Gatsby로 페이지를 작성하는데 필요한 폴더는 세 가지 입니다.

- `src/layouts` - 페이지의 전반적인 레이아웃을 담당. 모든 개별 페이지가 이 폴더의 `index.js` 파일의 하위 컴포넌트로 동작함.
- `src/pages` - 개별 페이지를 담아두는 폴더. 블로그 포스트(마크다운)나 404, index 페이지를 작성
- `src/templates` - 반복되는 페이지의 템플릿을 저장 (예: 블로그 포스트의 템플릿)

위 폴더의 구조는 얼마든지 사용자화 할 수 있습니다. 다만 저는 제시된 구조로 충분했기 때문에 특별히 변형하진 않았습니다. 추가적으로 재사용이 잦은 컴포넌트를 `src/components` 폴더에 정의하여 사용했습니다.

참고로 `src/pages` 폴더에 저장해 둔 마크다운 파일을 불러오기 위해서 약간의 설정이 필요합니다. 위에서 언급한 `gatsby-config.js` 파일에 다음 플러그인을 추가해야 합니다.

```javascript
// gatsby-config.js
// ...
	plugins: [
		// ...
		{
			resolve: "gatsby-source-filesystem",
			options: {
				path: `${__dirname}/src/pages`,
				name: "pages"
			}
		},
		// ...
	],
// ...
```

### 기본 레이아웃 작성

`src/layout/index.js` 파일은 대부분의 리액트 프로젝트의 `index.html` 같은 파일입니다. 보통 `index.html` 파일에서 favicon, head 태그 등의 공통적인 내용을 정의한 뒤에 ReactDOM이 랜더링될 위치를 지정해 주지요.

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import Helmet from "react-helmet";

// import styles
import "typeface-noto-sans";
import "bulma";
import "mdi/scss/materialdesignicons.scss";
import "prismjs/themes/prism-solarizedlight.css";
import "./layout-style.scss";

import favicon from "../assets/favicon.ico";

// ...

class TemplateWrapper extends Component {
  // ...
  render() {
    const { children } = this.props;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Rinae's playground</title>
          <link rel="shortcut icon" href={favicon} />
        </Helmet>
        <Header toggled={this.state.toggled} handleToggled={this.handleToggled} />
        <div>{children()}</div>
        <Footer />
      </div>
    );
  }
}
```

`Helmet` 컴포넌트는 html의 `head` 태그를 생성해주는 역할을 합니다. 그리고 `Link` 컴포넌트는 react-router의 `Link` 컴포넌트와 거의 동일하게 작동합니다. 주로 특정 DOM 엘리먼트를 클릭하면 페이지 어디로 이동할지 지정해줄 때 사용합니다. 개발자 도구를 열어보면 `a`  태그가 랜더링되지만 페이지를 다시 불러오지 않고 미리 준비된 다른 컴포넌트와 바꿔치기 하는 방식으로 동작하나 봅니다.

`props` 로 내려온 `children` 이 일반 페이지 컴포넌트들이 됩니다. 말 그대로 `src/layout/index.js` 는 모든 페이지들의 부모 컴포넌트가 된다고 이해하시면 되겠습니다.

### 포스트 리스트 보여주기

이번에는 `src/pages/index.js` 파일을 살펴보겠습니다. 이 페이지는 블로그에 접속하면 가장 처음 접하게 되는 페이지로, 모든 포스트를 리스트로 가져와서 최신 순서대로 나열해주는 역할을 합니다.

```jsx
import React, { Component } from "react";
import Link from "gatsby-link";

import Hero from "../components/Hero";
import PostList from "../components/PostList";

class IndexPage extends Component {
  render() {
    const edges = this.props.data.allMarkdownRemark.edges;
    const postsData = edges.map(edge => edge.node);

    return (
      <div>
        <Hero
          title="Welcome to my writing playground"
          subtitle="about Translation, Ruby, Javascript, Practical Dev etc."
        />

        <div className="container">
          <div className="columns">
            <div className="column is-10-mobile is-offset-1-mobile is-10-tablet is-offset-1-tablet">
              <PostList postsData={postsData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(limit: 1000, sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            category
            date(formatString: "YYYY/MM/DD")
            path
          }
        }
      }
    }
  }
`;
```

파일 아래 부분에 `pageQuery`를 주목해주세요. `graphql`? 무슨 정적 사이트 생성기에 GraphQL을 쓰지? 라는 생각을 했는데, Gatsby에서 나름 효율적으로 사용자가 원하는 자료를 가져올 수 있도록 제공된 인터페이스를 사용하는 느낌이었습니다.

저도 GraphQL을 이름만 들어보고 실제로 사용해본 적은 한 번도 없었지만 공식 사이트의 튜토리얼을 참고해보고, Gatsby에서 제공하는 GraphQL IDE(개발 모드에서 `localhost:8000/___graphql`)로 여러가지 실험을 해 보니 필요한 만큼은 이해할 수 있었습니다. 당장 GraphQL에 익숙하지 않으시더라도 저 쿼리가 대강 어떤 자료를 가져오려고 하는 지 눈에 잘 들어올겁니다. 실제 리턴받는 데이터도 저 구조대로 자바스크립트 객체 형태를 가지고 있습니다.

- - - -
미처 설명드리지 못했지만 `frontmatter` 는 각각의 마크다운 파일 맨 처음에 작성하는 일종의 헤더로 다음과 같이 작성합니다.

```
---
title: "Some title"
category: "Example"
date: "2017/10/04"
path: "/posts/some-title"
...
---
```

- - - -
쿼리하고 받은 데이터는 같은 파일에 작성된 리액트 컴포넌트에 `props`로 자동 설정됩니다. 그래서 `this.props.data.allMarkdownRemark` 처럼 사용할 수 있는 겁니다.

그런데 마크다운으로 작성된 블로그 포스트는 어떻게 리액트 컴포넌트로 표현해주어야 할까요? `http://blog.com/post/1` 같이 포스트마다 고유의 경로를 가져야 할 테고, 그러려면 `src/pages` 안에 각각의 포스트마다 컴포넌트를 작성해주어야 할까요? 다행히도 그렇게 복잡한 방식을 사용할 필요는 없습니다.

### 블로그 포스트 생성하기

Gatsby는 자체 Node API를 제공하여 페이지를 생성하거나 수정하는 작업을 처리할 수 있습니다. 리액트의  Lifecycle methods 처럼 페이지 생성부터 종료까지 다양한 시점에 걸쳐 설정을 할 수 있지만, 저는 `createPages` 메서드만 사용했습니다.

자세한 내용은 [공식 문서](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/)를 참고해주세요. 또한 대부분 공식 튜토리얼 파트4에 소개되어있는 내용을 참고했습니다.

먼저 프로젝트 루트에 `gatsby-node.js` 파일을 생성합니다.

```javascript
// gatsby-node.js
const path = require("path");

exports.createPages = ({ boundActionCreators, graphql }) => {
  // ...
};
```

`boundActionCreators` 는 Redux로 구현된 다양한 행동 모음집(액션 디스패처들)입니다. 우리는 여기서 `createPage` 액션 하나만 사용할 예정입니다. `graphql` 은 GraphQL 쿼리를 실행하고 그 결과를 프로미스로 리턴하는 함수입니다. `createPages` 함수 내부를 조금 더 자세히 살펴보겠습니다.

```javascript
// ...
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

  return graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            excerpt(pruneLength: 250)
            html
            id
            frontmatter {
              date
              path
              title
              tags
              category
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      console.error(result.errors);
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {}
      });
    });
  });
};
```

`blogPostTemplate` 는 블로그 포스트를 표현하기 위한 리액트 컴포넌트입니다. 조금 뒤에 살펴보겠습니다.

`graphql` 함수가 쿼리를 하고 나온 결과는 `result.data` 에 담기게 되며 아까 `src/pages/index.js` 파일 안에서 GraphQL 쿼리 결과를 가져올 때랑 똑같이 다룰 수 있습니다.

그리고 `createPage` 라는 함수에 각각의 포스트를 인자로 넘기면 됩니다. `path` 속성은 어떤 URL로 생성될지, `component` 는 어떤 컴포넌트를 사용하여 페이지를 만들지 지정합니다. `context` 는 상황에 따라 사용자 임의의 속성을 지정해줄 수 있는 기능인데, 저는 굳이 사용하지 않았습니다.

중요한 점은 저 `path` 속성이 템플릿 컴포넌트로 넘어갈때 GraphQL의 인자로 사용된다는 것입니다.

```jsx
// src/templates/blog-post.js
// ...
export default function Template({ data }) {
  const { markdownRemark: post } = data;
  const tags = post.frontmatter.tags;

  return (
    <div className="container">
      <div className="columns is-mobile">
        <div className="column is-10-mobile is-offset-1-mobile is-8-tablet is-offset-2-tablet is-8-desktop is-offset-2-desktop">
          <div className="content">
            <Helmet title={`${post.frontmatter.title} - Rinae's playground`} />
            <div className="post-title">
              <h1>{post.frontmatter.title}</h1>
              <span className="has-text-grey-light is-size-6">{post.frontmatter.date}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <hr />
            <TagList tags={tags} />
            <About />
            <ButtonWrapper>
              <Link to="/" className="button is-info is-large">
                <span className="icon is-medium">
                  <i className="mdi mdi-36px mdi-format-list-bulleted" />
                </span>
                <span>Back to All posts</span>{" "}
              </Link>
            </ButtonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        path
        title
        tags
      }
    }
  }
`;
```

`pageQuery` 의 `graphql` 이 인자로 `$path` 를 받는데 아까 `createPage` 함수에서 가져온 `path` 속성을 의미합니다. 그리고 `$path` 를 이용하여 **마크다운 파일 중에  frontmatter의 path가 `$path` 와 같은 노드를 검색하라** 라는 쿼리를 전달할 수 있는 것입니다. 나머지는 그 데이터를 그대로 컴포넌트에 넘겨주기만 하면 됩니다.

그리고 마크다운 파일은 플러그인에 의해 자동으로 html로 변환되는데, 이 html을 [`dangerouslySetInnerHTML` 속성](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)을 사용해서 주입했습니다.

설명을 보시면서 생략된 부분이 많다고 느끼실 수 있지만, 앞서 언급한 공식 튜토리얼을 가볍게 진행해보시면 생각보다 쉽게 간단한 블로그정도는 만들 수 있다는 생각이 드실 겁니다.


## 자잘한 문제 해결

하지만 공식 문서에서는 미처 언급되지 않아 제가 약간 삽질을 하면서 해결했던 문제들이 있습니다. 기록 겸 이 글을 읽으시는 분들이 만약 같은 문제를 겪으실 때 쉽게 해결하실 수 있었으면 좋겠습니다.

### RSS Feed 설정

Gatsby는 RSS Feed를 생성하는 플러그인을 제공합니다. 제 블로그가 아무리 대단한 내용이 없다 하더라도 RSS Feed를 제공하는 것은 기본 중의 기본이라 생각하여 설정하고 있었는데, 아무리 해도 `head` 태그에 `rss.xml` 파일이 제대로 된 경로로 설정되지 않았습니다.

```html
<head>
	<!-- rss.xml의 경로가 절대경로로만 표시된다 -->
	<link rel="alternate" type="application/rss+xml" href="/rss.xml">
</head>
```

이렇게 되면 제가 기존에 쓰던 블로그 주소인 `https://emaren84.github.io/blog` 를 사용할 경우 RSS Feed를 제공할 수 없게 됩니다. 왜냐면 `rss.xml` 의 위치는 `https://emaren84.github.io/rss.xml` 이 되어버리기 때문입니다.

플러그인 소스를 보니  `pathPrefix` 설정을 받아들이는 부분도 없고 무조건 절대경로로 파일을 생성하도록 되어있나봅니다.

결국 블로그 주소를 바꿔서 해결했지만.. 기존에 사용하던 지킬 테마에서는 피드 생성이 잘 되었다는 것을 생각해보면 나중에 수정되었으면 좋겠습니다.

### GIF 파일 표시

Gatsby의 remark-images 플러그인은 jpg, png 파일은 아주 잘 처리합니다. 다만 gif파일은 처리하지 않습니다. 보통 gif 파일을 쓸 일이 없긴 하지만, 몇몇 포스트에 gif파일을 사용하기 때문에 문제를 해결해야 했습니다.

`gatsby-remark-copy-linked-files` 을 추가하면 문제는 해결됩니다. 이 플러그인은 PDF 파일 등의 링크를 제공할 때 사용하는 플러그인으로 생각하고 간과하고 있었는데, 이 플러그인을 설치한 채로 gif파일의 링크를 설정하니 잘 작동합니다.

### 코드 블락의 CSS 오류

개발 블로그를 작성하면서 가장 중요한게 코드의 표현인데, Gatsby로 블로그를 만들고 나니 일부 코드 블락이 이상하게 표현되었습니다. 처음에는 PrismJS 플러그인의 문제라고 생각했는데, 제가 이 블로그를 만들기 위해 사용한 CSS 프레임워크인 Bulma의 CSS와 일부 충돌하는 부분이 있었기 때문에 코드가 이상하게 나온 것이었습니다.

블로그 포스트 템플릿에 CSS를 추가하여 문제를 해결했습니다.

```scss
// ...
// resolve conflicts between bulma css preset and prismjs
pre[class*="language-"] .tag,
pre[class*="language-"] .number {
  align-items: stretch;
  background-color: transparent;
  border-radius: 0;
  display: inline;
  font-size: 1em;
  justify-content: flex-start;
  line-height: normal;
  padding: 0;
  white-space: pre;
  margin-right: 0;
  min-width: auto;
  text-align: left;
  vertical-align: baseline;
}
```

- - - -

제가 만든 블로그는 [Github에 공개 되어 있습니다](https://github.com/emaren84/gatsby-blog). 커밋 로그를 조금 살펴보시면 블로그에서 미처 언급하지 못했던 제작과정을 참고하실 수 있습니다.

**참고자료**

- [Gatsby Tutorial](https://www.gatsbyjs.org/tutorial/)
- [GitHub - alxshelepenok/gatsby-starter-lumen: Lumen is a minimal, lightweight and mobile-first starter for creating blogs uses Gatsby](https://github.com/alxshelepenok/gatsby-starter-lumen)
- [Dustin Schau - Creating a Blog with Gatsby](https://dustinschau.com/blog/getting-started-with-gatsby)