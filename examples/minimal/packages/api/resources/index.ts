import type { ApiContext } from '@semantic-api/core'
import { init } from '@semantic-api/core/server'

const context: Partial<ApiContext> = {
  accessControl: {
    roles: {
      guest: {
        capabilities: {
          person: {
            functions: [
              'hello'
            ]
          }
        }
      }
    }
  }
}

init({ context }).then(server => {
  server.start()
})
