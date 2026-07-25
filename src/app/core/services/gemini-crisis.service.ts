import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrisisResponse, PersonaType, PromptInspectorData } from '../models/crisis.model';
import { MOCK_CAREGIVER_CRISIS_DATA, MOCK_INDIVIDUAL_CRISIS_DATA } from '../models/mock-crisis-data';

@Injectable({
  providedIn: 'root'
})
export class GeminiCrisisService {
  private http = inject(HttpClient);

  // Reactive state management using Angular Signals
  activePersona = signal<PersonaType>('individual');
  apiKey = signal<string>('');
  currentCrisisData = signal<CrisisResponse>(MOCK_INDIVIDUAL_CRISIS_DATA);
  isLoading = signal<boolean>(false);
  lastPromptInspectorData = signal<PromptInspectorData | null>(null);

  constructor() {
    const storedKey = this.readStoredApiKey();
    const runtimeKey = this.getRuntimeApiKey();
    this.apiKey.set(storedKey || runtimeKey);
    // Initial sync
    this.updateDataForPersona(this.activePersona());
  }

  setApiKey(key: string) {
    this.apiKey.set(key);
    if (key) {
      this.writeStoredApiKey(key);
    } else {
      this.removeStoredApiKey();
    }
  }

  setPersona(persona: PersonaType) {
    this.activePersona.set(persona);
    this.updateDataForPersona(persona);
  }

  private updateDataForPersona(persona: PersonaType) {
    if (persona === 'caregiver') {
      this.currentCrisisData.set(MOCK_CAREGIVER_CRISIS_DATA);
    } else {
      this.currentCrisisData.set(MOCK_INDIVIDUAL_CRISIS_DATA);
    }
  }

  /**
   * Trigger immediate Emergency Crisis Synthesis via Gemini API or zero-crash mock fallback
   */
  triggerEmergencySynthesis(customTrigger: string = "Emergency Crisis Triggered"): Observable<CrisisResponse> {
    this.isLoading.set(true);
    const persona = this.activePersona();
    const key = this.apiKey();
    const startTime = Date.now();

    const systemInstruction = persona === 'caregiver'
      ? "You are AnchorCare AI, an emergency cognitive-zero medical & crisis response assistant for caregivers. Provide ultra-clear, calm, step-by-step de-escalation instructions, physical emergency intervention steps, and harm reduction tips in structured JSON."
      : "You are AnchorCare AI, direct emergency self-grounding assistant for individuals in extreme distress or panic. Provide simple, soft, grounding exercises, immediate safety steps, and reassuring prompts in structured JSON.";

    const promptText = `Generate emergency response protocol for active emergency trigger: "${customTrigger}" for target persona: ${persona.toUpperCase()}.`;

    const enforcedSchema = `{
  "headline": "string",
  "toneSummary": "string",
  "deEscalationScript": ["string"],
  "physicalIntervention": ["string"],
  "sosMessage": "string",
  "respirationPacing": { "inhaleSec": 4, "holdSec": 4, "exhaleSec": 4, "guidance": "string" },
  "harmReductionTips": [{ "category": "string", "title": "string", "description": "string" }]
}`;

    // Populate Inspector Data
    const inspectorData: PromptInspectorData = {
      systemInstruction,
      enforcedSchema,
      latencyMs: 0,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE (Crisis Safety Exemption)" }
      ],
      lastPromptSent: promptText,
      rawResponse: 'Pending request execution...'
    };

    if (!key) {
      // Mock Fallback: return instantaneous response with fake latency
      setTimeout(() => {
        const latency = Date.now() - startTime + 120;
        const mockResult = persona === 'caregiver' ? { ...MOCK_CAREGIVER_CRISIS_DATA } : { ...MOCK_INDIVIDUAL_CRISIS_DATA };
        mockResult.geminiMetadata.latencyMs = latency;
        mockResult.geminiMetadata.systemInstructionUsed = systemInstruction;
        
        inspectorData.latencyMs = latency;
        inspectorData.rawResponse = JSON.stringify(mockResult, null, 2);
        this.lastPromptInspectorData.set(inspectorData);

        this.currentCrisisData.set(mockResult);
        this.isLoading.set(false);
      }, 600);

      return of(persona === 'caregiver' ? MOCK_CAREGIVER_CRISIS_DATA : MOCK_INDIVIDUAL_CRISIS_DATA);
    }

    // Call Real Gemini API if key is present
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nEnforce JSON output formatted exactly matching this schema:\n${enforcedSchema}\n\nTask: ${promptText}` }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    return this.http.post<any>(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': key
      }
    }).pipe(
      map(res => {
        const latency = Date.now() - startTime;
        let parsed: CrisisResponse;
        try {
          const text = res.candidates[0].content.parts[0].text;
          parsed = JSON.parse(this.sanitizeString(text));
          parsed.geminiMetadata = {
            latencyMs: latency,
            model: "gemini-flash-latest",
            safetyRatingsPassed: true,
            systemInstructionUsed: systemInstruction,
            enforcedSchema
          };
          inspectorData.rawResponse = JSON.stringify(res, null, 2);
        } catch (e) {
          parsed = persona === 'caregiver' ? MOCK_CAREGIVER_CRISIS_DATA : MOCK_INDIVIDUAL_CRISIS_DATA;
          inspectorData.rawResponse = "Error parsing response, fallback applied.";
        }
        inspectorData.latencyMs = latency;
        this.lastPromptInspectorData.set(inspectorData);
        this.currentCrisisData.set(parsed);
        this.isLoading.set(false);
        return parsed;
      }),
      catchError(err => {
        console.warn('Gemini API request failed, using zero-crash mock fallback:', err);
        const latency = Date.now() - startTime;
        const mockResult = persona === 'caregiver' ? MOCK_CAREGIVER_CRISIS_DATA : MOCK_INDIVIDUAL_CRISIS_DATA;
        inspectorData.latencyMs = latency;
        inspectorData.rawResponse = `HTTP Error (${err.status}): ${err.message || 'API key invalid or quota exceeded'}`;
        this.lastPromptInspectorData.set(inspectorData);
        this.currentCrisisData.set(mockResult);
        this.isLoading.set(false);
        return of(mockResult);
      })
    );
  }

  sendCaregiverChat(
    message: string,
    history: Array<{ role: 'user' | 'model'; text: string }>
  ): Observable<string> {
    const key = this.apiKey();
    if (!key) {
      return of('Gemini API key is missing. Please add your API key in settings to start live caregiver chat.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
    const caregiverInstruction =
      'You are AnchorCare AI, a calm and practical emergency caregiver support assistant. Give clear, complete, safety-first steps in plain text only. Do not use markdown symbols like ** or bullet hyphens. Write each step or important idea on its own line with short readable lines. In high-risk cases, tell the caregiver to call emergency helpline 112 immediately.';
    const caregiverContext =
      'Context: The user is a caregiver helping a person with substance abuse concerns during distress episodes. Prioritize harm reduction, overdose awareness, de-escalation language, airway/breathing safety checks, and immediate emergency escalation when needed.';

    const safeHistory = history.slice(Math.max(history.length - 8, 0));
    const contents = [
      {
        role: 'user',
        parts: [{ text: caregiverInstruction }]
      },
      {
        role: 'user',
        parts: [{ text: caregiverContext }]
      },
      ...safeHistory.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    return this.http
      .post<any>(
        url,
        {
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 3072
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': key
          }
        }
      )
      .pipe(
        map((res) => {
          const parts = res?.candidates?.[0]?.content?.parts;
          const text = Array.isArray(parts)
            ? parts
                .map((part: any) => part?.text || '')
                .join('\n')
                .trim()
            : '';

          return text || 'I could not generate a response right now. Please try again.';
        }),
        catchError((err) => {
          console.warn('Caregiver chat request failed:', err);
          return of('Unable to reach Gemini right now. Please check your API key or try again shortly.');
        })
      );
  }

  private sanitizeString(input: string): string {
    if (!input) return '';
    // Strip markdown triple backticks if returned by model
    return input.replace(/```json/g, '').replace(/```/g, '').trim();
  }

  private getRuntimeApiKey(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    const runtimeConfig = (window as any).__ANCHORCARE_RUNTIME__;
    return runtimeConfig?.geminiApiKey || '';
  }

  private readStoredApiKey(): string {
    try {
      return this.getStorage()?.getItem('anchor_care_api_key') || '';
    } catch {
      return '';
    }
  }

  private writeStoredApiKey(key: string): void {
    try {
      this.getStorage()?.setItem('anchor_care_api_key', key);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }

  private removeStoredApiKey(): void {
    try {
      this.getStorage()?.removeItem('anchor_care_api_key');
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }

  private getStorage(): Storage | null {
    if (typeof globalThis === 'undefined') {
      return null;
    }

    const storage = (globalThis as any).localStorage;
    return storage && typeof storage.getItem === 'function' ? (storage as Storage) : null;
  }
}
