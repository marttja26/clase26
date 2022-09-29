import { format } from 'winston';
import winston from 'winston';
const LEVEL = Symbol.for('level');

const filterOnly = (level) => {
	return format( (info) => {
		if (info[LEVEL] === level) {
			return info;
		}
	})();
};

const logger = winston.createLogger({
	transports: [
		new winston.transports.File({
			name: 'warn-file',
			filename: 'logs/warn.log',
			level: 'warn',
            format: filterOnly('warn'),
		}),
		new winston.transports.File({
			name: 'error-file',
			filename: 'logs/error.log',
			level: 'error',
		}),
		new winston.transports.Console({ level: 'info' }),
	],
});

export default logger;
