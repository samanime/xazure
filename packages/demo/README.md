# Xazure CMS Demo

A basic demo of Xazure CMS.

## ALPHA

Xazure CMS and related packages are still in alpha. You are free to use them,
but be aware that the APIs or functions may change.

If you'd like to try it out and would like more info, check out the
README of [Xazure CMS](https://github.com/samanime/xazure-cms]). 

And yes, there will be unit tests by the time it goes to beta. ;)

## Initial Setup

You will need a MongoDB running to use this. You can run one locally, or
create a free one on [Mongo Atlas](https://www.mongodb.com/cloud/atlas).

Copy `config.private.template.js` to `config.private.js`:

  cp config.private.template.js config.private.js
  
Put your MongoDB URL in `config.private.js`. 

**Important Note**: `config.private.js` is where you should store private values and should not be included in your 
repository if you publish it publicly.

You're all setup.

## Running

After initial setup:

    npm start
  
Site will be available at `localhost:8000`.

## Create Admin Account

Go to `localhost:8000/register` and register an account. Then edit your MongoDB database
directly. Add the `admin` role to the `roles` array for the user you just created. You'll
now have access to `localhost:8000/admin` with this user.

## Pages

  - `localhost:8000/register` - Register user accounts
  - `localhost:8000/login` - Login page
  - `localhost:8000/logout` - Logs out and redirects to home page
  - `localhost:8000/admin` - The admin control panel, requires an admin account.
  
After creating some pages, you'll be able to view them with:

  - `localhost:8000/<post.type>/<post.slug>`