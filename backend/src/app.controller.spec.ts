import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Public, dependency-free endpoints — no DB needed.
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /', () => {
    it('returns the hello string', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('GET /health', () => {
    it('reports an ok status payload', () => {
      const result = appController.healthCheck();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('os-land-api');
      expect(typeof result.timestamp).toBe('string');
      expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
    });
  });
});
