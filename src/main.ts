//ONLY import tracer at the top of main.ts and initialize before EVERYTHING else.
import tracer from 'dd-trace';
tracer.init({
  logInjection: true,
  runtimeMetrics: true, //send cpu, etc
  url: 'http://localhost:8126',
});
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateOpenApiSpecAndWriteItToDisk } from './utils/openApiSpecGenerator';
import appConfig from './config/appConfig';

import { Logger as PinoLogger } from 'nestjs-pino';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  await generateOpenApiSpecAndWriteItToDisk(app);
  const port = appConfig.getPort();
  const logger = new Logger('main');
  logger.log(`App started and is listening on port: ${port}`);
  await app.listen(port);
}
bootstrap();
