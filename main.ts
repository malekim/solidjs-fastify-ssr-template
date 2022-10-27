import { createServer } from 'vite'
import type { ViteDevServer } from 'vite'
import fastify from 'fastify'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyMiddie from '@fastify/middie'
import fastifySession from '@fastify/secure-session'
import { MikroORM } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { resolve } from 'path'
import { User } from '@/api/entities/user.entity'
import { authRoutes } from '@/api/routes/auth'
import { readFileSync } from 'fs'

const PORT = +(process.env.PORT ?? '3010')
const COOKIE_NAME = process.env.COOKIE_NAME ?? 'fastify-session'
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'stringthatislongerthan32characters'
const SESSION_SALT = process.env.SESSION_SALT ?? '16charsalttttttt'
const DB_NAME = process.env.DB_NAME ?? 'db_name'
const DB_URL = process.env.DB_URL ?? 'mongodb://localhost:27017'

const isProduction = process.env.NODE_ENV === 'production'

let viteDevServer: ViteDevServer

const resolvePath = (...pathSegments: string[]): string => {
  if (isProduction) {
    return resolve(process.cwd(), 'dist', ...pathSegments)
  }
  return resolve(process.cwd(), ...pathSegments)
}

const build = async (): Promise<FastifyInstance> => {
  const server = fastify()

  await server.register(fastifyMiddie)

  if (isProduction) {
    await server.register(fastifyStatic, {
      root: resolvePath('client'),
      prefix: '/',
      // necassary for production build
      index: false
    })
  }

  const orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
    entities: [User],
    allowGlobalContext: true,
    dbName: DB_NAME,
    type: 'mongo',
    clientUrl: DB_URL,
    ensureIndexes: true,
    debug: !isProduction,
    logger: msg => console.error(msg)
  })

  await server.register(fastifySession, {
    cookieName: COOKIE_NAME,
    cookie: {
      secure: true,
      sameSite: 'strict',
      path: '/'
    },
    secret: SESSION_SECRET,
    salt: SESSION_SALT
  })

  if (!isProduction) {
    viteDevServer = await createViteServer()
    await server.use(viteDevServer.middlewares)
  }

  await server.register(async () => {
    await server.register(authRoutes, { prefix: '/v1/auth', orm: orm })
  },
  {
    prefix: '/api/'
  })

  server.setNotFoundHandler(async (request, reply) => {
    const html = await renderApp(request)
    await reply
      .header('Content-Type', 'text/html')
      .send(html)
  })

  return await server
}

const renderApp = async (request: FastifyRequest): Promise<string> => {
  const url: string = request.url
  let html: string = ''
  let render: (url: string) => Promise<{
    head: string
    hydration: string
    body: string
  }>

  try {
    if (isProduction) {
      html = readFileSync(resolvePath('client', 'index.html'), {
        encoding: 'utf-8'
      })
      render = (await import(resolvePath('server', 'entry-server.js'))).render
    }
    else {
      html = await viteDevServer.transformIndexHtml(
        url,
        readFileSync(resolvePath('index.html'), {
          encoding: 'utf-8'
        })
      )
      render = (await viteDevServer.ssrLoadModule(resolvePath('src', 'entry-server.tsx'))).render
    }

    const { head, hydration, body } = await render(url)

    return html
      .replace('<!--app-head-->', head + hydration)
      .replace('<!--app-html-->', body)
  }
  catch (error) {
    if (error instanceof Error) {
      viteDevServer?.ssrFixStacktrace(error)
    }
    console.log(error)
  }
  return ''
}

const createViteServer = async (): Promise<ViteDevServer> => {
  return await createServer({
    root: process.cwd(),
    server: {
      middlewareMode: true
    }
  })
}

build()
  .then(server => server.listen({ port: PORT }, (err, address) => {
    if (err != null) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  }))
  .catch(console.log)
