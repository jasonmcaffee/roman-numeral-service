import { Module } from '@nestjs/common';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import appConfig from './config/appConfig';
import pino from 'pino';

// Recursive function to scan subdirectories for files with a given suffix
// This allows us to register controllers, services, etc by convention, rather than through explicit imports.
function loadModules(directory: string, suffix: string): any[] {
  let modules: any[] = [];

  readdirSync(directory).forEach((file) => {
    const fullPath = join(directory, file);
    if (statSync(fullPath).isDirectory()) {
      // Recursively scan subdirectories
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      modules = [...modules, ...loadModules(fullPath, suffix)];
    } else if (file.endsWith(suffix)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
      const module = require(fullPath);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      modules.push(module.default || Object.values(module)[0]);
    }
  });

  return modules;
}

// Dynamically load controllers and services
const controllers = loadModules(join(__dirname, 'controllers'), '.controller.js');
const services = loadModules(join(__dirname, 'services'), '.service.js');

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: appConfig.isProduction() ? 'trace' : 'info',
        stream: pino.destination('/app/logs/roman-numeral-service.log'),
      },
    }),
    DatadogTraceModule.forRoot(),
  ],
  controllers,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  providers: [...services],
})
export class AppModule {}
