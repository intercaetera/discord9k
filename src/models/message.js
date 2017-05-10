import {thinky} from '../util/thinky'
const {type} = thinky

export const Message = thinky.createModel("Message", {
  id: type.string(),
  channel: type.string(),
  content: type.string()
})
