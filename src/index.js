import { Client } from 'discord.js'
import chalk from 'chalk'
import { config } from './config'

import { r } from './util/thinky'
import { User } from './models/user'
import { Message } from './models/message'

const {log} = console
const client = new Client()

const WELCOME_MESSAGE = `
______   ___   _______  _______  _______  ______    ______   _______  ___   _
|      | |   | |       ||       ||       ||    _ |  |      | |  _    ||   | | |
|  _    ||   | |  _____||       ||   _   ||   | ||  |  _    || | |   ||   |_| |
| | |   ||   | | |_____ |       ||  | |  ||   |_||_ | | |   || |_|   ||      _|
| |_|   ||   | |_____  ||      _||  |_|  ||    __  || |_|   ||___    ||     |_
|       ||   |  _____| ||     |_ |       ||   |  | ||       |    |   ||    _  |
|______| |___| |_______||_______||_______||___|  |_||______|     |___||___| |_|
`

client.on('ready', () => {

  log(chalk.bold.red(WELCOME_MESSAGE))

  client.guilds.map((guild) => {
    log("Connected to " + chalk.blue(guild.name) + " @ " + chalk.gray(guild.id))

    //Remove all r9k roles from all users the bot is in on connect.
    removeR9K(guild)

    setInterval(() => {
      User.filter(r.row("timeout").gt(1000))
      .run()
      .then(result => {
        log("Halving the timeout of each member (decay trigger).")

        for(let each of result) {
          each.timeout = Math.floor(each.timeout / 2)
          each.save()
        }
      })
    }, config.decay)
  })

  console.log("Ready!");
})

client.on('message', msg => {

  //THE MIGHTY R9K ALGORITHM!!11
  Message.filter({ //Check if a message exists in the db.
    channel: msg.channel.id,
    content: msg.content
  })
  .run()
  .then(result => {
    if(result[0]) { //If a result was found, delete the new message.
      msg.delete().catch(console.error)

      log("Found unoriginal message: " + chalk.magenta(msg.content) + " @ " + chalk.gray(msg.channel.id))

      //Check if the offender exists in the db.
      User.filter({
        snowflake: msg.member.id,
        channel: msg.channel.id
      })
      .run()
      .then(result => {
        let timeout = 0

        if(result[0]) {
          result[0].timeout *= config.multiplier
          result[0].save()
          timeout = result[0].timeout
        }
        else {
          User.save({
            snowflake: msg.member.id,
            channel: msg.channel.id,
            timeout: config.start
          })

          timeout = config.start
        }

        getR9K(msg.guild)
        .then(r9k => {
          msg.member.addRole(r9k)
          log("Timing out " + chalk.yellow(msg.member.displayName) + " for " + chalk.cyan(timeout+"ms"))

          setTimeout(() => {
            msg.member.removeRole(r9k)
            log("Timeout ended for " + chalk.yellow(msg.member.displayName) + " for " + chalk.cyan(timeout+"ms"))
          }, timeout)
        })

      })

    }
    else { //If not, save the message into the db.
      Message.save({
        channel: msg.channel.id,
        content: msg.content
      })
      .then(result => {
        log("Saved: " + chalk.magenta(`'${result.content}'`) + " @ " + chalk.gray(result.channel));
      })
      .error(error => {
        log(chalk.red(error));
      })
    }
  })
})

client.login(process.env.TOKEN)

// Find the R9K role in a guild.
async function getR9K(guild) {
  return new Promise((resolve, reject) => {
    guild.roles.map(role => {
      if(role.name == 'r9k') {
        log("Found role " + chalk.green(role.name) + " in " + chalk.blue(guild.name))
        resolve(role)
      }
    })
  })
}

//Remove all R9K roles in a guild.
async function removeR9K(guild) {
  await getR9K(guild)
  .then(role => {
    guild.members.map(member => {
      if(member.roles.exists("name", "r9k")) {
        member.removeRole(role)
        .then(() => {
          log("Removed r9k from " + chalk.yellow(member.displayName))
        })
        .catch(err => {
          log(chalk.blue(guild.name) + ": " +chalk.red(err))
        })
      }
    })
  })
  .catch(err => {
    log(chalk.red(err))
  })
}
