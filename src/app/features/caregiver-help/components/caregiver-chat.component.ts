import { Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { GeminiCrisisService } from '../../../core/services/gemini-crisis.service';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  text: string;
}

interface QuickPrompt {
  label: string;
  prompt: string;
}

@Component({
  selector: 'app-caregiver-chat',
  standalone: true,
  styles: [`
    @keyframes lineFadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
        filter: blur(2px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    }

    .line-fade-in {
      animation: lineFadeIn 220ms ease-out both;
    }
  `],
  template: `
    <section class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-[28px] shadow-[0_30px_90px_rgba(0,0,0,0.35)] overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-sm flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/20 flex items-center justify-center">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Caregiver Support Chat</h3>
              <p class="text-xs text-slate-300">Ask Gemini for step-by-step caregiver guidance during active distress situations.</p>
            </div>
          </div>
          <span class="text-[11px] px-2.5 py-1 rounded-full border"
            [class]="crisisService.apiKey() ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : 'border-amber-500/30 text-amber-300 bg-amber-500/10'">
            {{ crisisService.apiKey() ? 'Gemini Live' : 'Add API Key' }}
          </span>
        </div>

        <div #chatScroll class="h-[400px] sm:h-[460px] overflow-y-auto p-4 sm:p-5 space-y-4 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%),linear-gradient(to_bottom,rgba(2,6,23,0.12),rgba(2,6,23,0.26))]">
          @for (message of messages(); track $index) {
            <div class="flex items-end gap-2" [class.flex-row-reverse]="message.role === 'user'">
              <div class="w-8 h-8 shrink-0 rounded-2xl flex items-center justify-center text-[11px] font-bold uppercase"
                [class]="message.role === 'user'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-200 border border-slate-700'">
                {{ message.role === 'user' ? 'You' : 'AI' }}
              </div>

              <div class="max-w-[92%] sm:max-w-[78%] rounded-[22px] px-4 py-3 shadow-sm"
                [class]="message.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-md'
                  : 'bg-slate-900/95 text-slate-50 rounded-bl-md border border-slate-700/90'">
                @if (message.role === 'assistant') {
                  <div class="space-y-2 leading-6 text-sm whitespace-pre-wrap break-words">
                    @for (line of assistantLines(message); track $index) {
                      <div class="line-fade-in">{{ line }}</div>
                    }
                  </div>
                } @else {
                  <div class="text-sm leading-6 whitespace-pre-wrap break-words">{{ message.text }}</div>
                }
              </div>
            </div>
          }

          @if (showQuickPrompts()) {
            <div class="pt-1">
              <p class="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-2">Quick prompts</p>
              <div class="flex flex-wrap gap-2">
                @for (item of quickPrompts(); track item.label) {
                  <button
                    (click)="useQuickPrompt(item.prompt)"
                    [disabled]="isSending()"
                    class="px-3 py-1.5 text-xs rounded-full border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:border-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ item.label }}
                  </button>
                }
              </div>
            </div>
          }

          @if (isSending()) {
            <div class="flex items-end gap-2">
              <div class="w-8 h-8 shrink-0 rounded-2xl flex items-center justify-center text-[11px] font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
                AI
              </div>
              <div class="bg-slate-900/95 text-slate-100 border border-slate-700 max-w-[78%] px-4 py-3 rounded-[22px] rounded-bl-md text-sm">
                Gemini is thinking...
              </div>
            </div>
          }

          @if (isStreaming()) {
            <div class="flex items-end gap-2">
              <div class="w-8 h-8 shrink-0 rounded-2xl flex items-center justify-center text-[11px] font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
                AI
              </div>
              <div class="bg-slate-900/95 text-slate-100 border border-slate-700 max-w-[78%] px-4 py-3 rounded-[22px] rounded-bl-md text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini is replying...
              </div>
            </div>
          }
        </div>

        <div class="p-4 border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm">
          @if (!crisisService.apiKey()) {
            <p class="text-xs text-amber-300 mb-3">Add your Gemini API key from the top-right settings to enable live chat.</p>
          }
          <div class="flex items-end gap-2">
            <textarea
              [value]="draft()"
              (input)="draft.set($any($event.target).value)"
              (keydown.enter)="onEnter($event)"
              rows="2"
              placeholder="Example: What should I do in the next 2 minutes to calm the person safely?"
              class="w-full resize-none rounded-2xl bg-slate-950 border border-slate-700 px-3 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-inner"></textarea>
            <button
              (click)="sendMessage()"
              [disabled]="isSending() || !draft().trim()"
              class="shrink-0 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-emerald-500/20">
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CaregiverChatComponent {
  crisisService = inject(GeminiCrisisService);
  @ViewChild('chatScroll') chatScroll?: ElementRef<HTMLDivElement>;

  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'I am here to help you as a caregiver. Share what is happening and I will provide calm, practical next steps.'
    }
  ]);

  draft = signal<string>('');
  isSending = signal<boolean>(false);
  isStreaming = signal<boolean>(false);
  quickPrompts = signal<QuickPrompt[]>([
    {
      label: '2-minute calming plan',
      prompt: 'Give me a 2-minute caregiver calming plan for a person having a panic spike right now.'
    },
    {
      label: 'Aggression de-escalation',
      prompt: 'What are the safest de-escalation steps if the person is verbally aggressive and pacing?'
    },
    {
      label: 'Overdose warning signs',
      prompt: 'List immediate warning signs of overdose and what I should do in order, including when to call 112.'
    },
    {
      label: 'Breathing guidance script',
      prompt: 'Give me a short script I can read out loud to guide slow breathing and reduce panic.'
    }
  ]);

  showQuickPrompts = () => this.messages().length <= 1;

  onEnter(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage() {
    const input = this.draft().trim();
    if (!input || this.isSending()) {
      return;
    }

    this.messages.update((prev) => [...prev, { role: 'user', text: input }]);
    this.draft.set('');
    this.isSending.set(true);
    this.isStreaming.set(false);
    this.scrollToBottom();

    this.crisisService.sendCaregiverChat(input, this.toChatHistory()).subscribe({
      next: (reply) => {
        this.isSending.set(false);
        this.startStreamingReply(reply);
      },
      error: () => {
        this.messages.update((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Unable to reach Gemini right now. Please try again in a moment.'
          }
        ]);
        this.isSending.set(false);
        this.isStreaming.set(false);
        this.scrollToBottom();
      }
    });
  }

  useQuickPrompt(prompt: string) {
    this.draft.set(prompt);
    this.sendMessage();
  }

  displayText(message: ChatMessage): string {
    if (message.role === 'user') {
      return message.text;
    }

    return message.text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/^\s*[-*]\s+/gm, '* ')
      .trim();
  }

  assistantLines(message: ChatMessage): string[] {
    const cleaned = this.displayText(message)
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleaned) {
      return [];
    }

    const lines = cleaned
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.length > 1 ? lines : [cleaned];
  }

  private startStreamingReply(reply: string) {
    const cleanedReply = this.displayText({ role: 'assistant', text: reply });
    const lines = this.splitIntoStreamLines(cleanedReply);

    if (!lines.length) {
      this.messages.update((prev) => [...prev, { role: 'assistant', text: 'I could not generate a response right now. Please try again.' }]);
      this.isStreaming.set(false);
      this.scrollToBottom();
      return;
    }

    this.isStreaming.set(true);
    this.messages.update((prev) => [...prev, { role: 'assistant', text: '' }]);

    let index = 0;
    const tickMs = 180;

    if (this.streamTimer !== null) {
      clearInterval(this.streamTimer);
    }

    this.streamTimer = setInterval(() => {
      const chunk = lines[index];
      index += 1;

      this.messages.update((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        if (lastIndex >= 0 && next[lastIndex].role === 'assistant') {
          const currentText = next[lastIndex].text;
          next[lastIndex] = {
            ...next[lastIndex],
            text: currentText ? `${currentText}\n${chunk}` : chunk
          };
        }
        return next;
      });

      this.scrollToBottom();

      if (index >= lines.length) {
        if (this.streamTimer !== null) {
          clearInterval(this.streamTimer);
        }
        this.streamTimer = null;
        this.isStreaming.set(false);
      }
    }, tickMs);
  }

  private splitIntoStreamLines(text: string): string[] {
    const normalized = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const newlineLines = normalized
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (newlineLines.length > 1) {
      return newlineLines;
    }

    const sentenceLines = normalized
      .split(/(?<=[.?!])\s+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (sentenceLines.length > 1) {
      return sentenceLines;
    }

    return normalized ? [normalized] : [];
  }

  private toChatHistory(): Array<{ role: 'user' | 'model'; text: string }> {
    return this.messages()
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text
      }));
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.chatScroll?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }

  private streamTimer: ReturnType<typeof setInterval> | null = null;

  ngOnDestroy() {
    if (this.streamTimer !== null) {
      clearInterval(this.streamTimer);
      this.streamTimer = null;
    }
  }
}
