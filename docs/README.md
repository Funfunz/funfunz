# Funfunz Documentation

[![Discord][discord-badge]][discord]
[![Build Status][travis-badge]][travis]
[![codecov][codecov-badge]][codecov]
![node][node]
[![npm version][npm-badge]][npm]
[![PRs Welcome][prs-badge]][prs]
[![GitHub][license-badge]][license]

For the source code you can visit Github [funfunz](https://github.com/JWebCoder/funfunz).

## Overview

Funfunz was created due the lack of a functional back-office and API generator in the NodeJS community.

The goal is to generate a complete CMS/back-office/data manager application

Follow the quickstart [here](usage/quickstart.md)

## Current features
- CRUD operations
- GraphQL schema generator
- [Entity filters](usage/filters.md)
- [Data connector system](usage/dataConnectors/main.md)
- [Configurable Hooks](usage/hooks.md)
- [Request lifecycle](usage/hooks.md)

**Supported data connectors**
- [SQL databases](usage/dataConnectors/sql.md)

**Configuration generator**
- MySQL and MongoDB parser and configurations generator
- Friendly name generator for entity names and fields

## CLI

* `funfunz` - Runs the Wizard to setup the settings and configuration files needed to connect with a database.

[discord-badge]: https://img.shields.io/discord/774439225520554004?logo=discord
[discord]: https://discord.gg/HwZ7zMJKwg

[travis-badge]: https://travis-ci.com/JWebCoder/funfunz.svg?branch=master
[travis]: https://travis-ci.com/JWebCoder/funfunz

[codecov-badge]: https://codecov.io/gh/Funfunz/funfunz/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/Funfunz/funfunz

[node]: https://img.shields.io/node/v/funfunz.svg

[npm-badge]: https://badge.fury.io/js/funfunz.svg
[npm]: https://badge.fury.io/js/funfunz

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com

[license-badge]: https://img.shields.io/github/license/JWebCoder/funfunz.svg
[license]: https://github.com/JWebCoder/funfunz/blob/master/LICENSE