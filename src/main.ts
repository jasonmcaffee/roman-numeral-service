import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateOpenApiSpecAndWriteItToDisk } from './utils/openApiSpecGenerator';
import appConfig from './config/appConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await generateOpenApiSpecAndWriteItToDisk(app);
  const port = appConfig.getPort();
  await app.listen(port);
}
bootstrap();
