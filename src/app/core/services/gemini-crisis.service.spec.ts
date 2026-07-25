import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { GeminiCrisisService } from './gemini-crisis.service';
import { MOCK_CAREGIVER_CRISIS_DATA, MOCK_INDIVIDUAL_CRISIS_DATA } from '../models/mock-crisis-data';

describe('GeminiCrisisService', () => {
  let service: GeminiCrisisService;

  const clearStorage = () => {
    try {
      globalThis.localStorage?.clear();
    } catch {
      // No-op for environments without localStorage.
    }
  };

  beforeEach(() => {
    clearStorage();
    (window as any).__ANCHORCARE_RUNTIME__ = undefined;
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(GeminiCrisisService);
  });

  afterEach(() => {
    clearStorage();
    delete (window as any).__ANCHORCARE_RUNTIME__;
    vi.useRealTimers();
  });

  it('should default to the individual crisis data', () => {
    expect(service.activePersona()).toBe('individual');
    expect(service.currentCrisisData().headline).toBe(MOCK_INDIVIDUAL_CRISIS_DATA.headline);
  });

  it('should update crisis data when the persona changes', () => {
    service.setPersona('caregiver');

    expect(service.activePersona()).toBe('caregiver');
    expect(service.currentCrisisData().headline).toBe(MOCK_CAREGIVER_CRISIS_DATA.headline);
  });

  it('should store and clear the api key in local storage', () => {
    service.setApiKey('test-key');

    expect(service.apiKey()).toBe('test-key');
    const storage = (() => {
      try {
        return globalThis.localStorage;
      } catch {
        return undefined;
      }
    })();

    if (storage) {
      expect(storage.getItem('anchor_care_api_key')).toBe('test-key');
    }

    service.setApiKey('');

    expect(service.apiKey()).toBe('');
    if (storage) {
      expect(storage.getItem('anchor_care_api_key')).toBeNull();
    }
  });

  it('should fall back to mock emergency synthesis when no api key is present', () => {
    let emittedHeadline = '';

    service.triggerEmergencySynthesis('unit test trigger').subscribe((result) => {
      emittedHeadline = result.headline;
    });

    expect(service.isLoading()).toBe(true);
    expect(emittedHeadline).toBe(MOCK_INDIVIDUAL_CRISIS_DATA.headline);

    vi.advanceTimersByTime(600);

    expect(service.isLoading()).toBe(false);
    expect(service.currentCrisisData().headline).toBe(MOCK_INDIVIDUAL_CRISIS_DATA.headline);
    expect(service.lastPromptInspectorData()).not.toBeNull();
    expect(service.lastPromptInspectorData()?.lastPromptSent).toContain('unit test trigger');
    expect(service.lastPromptInspectorData()?.rawResponse).toContain(MOCK_INDIVIDUAL_CRISIS_DATA.headline);
  });

  it('should return the caregiver chat no-key guidance', () => {
    let reply = '';

    service.sendCaregiverChat('help', []).subscribe((text) => {
      reply = text;
    });

    vi.runAllTimers();

    expect(reply).toContain('Gemini API key is missing');
  });
});