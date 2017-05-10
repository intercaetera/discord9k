import initThinky from 'thinky'
import {db} from '../config'

const thinky = initThinky(db)
const {r} = thinky

export {thinky, r}
