import { Component, EventEmitter, Output, inject } from '@angular/core';
import { GeminiCrisisService } from '../../core/services/gemini-crisis.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-slate-900 border-b border-slate-800 text-white px-4 lg:px-8 py-3.5 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        <!-- Left: Logo & Badge -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AnchorCare<span class="text-rose-500">.AI</span>
              </span>
              <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                Built with AI 2026
              </span>
            </div>
            <p class="text-xs text-slate-400 font-medium hidden sm:block">Cognitive-Zero Recovery & Caregiver Emergency Companion</p>
          </div>
        </div>

        <!-- Center: Persona Toggle Switcher -->
        <div class="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          <button 
            (click)="setPersona('caregiver')"
            [class]="crisisService.activePersona() === 'caregiver' 
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold shadow-md shadow-rose-900/40 ring-1 ring-rose-400/30' 
              : 'text-slate-400 hover:text-slate-200'"
            class="px-3.5 py-1.5 rounded-lg text-xs md:text-sm transition-all duration-200 flex items-center space-x-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Caregiver Help</span>
          </button>

          <button 
            (click)="setPersona('individual')"
            [class]="crisisService.activePersona() === 'individual' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30' 
              : 'text-slate-400 hover:text-slate-200'"
            class="px-3.5 py-1.5 rounded-lg text-xs md:text-sm transition-all duration-200 flex items-center space-x-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>Individual Help</span>
          </button>
        </div>

        <!-- Right: Actions (Prompt Inspector + API Settings) -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <button 
            (click)="openInspectorModal.emit()"
            class="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center space-x-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            <span class="hidden md:inline">Inspect AI Engine</span>
            <span class="md:hidden">Inspect</span>
          </button>

          <button 
            (click)="openApiKeyModal.emit()"
            class="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors relative"
            title="API Key Configuration">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            @if (crisisService.apiKey()) {
              <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
            }
          </button>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {
  crisisService = inject(GeminiCrisisService);

  @Output() openInspectorModal = new EventEmitter<void>();
  @Output() openApiKeyModal = new EventEmitter<void>();

  setPersona(persona: 'caregiver' | 'individual') {
    this.crisisService.setPersona(persona);
  }
}
