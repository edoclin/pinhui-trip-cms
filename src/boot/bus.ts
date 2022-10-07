
import { boot } from 'quasar/wrappers'

import { EventBus } from 'quasar'
export default boot(async ({ app}) => {
  const bus = new EventBus()
  // for Composition API
  app.provide('bus', bus)
})
