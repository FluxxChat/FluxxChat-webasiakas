# FluxxChat webasiakas

### Setup

Install dependencies

```
$ yarn
```

### Development

Build sources and run server in development environment:

```
$ yarn dev
```

The server is accessible at http://localhost:8888 by default.

### Running

First build source files:

```
$ yarn build
```

Then start server in production environment:

```
$ yarn start
```

The server is accessible at http://localhost:8888 by default.

### Contributing

This project uses [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.2/). Example valid commit message:
```
feat: added graceful shutdown
```
You can also use the following command for commits:
```
$ yarn commit
```
The above command will guide you through the parts of the commit message interactively.