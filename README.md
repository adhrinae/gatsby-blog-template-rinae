# My older blog template

## Before use this template

Please check out `package.json` and `gatsby-config.js` files, then modify metadata for your own.  
You can write your blog posts in `src/pages/posts` folder in Markdown.

Basically, following frontmmaters are required each markdown files.

```
---
path: YOUR_BLOG_POST_URL_PATH
date: DATETIME
title: POST_TITLE
tags:
  - TAGS
  - CAN
  - BE
  - MULTIPLE
  - ITEMS
---
```

and also you need to provide a favicon and a default opengraph image file in `src/assets` folder.
Check out `Layout.js` and `Post.js` files.

## Entering development mode

```shell
yarn start
```

## Deployment

You can publish the blog to github pages by default.

```shell
yarn publish
```