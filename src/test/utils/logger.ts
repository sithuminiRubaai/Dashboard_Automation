import fs from 'fs';
import path from 'path';
import { transports, format } from 'winston';

function sanitizeScenarioName(scenarioName: string): string {
    return scenarioName.replace(/[<>:"/\\|?*\s]+/g, '_').trim() || 'scenario';
}

export function options(scenarioName: string) {
    const safeScenarioName = sanitizeScenarioName(scenarioName);
    const logDir = path.join(process.cwd(), 'test-result', 'logs', safeScenarioName);
    const logFile = path.join(logDir, 'log.log');

    fs.mkdirSync(logDir, { recursive: true });

    return {
        transports: [
            new transports.File({
                filename: logFile,
                level: 'info',
                format: format.combine(
                    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                    format.align(),
                    format.printf((info) => `${info.level}: ${info.timestamp}: ${String(info.message)}`)
                )
            }),
            new transports.Console({
                level: 'info',
                format: format.combine(
                    format.colorize(),
                    format.simple()
                )
            })
        ]
    };
}
