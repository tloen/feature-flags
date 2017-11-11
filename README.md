# feature-flags
Feature flag feature for team collaboration

## The Frontend

Ideally, I'd probably use a static React frontend if I had the time. This would give me easier control over the user interface, more responsive UI elements, and a more defined structure to the codebase. But networking/API logic for single-page apps is time-consuming, and it's probably not worth it for an application as simple as this one. In terms of the bare minimum, everything we need can be provided by raw HTML: we can use checkboxes to enable and disable features, and forms to submit new features (or delete old ones?). 

To simplify the visual design further, I'm going to segment the environments so that our directory structure looks something like this:

* /app - the main page
    + links to each environment
    + add feature: HTML form (textbox)
    + add namespace: HTML form (textbox)
    + add feature to existing namespace: HTML form (textbox + dropdown)
* /app/NAME_OF_ENVIRONMENT - the environment page
    + HTML list of features/namespaces
        - Feature in a namespace is a sub-item of the namespace
    + Each feature displays whether it is enabled, as well as an ENABLE or DISABLE button
    + Namespaces also have ENABLE ALL/DISABLE ALL buttons
    
These HTML files will be dynamically rendered upon request using the Pug templating engine and populated with data from a database query.

## The API

The following API endpoints would exist if I were rendering the page client-side:
* GET /api - guide to endpoints
* GET /api/features - will return all features
* GET /api/namespaces - will return all namespaces
* GET /api/environments - will return all environment names
* GET /api/environments/ENVIRONMENT_ID/ - will return all features of a given environment

The following endpoints still need to exist:
* POST /api/features/FEATURE_NAME - creates feature
* PUT /api/features/FEATURE_NAME/environment/ENVIRONMENT_NAME - toggles feature with name. Has issues. Change as soon as possible.

The response from both of these endpoints should be a 200 and a refreshing of the client.

## The Data Model

I'll be the first to admit that I'm not that great with relational databases. I'm going to save the exact data model for last; I *know* that relational databases are the the ideal tool for this, but if I run out of time I can just use MongoDB.

