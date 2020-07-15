# Federated login starter

Small example of a Node JS server with federated login

## How to run
First you will need to configure your SAML Identity Provider.
I used Azure Active Directory as I had it available, but I read that https://samltest.id/ is good too for testing.
You will need to open "index.ts" and put the configuration for the endpoint in the Strategy configuration.

Second, you will need to serve the page over https.
This is not actually mandatory, but Azure does not let you set http endpoints.
You will need to put the certificates in the `src` folder.
This is a command to generate self-signed certificates:

    openssl req -nodes -new -x509 -keyout server.key -out server.cert

Finally, you need to run

    yarn
    yarn build
    yarn start

And it should work
