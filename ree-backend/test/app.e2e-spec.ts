import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { SchedulerModule } from 'src/modules/scheduler.module';

// Define a mock scheduler module
@Module({})
class MockSchedulerModule {}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideModule(SchedulerModule)
    .useModule(MockSchedulerModule)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const configService = app.get(ConfigService);
    const dbUri = configService.get('database.uri');
    console.log('DEBUG: MongoDB URI used in test:', dbUri);

  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
