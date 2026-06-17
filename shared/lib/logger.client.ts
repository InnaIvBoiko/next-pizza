// Client-side logger: a thin wrapper over `console` with the same call
// signature as the server (Pino) logger, so call sites look identical:
//   logger.info('message')
//   logger.error({ err }, 'message')
//
// In production only warn/error reach the console; debug/info are dropped to
// avoid noisy/leaky browser logs. This does NOT persist logs anywhere — wire a
// `/api/log` endpoint or an error-reporting SDK if client errors need to be
// collected.
'use client';

type LogMethod = (objOrMsg: unknown, msg?: string, ...rest: unknown[]) => void;

interface AppLogger {
    debug: LogMethod;
    info: LogMethod;
    warn: LogMethod;
    error: LogMethod;
}

const isDev = process.env.NODE_ENV !== 'production';

// Pino logs as (obj, msg); console reads best as (msg, obj). Reorder so the
// message comes first when an object is passed.
function format(args: unknown[]): unknown[] {
    if (args.length >= 2 && typeof args[0] === 'object' && args[0] !== null) {
        const [obj, msg, ...rest] = args;
        return [msg, obj, ...rest];
    }
    return args;
}

export const logger: AppLogger = {
    debug: (...args) => {
        if (isDev) console.debug(...format(args));
    },
    info: (...args) => {
        if (isDev) console.info(...format(args));
    },
    warn: (...args) => console.warn(...format(args)),
    error: (...args) => console.error(...format(args)),
};
