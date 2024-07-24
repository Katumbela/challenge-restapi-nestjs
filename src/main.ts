import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { CsrfExcludeMiddleware } from './middleware/csfr-middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

   
  app.use(helmet());
 
  app.use(cookieParser());

   
  app.use(new CsrfExcludeMiddleware().use.bind(new CsrfExcludeMiddleware()));

  
  app.use((req, res, next) => {
    if (req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
  });
  

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}

bootstrap();