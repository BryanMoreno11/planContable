import { TestBed } from '@angular/core/testing';

import { PlancuentaService } from './plancuenta.service';

describe('PlancuentaService', () => {
  let service: PlancuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlancuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
