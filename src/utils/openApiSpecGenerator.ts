import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs/promises';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';

/**
 * Function which uses the nest app to generate an openapi spec and write it to disk.
 * @param app
 * @param pathToWriteTo
 */
export async function generateOpenApiSpecAndWriteItToDisk(
  app: INestApplication,
  pathToWriteTo = join(__dirname, '../..', 'src', 'roman-numeral-openapi-spec.json'),
) {
  const config = new DocumentBuilder().setTitle('Roman Numeral API').setDescription('API for Roman numeral conversions').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config, {
    // Prevent naming ControllerNameEndpointName etc. for operations. Just have it be the endpointName.
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api', app, document);

  // Save the Swagger JSON specification to a file
  // const swaggerPath = join(__dirname, '../..', 'src', 'roman-numeral-openapi-spec.json');
  await fs.writeFile(pathToWriteTo, JSON.stringify(document, null, 2));
}
