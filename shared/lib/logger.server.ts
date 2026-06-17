// Server-side logger (Pino). The `server-only` import makes the build fail if
// this module is ever pulled into a client bundle — import `logger.client`
// from client components instead. Both expose the same call signature:
//   logger.info('message')
//   logger.error({ err }, 'message')
import 'server-only';
import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
    // Strip PII / secrets wherever they appear in a logged object.
    redact: {
        paths: [
            'email',
            '*.email',
            'user.email',
            'password',
            '*.password',
            'token',
            '*.token',
            'authorization',
            '*.authorization',
            'headers.authorization',
            'headers["stripe-signature"]',
            'stripeSignature',
            '*.stripeSignature',
        ],
        censor: '[redacted]',
    },
    // In production log plain JSON to stdout and let the platform collect it.
    // pino-pretty runs in a worker thread, so it's dev-only on purpose.
    ...(isDev
        ? {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'SYS:HH:MM:ss',
                      ignore: 'pid,hostname',
                  },
              },
          }
        : {}),
});
