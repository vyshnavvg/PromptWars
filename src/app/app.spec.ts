import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { GeminiCrisisService } from './core/services/gemini-crisis.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the individual help flow by default', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Immediate Cognitive-Zero Emergency Recovery');
    expect(compiled.textContent).not.toContain('Caregiver Crisis Response Ready to Assist');
  });

  it('should switch to the caregiver flow when the persona changes', async () => {
    const fixture = TestBed.createComponent(App);
    const crisisService = TestBed.inject(GeminiCrisisService);

    crisisService.setPersona('caregiver');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Caregiver Crisis Response Ready to Assist');
    expect(compiled.textContent).not.toContain('Immediate Cognitive-Zero Emergency Recovery');
  });
});
