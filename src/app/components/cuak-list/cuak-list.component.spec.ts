import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuakListComponent } from './cuak-list.component';

describe('CuakListComponent', () => {
  let component: CuakListComponent;
  let fixture: ComponentFixture<CuakListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuakListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuakListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
