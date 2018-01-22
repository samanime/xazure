# Xazure CMS

A light-weight, ultra flexible content management system.

## ALPHA

Xazure CMS and related packages are still in alpha. You are free to use them,
but be aware that the APIs or functions may change.

If you are interested in helping out or getting a preview, checkout the
[Xazure CMS Demo](https://github.com/samanime/xazure-cms-demo). Get that running
and check out the code. I'll update READMEs more and more and begin other
documentation as it gets closer to beta. I expect it to progress to beta fairly quickly.

If you have questions in the meantime, feel free to contact me at [christian.snodgrass.open@gmail.com](mailto:christian.snodgrass.open@gmail.com)
or post on [StackOverflow](https://stackoverflow.com) with the tag `xazure-cms` (just make sure the question 
[follows StackOverflow's guidelines](https://stackoverflow.com/help/how-to-ask)). 

## Philosophy

By default, Xazure CMS basically does nothing. This is by design. It gives you full
control over what it does by adding modules as you choose. Modules are flexible packages
that can do everything from adding data manipulation, new pages, data models, etc.

## Technologies

  - `Express` - For serving pages and routing.
  - `MongoDB` - For data storage.
  - `Xazure Event Manager` - An async-first event manager.
  - `Xazure Logger` - An easy-to-use, configurable logger.
  
## TODO

  - Add way to specify HTTP error pages.
  - Add error handler registering.