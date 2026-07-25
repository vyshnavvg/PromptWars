import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { ApiKeyModalComponent } from './api-key-modal.component';
import { GeminiCrisisService } from '../../core/services/gemini-crisis.service';

describe('ApiKeyModalComponent', () => {
  let fixture: ComponentFixture<ApiKeyModalComponent>;
  let setApiKeySpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    setApiKeySpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ApiKeyModalComponent],
      providers: [
        {
          provide: GeminiCrisisService,
          useValue: {
            apiKey: signal('saved-key'),
            setApiKey: setApiKeySpy
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApiKeyModalComponent);
    fixture.detectChanges();
  });

  it('should trim and save the entered key', () => {
    const component = fixture.componentInstance;
    vi.spyOn(component.close, 'emit');

    component.keyInput.set('  live-key  ');
    component.save();

    expect(setApiKeySpy).toHaveBeenCalledWith('live-key');
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should clear the key and update the modal state', () => {
    const component = fixture.componentInstance;

    component.clearKey();

    expect(component.keyInput()).toBe('');
    expect(setApiKeySpy).toHaveBeenCalledWith('');
  });
});