import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecallComponent } from './add-recall.component';

describe('AddRecallComponent', () => {
  let component: AddRecallComponent;
  let fixture: ComponentFixture<AddRecallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
