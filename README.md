# [login-with.link](login-with.link)

## About

Login With Link aims to be the simplest, most lightweight authentication solution available.

It's a service that allows your users to authenticate via an emailed link - they're provisioned a JWT and redirected to your site where you can use that token to identify them.

## Technical

This project uses Firebase for functions database storage and web hosting; it's an SPA using React / Chakra UI for frontend components, Navigo for routing and Browserify / Babel for building.

## Development

1. Download this Git repo.

### Backend

This project uses Firebase Functions (basically Google Cloud Functions) and Firebase Firestore - both of which can be run locally via the emulator.

1. Install function deps: `cd functions; yarn; cd ..`
2. Make local copy of default DB contents: `yarn setup_emulator` (this copies `default_data` to `firebase_data`, where the emulator expects to find it)
3. Start the emulator: `yarn emulator` (most easily managed in its own terminal)

### Frontend
1. Install web dependencies: `yarn`
2. Run build or watch process: `yarn build` or `yarn watch` (for single or persistent building, respectively)
3. Start live refresh server: `yarn serve` (most easily managed in a different terminal to above)

## Deployment

`deploy_all` deploys both the front and backends (it requires that you are authenticated, with permission for this Firebase project) - it runs `deploy_functions` and `deploy_hosting` - the latter builds the frontend first, with some env vars baked into the process for the production version of the site.


