import {thinky} from '../util/thinky'
const {type} = thinky

export const User = thinky.createModel("User", {
  id: type.string(),
  snowflake: type.string(),
  channel: type.string(),
  timeout: type.number()
})
