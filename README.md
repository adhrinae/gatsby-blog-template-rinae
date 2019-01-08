# Rinae's new blog powered by GatsbyJS

## Entering development mode

```shell
yarn start
```

## Deployment

I use CircleCI to build and deploy this blog

```
# In CI environment, after building blog as static files
yarn build

# Then publish it to my github pages repository
yarn publish
```
