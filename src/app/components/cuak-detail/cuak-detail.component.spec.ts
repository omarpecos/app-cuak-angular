import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuakDetailComponent } from './cuak-detail.component';

describe('CuakDetailComponent', () => {
  let component: CuakDetailComponent;
  let fixture: ComponentFixture<CuakDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuakDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuakDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
