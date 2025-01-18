import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor)

  // enable cors
  app.enableCors({
    origin: 'http://localhost:4200',  // The origin of your frontend Angular app
    credentials: true,  // If your app requires cookies or authentication tokens
  });



  await app.listen(3000);
}
bootstrap();
