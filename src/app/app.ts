import { Component, signal, inject } from '@angular/core';
import { HeaderComponent } from './components/header.component';
import { IndividualHelpComponent } from './components/hero-emergency.component';
import { CaregiverHelpComponent } from './components/caregiver-help.component';
import { EmergencyBranchesComponent } from './components/emergency-branches.component';
import { RespirationSyncComponent } from './components/respiration-sync.component';
import { HarmReductionHubComponent } from './components/harm-reduction-hub.component';
import { PromptInspectorModalComponent } from './components/prompt-inspector-modal.component';
import { ApiKeyModalComponent } from './components/api-key-modal.component';
import { GeminiCrisisService } from './services/gemini-crisis.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    IndividualHelpComponent,
    CaregiverHelpComponent,
    EmergencyBranchesComponent,
    RespirationSyncComponent,
    HarmReductionHubComponent,
    PromptInspectorModalComponent,
    ApiKeyModalComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-rose-500 selection:text-white">
      
      <!-- Top Navigation & Header -->
      <app-header 
        (openInspectorModal)="showInspectorModal.set(true)"
        (openApiKeyModal)="showApiKeyModal.set(true)">
      </app-header>

      <!-- Main App Content -->
      <main class="flex-grow">
        
        @if (crisisService.activePersona() === 'individual') {
          <app-individual-help></app-individual-help>
        } @else {
          <app-caregiver-help></app-caregiver-help>
        }

        <!-- 2. BRANCHING EMERGENCY ACTIONS -->
        <app-emergency-branches></app-emergency-branches>

        <!-- 3. CONTEXTUAL SAFETY & GROUNDING TOOLS -->
        <section class="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <!-- Respiration Grounding Circle (Left 1 Col) -->
            <div class="lg:col-span-1">
              <app-respiration-sync></app-respiration-sync>
            </div>

            <!-- Harm Reduction Micro-Cards (Right 2 Cols) -->
            <div class="lg:col-span-2">
              <app-harm-reduction-hub></app-harm-reduction-hub>
            </div>

          </div>
        </section>

      </main>

      <!-- Footer -->
      <footer class="bg-slate-950 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-300">AnchorCare AI</span>
            <span>• Google Developers Prompt Wars 2026</span>
          </div>
          <span>Cognitive-Zero Recovery & Caregiver Emergency Companion</span>
          <span>Powered by Gemini API</span>
        </div>
      </footer>

      <!-- MODALS -->
      @if (showInspectorModal()) {
        <app-prompt-inspector-modal (close)="showInspectorModal.set(false)"></app-prompt-inspector-modal>
      }

      @if (showApiKeyModal()) {
        <app-api-key-modal (close)="showApiKeyModal.set(false)"></app-api-key-modal>
      }

    </div>
  `
})
export class App {
  crisisService = inject(GeminiCrisisService);
  showInspectorModal = signal<boolean>(false);
  showApiKeyModal = signal<boolean>(false);
}
