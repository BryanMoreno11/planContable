import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlancuentaComponent } from './plancuenta.component';

describe('PlancuentaComponent', () => {
  let component: PlancuentaComponent;
  let fixture: ComponentFixture<PlancuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlancuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlancuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
