# Xazure Builder - Module

Builds Xazure packages which specify a type of `module` and conform to the [required structure](#built-project-structure)

## Built Project Structure

Expects there to be a directory named `src`. It must include an `index.js` directly inside.

Optionally, there may be a `public` directory in `src`.

    - src
     - index.js
     - public
     
 Any other files may appear anywhere. Files are output to the `dist` folder and this will be cleaned
 before each built (i.e., don't put files in here directly).

## Build Process

 - Any `.js` files will not in `public` will be built with Babel, with `modules: true`.
 - Any `.js` files inside `public` will be built with Babel, with `modules: false`.
 - Any `index.css` files anywhere within `public` will be built with PostCSS.
   - Note: This means any non-`index.css` files should be imported by one of the `index.css` files.
 - Any other files will be copied over as is.
 
Built files will be output to `dist`.

Directory structure for all files (except skipped CSS files) will be maintained and mirrored.

## Babel Plugins and Presets

The following plugins are included by default:

 - env
 
For public files, `modules: false` is set. For non-public files, it is left default (`modules: true`).

The following presets are included by default:

 - transform-object-rest-spread
 
For `public`, `import-rename` is also added and configured so it'll auto-append `.js` when appropriate.

## PostCSS Plugins

The following plugins are included:

 - cssnext
 - import
 - nested
 
You can define (or disable) plugins in the [configuration](#configuration).

## Configuration

The following configuration can be defined under the `xazure` key in `package.json` or in a 
`xazure.config.js` file:

      {
        "type": "module",
        "postCss": {
          "plugins": [],
          "disable": []
        },
        "babel": {
          "private": {
            "plugins": [],
            "presets": [],
            "disablePlugins": [],
            "disablePresets": []
          },
          "public": {
            "plugins": [],
            "presets": [],
            "disablePlugins": [],
            "disablePresets": []
          }
        }
      }
  
 - `type` - While not used by the builder itself, if provided a configuration, needed to direct it to this builder.
 - `postcss.plugins` - Provide additional plugins for `PostCSS`. Provide them just as you would in a `postcss.config.js` file.
 - `postcss.disable` - Disable one of the predefined plugins listed in the [PostCSS Plugins](#postcss-plugins) section.
 - `babel.public` - Configuration for the public JS files.
   - `.plugins` - Plugins to add, same as `.babelrc`. Provide a default one to override options.
   - `.presets` - Presets to add, same as `.babelrc`. Provide a default one to override options.
   - `.disablePlugins` - Plugins to remove from defaults. See [Babel Plugins and Presets](#babel-plugins-and-presets).
   - `.disablePresets` - Presets to remove from defaults. See [Babel Plugins and Presets](#babel-plugins-and-presets).
 - `babel.private` - Configuration for the non-public JS files.
   - `.plugins` - Plugins to add, same as `.babelrc`. Provide a default one to override options.
   - `.presets` - Presets to add, same as `.babelrc`. Provide a default one to override options.
   - `.disablePlugins` - Plugins to remove from defaults. See [Babel Plugins and Presets](#babel-plugins-and-presets).
   - `.disablePresets` - Presets to remove from defaults. See [Babel Plugins and Presets](#babel-plugins-and-presets).