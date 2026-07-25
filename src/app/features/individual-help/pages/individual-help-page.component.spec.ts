import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { IndividualHelpComponent } from './individual-help-page.component';
import { GeminiCrisisService } from '../../../core/services/gemini-crisis.service';
import { MOCK_INDIVIDUAL_CRISIS_DATA } from '../../../core/models/mock-crisis-data';

describe('IndividualHelpComponent', () => {
  let fixture: ComponentFixture<IndividualHelpComponent>;
  let triggerEmergencySynthesisSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    triggerEmergencySynthesisSpy = vi.fn().mockReturnValue(of(MOCK_INDIVIDUAL_CRISIS_DATA));

    await TestBed.configureTestingModule({
      imports: [IndividualHelpComponent],
      providers: [
        {
          provide: GeminiCrisisService,
          useValue: {
            activePersona: signal('individual'),
            isLoading: signal(false),
            currentCrisisData: signal(MOCK_INDIVIDUAL_CRISIS_DATA),
            triggerEmergencySynthesis: triggerEmergencySynthesisSpy
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualHelpComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start the help countdown and show the sms popup when help is triggered', () => {
    const component = fixture.componentInstance;

    component.onHelpTrigger();
    fixture.detectChanges();

    expect(component.callingState()).toBe('calling');
    expect(component.callCountdown()).toBe(10);
    expect(component.showSmsPopup()).toBe(true);

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(component.callCountdown()).toBe(9);

    vi.advanceTimersByTime(2000);
    fixture.detectChanges();

    expect(component.showSmsPopup()).toBe(false);

    vi.advanceTimersByTime(7000);
    fixture.detectChanges();

    expect(component.callingState()).toBe('connected');
    expect(component.callCountdown()).toBe(0);
    expect(triggerEmergencySynthesisSpy).toHaveBeenCalledWith('Big Red Help Button Tapped');
  });
});