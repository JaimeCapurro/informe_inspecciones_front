import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsListingComponent } from './forms-listing.component';

describe('FormsListingComponent', () => {
  let component: FormsListingComponent;
  let fixture: ComponentFixture<FormsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
