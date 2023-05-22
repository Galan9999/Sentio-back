# REST API example application

This is a bare-bones example of a express application providing a REST
API.

The entire application is contained within the `app.`ts file.

`.eslintrc.cjs` is a minimal config file for Eslint, and typescript rules.

`jest.config.cjs` config file for tests.

It uses `jest.integration.config` to config jest integration tests.

## Run the app

    npm start

## Run the tests

    npm run test:unit
    npm run test:integration
    npm run test:coverage

# REST API

Is the back-end API for a structures application. It manages requests to a MongoDB database.

## Get list of Things

### Endpoint HTTP Method(s):

- /structures GET Retrieve a list of all structures
- /structures/:id GET Retrieve a specific structure by ID
- /structures/:id DELETE Delete a specific structure by ID (requires authentication)
- /structures/create POST Create a new structure (requires authentication, image upload, and validation)
- /login POST Authenticate a user (requires validation)
