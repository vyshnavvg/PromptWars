import { Component, inject } from '@angular/core';
import { GeminiCrisisService } from '../services/gemini-crisis.service';

@Component({
  selector: 'app-harm-reduction-hub',
  standalone: true,
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Harm Reduction Micro-Cards</span>
        </h3>
        <span class="text-xs text-slate-400">Evidence-based safety protocols</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (card of tips(); track card.title) {
          <div class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-md hover:shadow-lg flex flex-col justify-between">
            <div>
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
                {{ card.category }}
              </span>
              <h4 class="text-sm font-bold text-white mb-1.5">{{ card.title }}</h4>
              <p class="text-xs text-slate-400 leading-relaxed">{{ card.description }}</p>
            </div>
            
            <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Safety Standard</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class HarmReductionHubComponent {
  crisisService = inject(GeminiCrisisService);
  tips = () => this.crisisService.currentCrisisData().harmReductionTips;
}
