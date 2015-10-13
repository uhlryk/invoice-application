# invoice-application

REST API of application which manages invoices and contractors.
Application written in node.js express 4.

Application was prepared to manage Polish invoices.

There is client side application https://github.com/uhlryk/invoice-application-client

## Features:
Add, list, edit, delete, show contractors
Edit contractors create new entry for contractor (old entries are for archive or for generate old invoices with old contractor data)
Delete contractors set entries as archive.
Add, list, show invoices
Generate pdf of invoice

## Limitations:
Only one company data to 'from' field. Purpose of this application is to help one company to manage invoices. It is not saas application!
In this version it is not posible to create invoice correction.

## Warning:
Im not domain expert about invoices. They may be wrong.

## Running Locally

Make sure you have node.js and the postgres installed. Postgres shoud running.

```
git clone https://github.com/uhlryk/invoice-application.git
cd invoice-application
npm install
```

duplicate config/config-template.js and rename it to config/config.js
Edit config.js fill your data.
```
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/) - or port you setup.

## Change DB
Application use sequelize orm. You can download connector for other db,configure it and run.
And setup new db in config/config.js

## Running test

```
npm test
```

## License
MIT