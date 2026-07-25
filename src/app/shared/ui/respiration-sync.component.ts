import { Component, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-respiration-sync',
  standalone: true,
  template: `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
      
      <div class="flex items-center space-x-2 mb-4">
        <span class="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></span>
        <h3 class="text-lg font-bold text-white tracking-tight">Respiration Grounding Sync</h3>
      </div>
      <p class="text-xs text-slate-400 max-w-sm mb-6">
        4-Second Inhale / 4-Second Exhale Box Breathing Pacer. Synchronize your breathing with the circle below to lower heart rate and reduce panic response.
      </p>

      <!-- Respiration Pulsing Circle Visualizer -->
      <div class="relative w-44 h-44 flex items-center justify-center my-2">
        
        <!-- Outer Glowing Aura -->
        <div 
          class="absolute rounded-full transition-all duration-1000 ease-in-out"
          [class.w-44]="phase() === 'Inhale' || phase() === 'Hold'"
          [class.h-44]="phase() === 'Inhale' || phase() === 'Hold'"
          [class.w-24]="phase() === 'Exhale'"
          [class.h-24]="phase() === 'Exhale'"
          [class.bg-teal-500/20]="phase() === 'Inhale'"
          [class.bg-emerald-500/30]="phase() === 'Hold'"
          [class.bg-blue-500/20]="phase() === 'Exhale'"
          [class.blur-xl]="true">
        </div>

        <!-- Animated Breathing Ring -->
        <div 
          class="rounded-full border-4 flex items-center justify-center transition-all duration-1000 ease-in-out shadow-2xl"
          [class.w-40]="phase() === 'Inhale' || phase() === 'Hold'"
          [class.h-40]="phase() === 'Inhale' || phase() === 'Hold'"
          [class.w-20]="phase() === 'Exhale'"
          [class.h-20]="phase() === 'Exhale'"
          [class.border-teal-400]="phase() === 'Inhale'"
          [class.bg-teal-950/60]="phase() === 'Inhale'"
          [class.border-emerald-400]="phase() === 'Hold'"
          [class.bg-emerald-950/60]="phase() === 'Hold'"
          [class.border-blue-400]="phase() === 'Exhale'"
          [class.bg-blue-950/60]="phase() === 'Exhale'">
          
          <div class="text-center z-10">
            <span class="block text-xl font-black tracking-wider text-white uppercase">{{ phase() }}</span>
            <span class="text-2xl font-bold text-teal-300">{{ countdown() }}s</span>
          </div>
        </div>

      </div>

      <div class="mt-6 flex items-center space-x-6 text-xs text-slate-400 font-medium">
        <div class="flex items-center space-x-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          <span>Inhale (4s)</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Hold (4s)</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <span>Exhale (4s)</span>
        </div>
      </div>

    </div>
  `
})
export class RespirationSyncComponent implements OnInit, OnDestroy {
  phase = signal<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  countdown = signal<number>(4);
  private timer: any;

  ngOnInit() {
    this.startBreathingLoop();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private startBreathingLoop() {
    this.timer = setInterval(() => {
      let current = this.countdown();
      if (current > 1) {
        this.countdown.set(current - 1);
      } else {
        // Transition phases
        const currentPhase = this.phase();
        if (currentPhase === 'Inhale') {
          this.phase.set('Hold');
        } else if (currentPhase === 'Hold') {
          this.phase.set('Exhale');
        } else {
          this.phase.set('Inhale');
        }
        this.countdown.set(4);
      }
    }, 1000);
  }
}
