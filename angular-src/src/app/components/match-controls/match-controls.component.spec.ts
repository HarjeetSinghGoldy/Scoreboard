import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchControlsComponent } from './match-controls.component';

describe('MatchControlsComponent', () => {
  let component: MatchControlsComponent;
  let fixture: ComponentFixture<MatchControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
