import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallDetailComponent } from './recall-detail.component';

describe('RecallDetailComponent', () => {
  let component: RecallDetailComponent;
  let fixture: ComponentFixture<RecallDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecallDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
