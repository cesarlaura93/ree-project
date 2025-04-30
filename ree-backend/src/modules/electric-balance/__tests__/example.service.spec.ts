import { Test, TestingModule } from '@nestjs/testing';

// Servicio de ejemplo para las pruebas
export class ExampleService {
  getData(): string {
    return 'Datos de ejemplo';
  }
}

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExampleService],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe devolver "Datos de ejemplo"', () => {
    expect(service.getData()).toBe('Datos de ejemplo');
  });
});
