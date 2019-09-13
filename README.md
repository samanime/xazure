# Xazure Framework

A light-weight, ultra flexible framework.

## ALPHA

Xazure CMS and related packages are still in alpha. You are free to use them,
but be aware that the APIs or functions may change.

If you are interested in helping out or getting a preview, checkout the
[Xazure Demo](https://github.com/samanime/xazure-demo). Get that running
and check out the code. I'll update READMEs more and more and begin other
documentation as it gets closer to beta. I expect it to progress to beta fairly quickly.

If you have questions in the meantime, feel free to contact me at [christian.snodgrass.open@gmail.com](mailto:christian.snodgrass.open@gmail.com)
or post on [StackOverflow](https://stackoverflow.com) with the tag `xazure` (just make sure the question 
[follows StackOverflow's guidelines](https://stackoverflow.com/help/how-to-ask)). 

## Philosophy

By default, Xazure framework basically does nothing. This is by design. It gives you full
control over what it does by adding modules as you choose. Modules are flexible packages
that can do everything from adding data manipulation, new pages, data models, etc.

## Technologies

  - `Express` - For serving pages and routing.
  - `MongoDB` - For data storage.
  - `Xazure Event Manager` - An async-first event manager.
  - `Xazure Logger` - An easy-to-use, configurable, extensible logger.
  
## Package Naming Conventions

  - `xazure` - This project, the core of the framework.
  - `xazure-module-*` - A module that works with `xazure`.
  - `xazure-template-*` - A template for creating some type of package (module, theme, etc.).
  - `xazure-theme-*` - A theme which works with the `xazure-module-theme` package.
  - `xazure-logger-*` - A logging module for the `xazure-logger` package.
  - `xazure-builder-*` - A builder for automatically building other packages with `xazure`.
  - `xazure-*` - Miscellaneous packages, some of which can work standalone.
  
## Build Pipeline

`xazure` will automatically build package(s) as required (including itself). 
It will look at the package's `package.json` for a `xazure` property. If the property is an object, 
it will look for the `type` property, otherwise, it will assume the property is the value it needs.

**Note**: If you pull down the repo itself, you'll need to run `npm run build` at least once before
you can use the `xazure` command.

It will then use a `xazure-builder-*` of that type (e.g., if `xazure` in `package.json` is "module", it
will use `xazure-builder-module` to build it). If it doesn't have an appropriate builder, it will first
look in the parent of the current directory for a directory named `xazure-builder-${type}`. If found,
it'll run `npm run build` in that directory and use it. If not, it will attempt to download one for any type value 
except "custom". If it encounters "custom", it will attempt to run the script `xazure:build` (or `build`) or `xazure:watch` (or `watch` or `start`) (depending on if it was started with
`build`, `watch`, or `dev-mode` (which also uses watch)). If those commands exist, it will happily
use them as appropriate. If they don't, it'll take no action for the package for building (i.e., you
have to build it yourself).

If `xazure` finds the package at the same level as the current package, it will build it. Otherwise
it'll assume it's a third-party library and not do anything with it. For example, given the following folder
structure:

  - projects
    - xazure-demo
    - xazure-module-posts
    - xazure-module-theme
    
If you run `xazure build` from the `xazure-demo` folder, it will also build and link the local
`xazure-module-posts` and `xazure-module-theme` directories. Any other `xazure-*` packages it will
ignore and just let them be treated as normal NPM dependencies.

Builders exist for the following types:

  - builder - Builder for builders themselves, including itself.
  - app - Builds a project that contains a config file. Builds module files and config files.
  - module - Builds modules
  - theme - Builds themes
  - logger - Builds `xazure-logger` modules
  - utility  - Builds generic utilities (`xazure-logger`, `xazure-event-manager`, etc)
  
Some builders may accept configuration, which can be provided in `package.json` under the `xazure` key.

To use the builders, you must have a directory/file structure compatible with the particular builder.

You can run `xazure build` or `xazure watch` from any package directory, and it will build or watch
that package (note: have `xazure` as a `devDependency`). You can also run `xazure dev-mode` from a
project that contains a `config` file (`type === 'app'`), and it will build and run everything.

Downside of `type: custom` is it can't handle restarting the server when it should.
  
## TODO

  - Add way to specify HTTP error pages.
  - Add error handler registering.
  - Add help to CLI.
  - Pipeline
    - Add way to have builder config within module itself for 'custom' builds.
    - Add 'jsnext:main' and 'module' into the pipeline, handle in an automatic way
    - Make it not restart things when updating public files
    - Allow `xazure` to build/watch its own modules
    - When restarting builds, rebuild builders first.
    - Only restart builds that need to be restarted.
    - Add support for `custom` builds
    - Figure out a way to have `xazure dev-mode` auto-rebuild `core`, `builder`, `builder-builder`.
    - Figure out a `lerna`-friendly way to have `builder` and`builder-builder`, built with builders.
    - Fix potential issue with trying to use builder-builder before it is built.