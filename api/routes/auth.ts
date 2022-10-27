import type { FastifyInstance, RegisterOptions } from 'fastify'
import nodemailer from 'nodemailer'
import type { EntityRepository, MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { UniqueConstraintViolationException } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'
import { User } from '@/api/entities/user.entity'
import { isEmail } from '@/shared/validators/isEmail'

type AuthRegisterOptions = RegisterOptions & {
  orm: MikroORM<IDatabaseDriver<Connection>>
}

const authRoutes = async (server: FastifyInstance, opts: AuthRegisterOptions): Promise<void> => {
  const userRepository: EntityRepository<User> = opts.orm.em.getRepository(User)

  server.post('/register', async (request, reply) => {
    const body = request.body as {
      email: string
    }
    if (body.email !== null && body.email.length > 0 && isEmail(body.email)) {
      const data = {
        email: body.email
      }
      try {
        const user: User = userRepository.create(data)
        await userRepository.persistAndFlush(user)
      }
      catch (error) {
        let message = 'general-error'
        if (error instanceof UniqueConstraintViolationException) {
          message = 'email-exists'
        }
        if (error instanceof Error) {
          message = error.message
        }
        await reply.status(400).send({
          message: message
        })
      }
      await reply
        .code(200)
        .send({
          message: 'success'
        })
    }
    await reply
      .code(400)
      .send({
        message: 'email-wrong'
      })
  })

  server.post('/send-code', async (request, reply) => {
    const body = request.body as {
      email?: string
    }

    if (body.email !== undefined && body.email.length > 0 && isEmail(body.email)) {
      const testAccount = await nodemailer.createTestAccount()

      const user = await userRepository.findOne({
        email: body.email
      })

      if (user === null) {
        await reply
          .code(400)
          .send({
            message: 'email-wrong'
          })
      }
      else {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
          }
        })

        const code = uuidv4()
        // add two hours to current time
        const codeValidTo = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
        // generate code required to login
        userRepository.assign(user, {
          code: code,
          codeValidTo: codeValidTo
        })
        await userRepository.flush()

        // send mail with defined transport object
        const message = {
          from: '"Fred Foo" <foo@example.com>',
          to: user.email,
          subject: 'The code',
          text: `The code is ${code}`,
          html: `<p>The code is ${code}</p>`
        }

        try {
          const info = await transporter.sendMail(message)
          await reply
            .code(200)
            .send({
              message: nodemailer.getTestMessageUrl(info)
            })
        }
        catch (error: unknown) {
          if (error instanceof Error) {
            await reply
              .code(400)
              .send({
                message: error.message
              })
          }
        }
      }
    }

    await reply
      .code(401)
      .send({
        message: 'email-wrong'
      })
  })

  server.post('/login', async (request, reply) => {
    const body = request.body as {
      code?: string
    }

    const user = await userRepository.findOne({
      code: body.code,
      codeValidTo: {
        $gt: new Date()
      }
    })

    if (user == null) {
      await reply
        .code(401)
        .send({
          message: 'wrong-code'
        })
    }
    else {
      const session: Types.Session = {
        email: user.email
      }
      request.session.set('user', session)
      await reply
        .code(200)
        .send({
          message: 'email-ok'
        })
    }
  })

  server.post('/logout', async (request, reply) => {
    const data: Types.Session | undefined = request.session.get('user')
    if (data === undefined) {
      await reply
        .code(401)
        .send({
          message: 'session-empty'
        })
    }
    request.session.delete()
    return data
  })

  server.get('/is-logged-in', async (request, reply) => {
    const data: Types.Session | undefined = request.session.get('user')
    if (data === undefined) {
      await reply
        .code(401)
        .send({
          message: 'session-empty'
        })
    }
    await reply
      .code(200)
      .send({
        message: 'session-exists'
      })
  })
}

export {
  authRoutes
}
