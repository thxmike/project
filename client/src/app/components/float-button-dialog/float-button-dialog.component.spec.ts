import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatButtonDialogComponent } from './float-button-dialog.component';

describe('FloatButtonDialogComponent', () => {
  let component: FloatButtonDialogComponent;
  let fixture: ComponentFixture<FloatButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatButtonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
