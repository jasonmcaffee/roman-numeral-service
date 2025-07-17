import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateOpenApiSpecAndWriteItToDisk } from './utils/openApiSpecGenerator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await generateOpenApiSpecAndWriteItToDisk(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
