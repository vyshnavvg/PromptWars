import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { HeaderComponent } from './header.component';
import { GeminiCrisisService } from '../../core/services/gemini-crisis.service';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let setPersonaSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    setPersonaSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: GeminiCrisisService,
          useValue: {
            activePersona: signal<'individual' | 'caregiver'>('individual'),
            apiKey: signal(''),
            setPersona: setPersonaSpy
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should emit modal events and switch personas from the toggle buttons', () => {
    const component = fixture.componentInstance;
    vi.spyOn(component.openInspectorModal, 'emit');
    vi.spyOn(component.openApiKeyModal, 'emit');

    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const caregiverButton = buttons.find((button) => button.textContent?.includes('Caregiver Help'));
    const individualButton = buttons.find((button) => button.textContent?.includes('Individual Help'));
    const inspectButton = buttons.find((button) => button.textContent?.includes('Inspect AI Engine'));
    const apiButton = buttons.find((button) => button.title === 'API Key Configuration');

    caregiverButton?.click();
    individualButton?.click();
    inspectButton?.click();
    apiButton?.click();

    expect(setPersonaSpy).toHaveBeenCalledWith('caregiver');
    expect(setPersonaSpy).toHaveBeenCalledWith('individual');
    expect(component.openInspectorModal.emit).toHaveBeenCalled();
    expect(component.openApiKeyModal.emit).toHaveBeenCalled();
  });
});