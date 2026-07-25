import { Component, inject } from '@angular/core';
import { GeminiCrisisService } from '../services/gemini-crisis.service';

@Component({
  selector: 'app-hero-emergency',
  standalone: true,
  template: `
    <section class="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 text-center overflow-hidden">
      
      <!-- Background Ambient Glow -->
      <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div class="w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div class="w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-2xl"></div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10">
        
        <!-- Mode Announcement Banner -->
        <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-300 mb-6 backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Active Persona: <strong class="text-white capitalize">{{ crisisService.activePersona() }} Mode</strong></span>
          <span class="text-slate-500">•</span>
          <span class="text-slate-400">Zero-Typing Crisis Protocol</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Immediate Cognitive-Zero <span class="bg-gradient-to-r from-rose-500 via-red-400 to-amber-400 bg-clip-text text-transparent">Emergency Recovery</span>
        </h1>
        <p class="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10">
          Tap the emergency button below to synthesize instant, tailored de-escalation directives, physical intervention steps, and grounding assistance.
        </p>

        <!-- CENTER STAGE: GIANT PULSING HELP BUTTON -->
        <div class="flex flex-col items-center justify-center my-4">
          <button 
            (click)="onHelpTrigger()"
            [disabled]="crisisService.isLoading()"
            class="group relative inline-flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 text-white font-extrabold shadow-[0_0_60px_rgba(225,29,72,0.5)] hover:shadow-[0_0_90px_rgba(225,29,72,0.8)] transition-all duration-300 transform active:scale-95 disabled:opacity-75 cursor-pointer">
            
            <!-- Outer Pulsing Rings -->
            <span class="absolute inset-0 rounded-full bg-rose-500 opacity-40 animate-ping pointer-events-none"></span>
            <span class="absolute -inset-3 rounded-full border-2 border-rose-500/40 animate-pulse pointer-events-none"></span>
            
            <div class="flex flex-col items-center justify-center text-center space-y-2 z-10 px-4">
              @if (crisisService.isLoading()) {
                <svg class="animate-spin h-14 w-14 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm tracking-wider uppercase font-bold text-rose-100">Synthesizing...</span>
              } @else {
                <span class="text-4xl sm:text-5xl font-black tracking-widest drop-shadow-md">🚨 HELP</span>
                <span class="text-xs sm:text-sm font-semibold tracking-wide text-rose-100 bg-rose-950/50 px-3 py-1 rounded-full border border-rose-400/30">
                  Tap for Immediate AI Protocol
                </span>
              }
            </div>
          </button>
        </div>

        <!-- Headline Result Summary -->
        @if (crisisService.currentCrisisData()) {
          <div class="mt-8 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 max-w-2xl mx-auto shadow-lg backdrop-blur-sm">
            <p class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Active AI Synthesis Headline</p>
            <h3 class="text-lg font-bold text-rose-400">{{ crisisService.currentCrisisData().headline }}</h3>
            <p class="text-xs text-slate-400 mt-1 italic">{{ crisisService.currentCrisisData().toneSummary }}</p>
          </div>
        }

      </div>
    </section>
  `
})
export class HeroEmergencyComponent {
  crisisService = inject(GeminiCrisisService);

  onHelpTrigger() {
    this.crisisService.triggerEmergencySynthesis("Big Red Help Button Tapped").subscribe();
  }
}
