# discord9k

**Discord9k** is an implementation of the [ROBOT9000](https://blog.xkcd.com/2008/01/14/robot9000-and-xkcd-signal-attacking-noise-in-chat/) algorithm by Randall Munroe from xkcd.com.

In essence, this algorithm forces originality in content submitted to Discord. Whenever a user submits a message, it will be checked in a database. If a message with exactly the same content had been submitted previously, the submitted message will be deleted and the user will receive a timeout. The timeouts increase exponentially.

## Deployment
- Install nodejs, rethinkdb, yarn and git.
- Clone this repository `git clone https://github.com/MrHuds0n/discord9k; cd discord9k`
- Install required packages `yarn`.
- Go to [Discord apps](https://discordapp.com/developers/applications/me) and copy your token.
- Edit the `src/config.js` if you want to change something.
- Run RethinkDB `rethinkdb rethinkdb --cluster-port 31015 --driver-port 32015 --http-port 8090`. (Might want to adjust ports if necessary).
- Run the bot `TOKEN=<your app token> yarn start`.

## Setup
- Join your server with the bot.
- Create a role for your bot with the **Manage messages** permission.
- Create a role named **r9k** (the name is important).
- In your *channel* permissions deny the r9k role the ability to write messages. Do this in channels you want the r9k rule to work.
