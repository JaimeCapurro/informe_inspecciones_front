import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenerateFormComponent } from './modal-generate-form.component';

describe('ModalGenerateFormComponent', () => {
  let component: ModalGenerateFormComponent;
  let fixture: ComponentFixture<ModalGenerateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGenerateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGenerateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
