import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { GeminiCrisisService } from '../services/gemini-crisis.service';

@Component({
  selector: 'app-api-key-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            <h3 class="text-base font-bold text-white">Gemini API Key Settings</h3>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed">
          Provide your Google Gemini API Key for live AI synthesis. If left blank, AnchorCare AI will run using high-fidelity zero-crash mock crisis data.
        </p>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-300">API Key String</label>
          <input 
            type="password" 
            [value]="keyInput()"
            (input)="keyInput.set($any($event.target).value)"
            placeholder="AIzaSy..."
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono">
        </div>

        <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300">
          <strong>Security Note:</strong> Keys are stored only in your local browser storage. No server transmission outside official Gemini API calls.
        </div>

        <div class="flex items-center justify-end space-x-3 pt-2">
          <button 
            (click)="close.emit()"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            (click)="save()"
            class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-colors">
            Save Settings
          </button>
        </div>

      </div>

    </div>
  `
})
export class ApiKeyModalComponent {
  crisisService = inject(GeminiCrisisService);
  keyInput = signal<string>(this.crisisService.apiKey());

  @Output() close = new EventEmitter<void>();

  save() {
    this.crisisService.setApiKey(this.keyInput());
    this.close.emit();
  }
}
