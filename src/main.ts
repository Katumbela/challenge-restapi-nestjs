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

  // Middleware de segurança
  app.use(helmet());
 
  app.use(cookieParser());

  // Middleware de CSRF com exclusão para a rota de login
  app.use(new CsrfExcludeMiddleware().use.bind(new CsrfExcludeMiddleware()));

  // Rota para obter o token CSRF
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