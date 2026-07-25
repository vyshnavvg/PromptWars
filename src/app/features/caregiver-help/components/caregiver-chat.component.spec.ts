import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CaregiverChatComponent } from './caregiver-chat.component';
import { GeminiCrisisService } from '../../../core/services/gemini-crisis.service';

describe('CaregiverChatComponent', () => {
  let fixture: ComponentFixture<CaregiverChatComponent>;
  let sendCaregiverChatSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    sendCaregiverChatSpy = vi.fn().mockReturnValue(of('First line\nSecond line'));

    await TestBed.configureTestingModule({
      imports: [CaregiverChatComponent],
      providers: [
        {
          provide: GeminiCrisisService,
          useValue: {
            apiKey: signal('test-key'),
            sendCaregiverChat: sendCaregiverChatSpy
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CaregiverChatComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should send chat messages and stream the assistant reply line by line', () => {
    const component = fixture.componentInstance;
    component.draft.set('What should I do first?');

    component.sendMessage();

    expect(sendCaregiverChatSpy).toHaveBeenCalled();
    expect(component.draft()).toBe('');
    expect(component.isSending()).toBe(false);
    expect(component.isStreaming()).toBe(true);
    expect(component.messages().at(-1)?.text).toBe('');

    vi.advanceTimersByTime(180);
    expect(component.messages().at(-1)?.text).toBe('First line');

    vi.advanceTimersByTime(180);
    expect(component.messages().at(-1)?.text).toBe('First line\nSecond line');
    expect(component.isStreaming()).toBe(false);
  });

  it('should prefill a quick prompt and send it immediately', () => {
    const component = fixture.componentInstance;

    component.useQuickPrompt('Give me a short breathing script.');

    expect(sendCaregiverChatSpy).toHaveBeenCalled();
    expect(sendCaregiverChatSpy.mock.calls.at(-1)?.[0]).toBe('Give me a short breathing script.');
  });
});