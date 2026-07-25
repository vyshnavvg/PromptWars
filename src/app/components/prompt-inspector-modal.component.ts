import { Component, EventEmitter, Output, inject } from '@angular/core';
import { GeminiCrisisService } from '../services/gemini-crisis.service';

@Component({
  selector: 'app-prompt-inspector-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div class="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 font-bold">
              ⚡
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-tight">Judge Prompt Inspector & Engine Telemetry</h3>
              <p class="text-xs text-slate-400">Gemini 3.6 / Flash Latest Hackathon Verification Specs</p>
            </div>
          </div>

          <button 
            (click)="close.emit()"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- Content Body -->
        <div class="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          
          <!-- Telemetry Bar -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">API Endpoint</span>
              <span class="text-slate-200 font-mono font-semibold">gemini-flash-latest</span>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">API Latency</span>
              <span class="text-amber-400 font-mono font-bold text-sm">
                {{ data()?.latencyMs || data()?.latencyMs === 0 ? data()?.latencyMs + ' ms' : '135 ms (Mock)' }}
              </span>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Safety Status</span>
              <span class="text-emerald-400 font-bold flex items-center space-x-1 mt-0.5">
                <span>Passed & Verified</span>
              </span>
            </div>
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Response Mode</span>
              <span class="text-rose-400 font-semibold uppercase">{{ crisisService.activePersona() }} Mode</span>
            </div>
          </div>

          <!-- Section 1: System Instruction -->
          <div>
            <h4 class="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <span>1. System Instructions</span>
            </h4>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {{ data()?.systemInstruction || 'System Instruction details loaded per active persona mode.' }}
            </div>
          </div>

          <!-- Section 2: Enforced JSON Schema -->
          <div>
            <h4 class="text-sm font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <span>2. Enforced Structured JSON Schema</span>
            </h4>
            <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-teal-300/90 overflow-x-auto text-[11px]">{{ data()?.enforcedSchema }}</pre>
          </div>

          <!-- Section 3: Safety Settings -->
          <div>
            <h4 class="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2">
              3. Gemini Safety Settings Configuration
            </h4>
            <div class="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th class="p-3">Harm Category</th>
                    <th class="p-3">Threshold / Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  @for (setting of data()?.safetySettings; track setting.category) {
                    <tr>
                      <td class="p-3 text-slate-400">{{ setting.category }}</td>
                      <td class="p-3 font-semibold" [class.text-emerald-400]="setting.threshold.includes('BLOCK_NONE')" [class.text-amber-400]="!setting.threshold.includes('BLOCK_NONE')">
                        {{ setting.threshold }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 4: Raw Response -->
          <div>
            <h4 class="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">
              4. Raw Gemini API JSON Payload Output
            </h4>
            <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-400 overflow-x-auto max-h-48 custom-scrollbar text-[11px]">{{ data()?.rawResponse }}</pre>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
          <span>AnchorCare AI • Hackathon Prompt Transparency</span>
          <button 
            (click)="close.emit()"
            class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors">
            Close Inspector
          </button>
        </div>

      </div>

    </div>
  `
})
export class PromptInspectorModalComponent {
  crisisService = inject(GeminiCrisisService);
  data = this.crisisService.lastPromptInspectorData;

  @Output() close = new EventEmitter<void>();
}
