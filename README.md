# CRM Ticket system API

This api is part of create crm ticket system with MERN stack from scratch..

# How to use

- run `git clone ... `
- run `npm install`
- run `npm start`

Note : Make sure you have nodemon is installed in your system otherwise you can install as a dev dependencies in the project

# API Resources

### User API Resources

All the user API Router follows `/v1/user/`

| #    | ROuters                           | Verbs | Progress | Is Private | Description                                      |
| ---- | --------------------------------- | ----- | -------- | ---------- | ------------------------------------------------ |
| 1--- | `/v1/user/login`                  | POST  | Done     | NO         | Verify user Authentication and return jwt        |
| 2--- | `/v1/user/reset-password` | POST  | TODO     | NO         | Verify email and email pin to reset the password |
| 3--- | `/v1/user/reset-password`         | PATCH   | TODO     | NO         | Replace with new                                 |
| 4--- | `/v1/user`                        | GET   | TODO     | yes        | Get users Info                                   |

### Ticket API Resources

All the user API Router follows `/v1/ticket/`

| #    | ROuters                        | Verbs | Progress | Is Private | Description                            |
| ---- | ------------------------------ | ----- | -------- | ---------- | -------------------------------------- |
| 1--- | `/v1/ticket`                   | GET   | TODO     | Yes        | Get all ticket for the logined in user |
| 2--- | `/v1/ticket/{id}`              | GET   | TODO     | Yes        | Get a ticket details                   |
| 3--- | `/v1/ticket}`                  | POST  | TODO     | yes        | create a new ticket                    |
| 2--- | `/v1/ticket/{id}`              | PUT   | TODO     | Yes        | Update ticket details is reply message |
| 4--- | `/v1/ticket/close-ticket/{id}` | PUT   | TODO     | yes        | Update ticket details is reply message |

All the Tokens API router follows `/v1/tokens/`

| #    | Routers      | Verbs | Progress | Is Private | Description            |
| ---- | ------------ | ----- | -------- | ---------- | ---------------------- |
| 1--- | `/v1/tokens` | GET   | Done     | NO         | Get a fresh access JWT |


<!-- Time to start 8:52:32 -->