## Documentation

__Login With Link__ is designed to be a ultralight authentication option, suitable for very simple or experimental projects.

The process is simple: you link your prospective or returning user to our login page, where they provide an email address. We send a login link to that email address - following that link will send them to your site with a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) embedded in the URL for you to extract and use.

### Usage

As described above, When we link you your user back to your site we'll include a JWT in the URL. These tokens are a popular standard for identifying a user - they store various claims (in our case an email address and a user id unique to that email address) and a cryptographic signature so you can verify that it's a legitimate token, issued by us.



### Configuration

The 'Admin' button above will take you to the admin console, allowing you to create client configurations for each of your projects. For each client you can create multiple keys, making it easier to separate credentials for different environments - say, production, staging and development.

When editing client configuration, you'll see the following fields:

 - __Client Name__ - assign your config a memorable name, like "Awesome Project".
 - __Key Name__ - each key in your client should have a unique name, like 'production'.
 - __Unique Key__ - as well as a human-readable Key Name, each key has a machine-readable identifier, which is used when accessing the Login With Link service.
 - __Secret__ - the secret used to sign the JWT, which you can then use to verify the JWT came from us.
 - __Return URL__ - the URL of your site, where the authenticated user should end up. (This URL will automatically have the JWT merged into its parameters, as `lwl-token`.)
- __Login Link__ - below the key details we show the login link you should use - click it to try it out, then copy it to use in your site.
