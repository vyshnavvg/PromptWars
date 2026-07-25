import { Component, inject, signal } from '@angular/core';
import { GeminiCrisisService } from '../services/gemini-crisis.service';

@Component({
  selector: 'app-emergency-branches',
  standalone: true,
  template: `
    <section class="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Emergency Action Branches</span>
          </h2>
          <p class="text-sm text-slate-400 mt-1">Structured 4-Branch intervention triage for immediate response.</p>
        </div>
        <span class="hidden sm:inline-block text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
          Cognitive-Zero Protocol
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- BRANCH 1: CALL 112 -->
        <div class="bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all duration-200 group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-black border border-red-500/20 text-lg">
                1
              </span>
              <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-red-500/10 text-red-400">Emergency Call</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Call 112 National Helpline</h3>
            <p class="text-xs text-slate-400 mb-6 leading-relaxed">
              Direct connection to India National Emergency Response System (112) for medical, police, or ambulance rescue.
            </p>
          </div>
          <a 
            href="tel:112" 
            class="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-center shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2 transition-all active:scale-98">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Dial 112 Now</span>
          </a>
        </div>

        <!-- BRANCH 2: SPOKEN DE-ESCALATION SCRIPT BOX -->
        <div class="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all duration-200 group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black border border-amber-500/20 text-lg">
                2
              </span>
              <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Verbal Script</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Spoken De-escalation Script</h3>
            <p class="text-xs text-slate-400 mb-4 leading-relaxed">
              Read out loud word-for-word in a low, soothing tone to defuse psychological panic:
            </p>
            
            <!-- Script Container -->
            <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-amber-200/90 font-mono space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              @for (line of data().deEscalationScript; track $index) {
                <div class="flex items-start space-x-2">
                  <span class="text-amber-500 font-bold select-none">•</span>
                  <span>{{ line }}</span>
                </div>
              }
            </div>
          </div>
          <button 
            (click)="copyScript()"
            class="w-full mt-4 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-center border border-slate-700 flex items-center justify-center space-x-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>{{ copiedScript() ? 'Copied to Clipboard!' : 'Copy Script Text' }}</span>
          </button>
        </div>

        <!-- BRANCH 3: PHYSICAL INTERVENTION CHECKLIST -->
        <div class="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all duration-200 group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black border border-emerald-500/20 text-lg">
                3
              </span>
              <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Step Checklist</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Physical Intervention Checklist</h3>
            <p class="text-xs text-slate-400 mb-4 leading-relaxed">
              Sequential high-priority safety procedures to follow:
            </p>

            <div class="space-y-2">
              @for (step of data().physicalIntervention; track $index) {
                <label class="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-emerald-500/30 transition-colors">
                  <input type="checkbox" class="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950">
                  <span class="text-xs text-slate-300 font-medium leading-tight">{{ step }}</span>
                </label>
              }
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400/80 flex items-center space-x-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Recovery position prevents airway blockage.</span>
          </div>
        </div>

        <!-- BRANCH 4: 1-TAP SOS CONTACT BROADCAST -->
        <div class="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all duration-200 group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black border border-blue-500/20 text-lg">
                4
              </span>
              <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">SOS Broadcast</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">1-Tap SOS Contact Broadcast</h3>
            <p class="text-xs text-slate-400 mb-3 leading-relaxed">
              Pre-formatted distress message ready to send to trusted family/contacts:
            </p>

            <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans italic relative">
              "{{ data().sosMessage }}"
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <button 
              (click)="sendSosSms()"
              class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              <span>Broadcast SOS via SMS</span>
            </button>

            <button 
              (click)="copySos()"
              class="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl text-center transition-colors">
              {{ copiedSos() ? 'Message Copied!' : 'Copy SOS Text' }}
            </button>
          </div>
        </div>

      </div>
    </section>
  `
})
export class EmergencyBranchesComponent {
  crisisService = inject(GeminiCrisisService);
  data = this.crisisService.currentCrisisData;

  copiedScript = signal<boolean>(false);
  copiedSos = signal<boolean>(false);

  copyScript() {
    const text = this.data().deEscalationScript.join('\n');
    navigator.clipboard.writeText(text);
    this.copiedScript.set(true);
    setTimeout(() => this.copiedScript.set(false), 2000);
  }

  copySos() {
    navigator.clipboard.writeText(this.data().sosMessage);
    this.copiedSos.set(true);
    setTimeout(() => this.copiedSos.set(false), 2000);
  }

  sendSosSms() {
    const encoded = encodeURIComponent(this.data().sosMessage);
    window.open(`sms:?body=${encoded}`, '_self');
  }
}
