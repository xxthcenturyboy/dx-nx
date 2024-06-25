# mail

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test mail` to execute the unit tests via [Jest](https://jestjs.io).

## [Sendgrid Mock Reference](https://www.claritician.com/how-to-mock-sendgrid-during-development)

```
With all this in place, you can see the email messages sent by your application in development by opening http://localhost:7000 in your web browser.

Note that this particular Docker image stores the sent email messages in memory and deletes them after 24 hours. Although you can configure after how long the messages are deleted using the MAIL_HISTORY_DURATION environment variable, if you restart the Docker container all the sent messages will be deleted since they are kept in memory.

As far as integration tests are concerned, you can access all the sent messages by issuing a GET request to http://localhost:7000/api/mails.

To clear all sent messages, you can issue a DELETE request to http://localhost:7000/api/mails.
```
