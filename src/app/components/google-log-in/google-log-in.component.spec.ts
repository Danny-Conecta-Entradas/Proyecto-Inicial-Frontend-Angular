import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLogInComponent } from './google-log-in.component';

describe('GoogleLogInComponent', () => {
  let component: GoogleLogInComponent;
  let fixture: ComponentFixture<GoogleLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleLogInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
