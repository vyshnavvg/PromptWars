import { Component, inject, signal, OnDestroy } from '@angular/core';
import { GeminiCrisisService } from '../services/gemini-crisis.service';

@Component({
  selector: 'app-caregiver-help',
  standalone: true,
  template: `
    <section class="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 text-center overflow-hidden">
      <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div class="w-[520px] h-[520px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="w-[320px] h-[320px] bg-slate-800/50 rounded-full blur-2xl"></div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10">
        <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-300 mb-6 backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Active Persona: <strong class="text-white capitalize">{{ crisisService.activePersona() }} Mode</strong></span>
          <span class="text-slate-500">•</span>
          <span class="text-slate-400">Caregiver Emergency Support Flow</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Caregiver Crisis Response <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-slate-200 bg-clip-text text-transparent">Ready to Assist</span>
        </h1>
        <p class="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10">
          Tap the help button to notify your support network and receive immediate caregiver-focused emergency guidance.
        </p>

        <div class="flex flex-col items-center justify-center my-4">
          <button 
            (click)="onHelpTrigger()"
            [disabled]="callingState() !== 'idle' || crisisService.isLoading()"
            class="group relative inline-flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold shadow-[0_0_60px_rgba(34,197,94,0.45)] hover:shadow-[0_0_90px_rgba(34,197,94,0.65)] transition-all duration-300 transform active:scale-95 disabled:opacity-75 cursor-pointer">
            <span class="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-pulse pointer-events-none"></span>
            <div class="flex flex-col items-center justify-center text-center space-y-2 z-10 px-4">
              @if (callingState() === 'calling') {
                <svg class="animate-spin h-14 w-14 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm tracking-wider uppercase font-bold text-slate-950">Calling Emergency Support...</span>
              } @else if (callingState() === 'connected') {
                <span class="text-2xl sm:text-3xl font-black tracking-widest drop-shadow-md">Connected</span>
                <span class="text-xs sm:text-sm font-semibold tracking-wide text-slate-950 bg-white/80 px-3 py-1 rounded-full border border-slate-200/40">
                  Connected to Healthcare provider please share your problem.
                </span>
              } @else {
                <span class="text-4xl sm:text-5xl font-black tracking-widest drop-shadow-md">🛟 HELP</span>
                <span class="text-xs sm:text-sm font-semibold tracking-wide text-slate-950 bg-white/80 px-3 py-1 rounded-full border border-slate-200/40">
                  Tap for Caregiver Emergency Alert
                </span>
              }
            </div>
          </button>
        </div>

        @if (showSmsPopup()) {
          <div class="mt-4 max-w-xl mx-auto p-4 rounded-3xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 shadow-lg backdrop-blur-sm transition-opacity duration-300">
            <div class="flex items-start gap-3">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-200">📨</span>
              <div>
                <p class="text-sm uppercase tracking-[0.32em] text-emerald-300 font-bold mb-1">SOS SMS Sent</p>
                <p class="text-sm leading-6 text-slate-100">Emergency message has been sent to your caregiver contact.</p>
              </div>
            </div>
          </div>
        }

        @if (callingState() === 'calling') {
          <div class="mt-6 max-w-2xl mx-auto p-5 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-xl text-left backdrop-blur-sm">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="text-sm uppercase tracking-[0.3em] text-emerald-300 font-bold mb-2">Breathing</p>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Respiration Grounding Sync Module</h2>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400 uppercase tracking-[0.24em]">Call will connect in</p>
                <p class="text-3xl font-black text-emerald-300">{{ callCountdown() }}s</p>
              </div>
            </div>
            <div class="mt-5 grid grid-cols-3 gap-3 text-xs text-slate-300">
              <div class="rounded-2xl bg-slate-950/80 p-3 border border-slate-800">
                <p class="font-semibold text-slate-100">Inhale</p>
                <p class="text-slate-400">4 sec</p>
              </div>
              <div class="rounded-2xl bg-slate-950/80 p-3 border border-slate-800">
                <p class="font-semibold text-slate-100">Hold</p>
                <p class="text-slate-400">4 sec</p>
              </div>
              <div class="rounded-2xl bg-slate-950/80 p-3 border border-slate-800">
                <p class="font-semibold text-slate-100">Exhale</p>
                <p class="text-slate-400">4 sec</p>
              </div>
            </div>
          </div>
        }

        @if (crisisService.currentCrisisData()) {
          <div class="mt-8 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 max-w-2xl mx-auto shadow-lg backdrop-blur-sm">
            <p class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Active AI Synthesis Headline</p>
            <h3 class="text-lg font-bold text-emerald-300">{{ crisisService.currentCrisisData().headline }}</h3>
            <p class="text-xs text-slate-400 mt-1 italic">{{ crisisService.currentCrisisData().toneSummary }}</p>
          </div>
        }

      </div>
    </section>
  `
})
export class CaregiverHelpComponent implements OnDestroy {
  crisisService = inject(GeminiCrisisService);
  callingState = signal<'idle' | 'calling' | 'connected'>('idle');
  callCountdown = signal<number>(5);
  showSmsPopup = signal<boolean>(false);
  callInterval: any;
  smsPopupTimer: any;

  onHelpTrigger() {
    if (this.callingState() !== 'idle') {
      return;
    }

    this.callingState.set('calling');
    this.callCountdown.set(10);
    this.showSmsPopup.set(true);

    if (this.smsPopupTimer) {
      clearTimeout(this.smsPopupTimer);
    }
    this.smsPopupTimer = setTimeout(() => this.showSmsPopup.set(false), 3000);

    this.callInterval = setInterval(() => {
      const next = this.callCountdown() - 1;
      if (next <= 0) {
        clearInterval(this.callInterval);
        this.callInterval = null;
        this.callCountdown.set(0);
        this.callingState.set('connected');
        this.crisisService.triggerEmergencySynthesis('Big Red Help Button Tapped').subscribe();
      } else {
        this.callCountdown.set(next);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.callInterval) {
      clearInterval(this.callInterval);
    }
    if (this.smsPopupTimer) {
      clearTimeout(this.smsPopupTimer);
    }
  }
}
