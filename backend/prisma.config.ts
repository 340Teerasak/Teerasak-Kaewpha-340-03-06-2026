import path from 'path'
import { defineConfig } from 'prisma/config'

const { config } = require('dotenv')
config()

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
