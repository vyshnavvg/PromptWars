import { CrisisResponse } from './crisis.model';

export const MOCK_CAREGIVER_CRISIS_DATA: CrisisResponse = {
  headline: "Caregiver Emergency De-escalation Protocol Activated",
  toneSummary: "Calm, authoritative, direct, and empathetic instructions optimized for a caregiver in crisis.",
  deEscalationScript: [
    "Speak slowly in a lowered pitch: 'You are safe with me right now. I am right here beside you.'",
    "Do not contradict or argue with their perception. Validate their emotions: 'I can see you feel overwhelmed, let's sit down.'",
    "Give simple one-step choices: 'Would you like to rest on the floor or the chair?'",
    "Maintain a clear path to the door and keep hands relaxed and visible at waist level."
  ],
  physicalIntervention: [
    "Step 1: Call 112 immediately if respiratory distress, unresponsiveness, or physical aggression occurs.",
    "Step 2: Administer Naloxone (Nasally 4mg) if opioid exposure or overdose is suspected.",
    "Step 3: Place individual in the Recovery Position (side-lying with top knee bent) to secure airways."
  ],
  sosMessage: "EMERGENCY ALERT: I need immediate assistance at my current location. Please call me or come quickly. (Sent via AnchorCare AI)",
  respirationPacing: {
    inhaleSec: 4,
    holdSec: 4,
    exhaleSec: 4,
    guidance: "Box Breathing Pacing: Guide the individual by breathing visibly along with the pulse."
  },
  harmReductionTips: [
    {
      category: "Naloxone Protocol",
      title: "Opioid Overdose Response",
      description: "Peel back package, insert tip into nostril, press plunger firmly. Repeat in second nostril if no response in 2-3 mins."
    },
    {
      category: "HALT Craving Framework",
      title: "De-escalate Physical Triggers",
      description: "Check if the individual is Hungry, Angry, Lonely, or Tired before addressing behavioral escalations."
    },
    {
      category: "Caregiver Burnout Shield",
      title: "Caregiver Micro-Grounding",
      description: "Take 3 deep abdominal breaths before entering the room. Your calm nervous system is the primary intervention tool."
    }
  ],
  geminiMetadata: {
    latencyMs: 142,
    model: "gemini-flash-latest",
    safetyRatingsPassed: true,
    systemInstructionUsed: "You are AnchorCare AI, an emergency cognitive-zero medical & crisis response assistant for caregivers.",
    enforcedSchema: "JSON Schema: { headline: string, deEscalationScript: string[], physicalIntervention: string[], sosMessage: string }"
  }
};

export const MOCK_INDIVIDUAL_CRISIS_DATA: CrisisResponse = {
  headline: "Self-Grounding & Emergency Calm Protocol Active",
  toneSummary: "Reassuring, simple, soft, and grounding language designed for direct cognitive relief.",
  deEscalationScript: [
    "Look around right now: Name 3 blue things you can see near you.",
    "Feel your feet flat on the floor. Push down through your heels gently.",
    "Say to yourself out loud: 'This feeling is temporary. I am safe in this room right now.'",
    "Unclench your jaw and drop your shoulders away from your ears."
  ],
  physicalIntervention: [
    "Step 1: Press the '1-Tap SOS' button to notify your trusted contact right away.",
    "Step 2: If experiencing severe physical pain or breathing difficulty, call 112 immediately.",
    "Step 3: Move away from bright lights or loud sounds into a quiet corner."
  ],
  sosMessage: "SOS: I am having a severe distress spike and need help grounding right now. Please reach out to me. (Sent via AnchorCare AI)",
  respirationPacing: {
    inhaleSec: 4,
    holdSec: 4,
    exhaleSec: 4,
    guidance: "Focus entirely on the pulsing circle below. Follow the rhythm."
  },
  harmReductionTips: [
    {
      category: "Sensory Grounding",
      title: "5-4-3-2-1 Technique",
      description: "Acknowledge 5 things around you, 4 you can touch, 3 you hear, 2 you smell, and 1 positive affirmation."
    },
    {
      category: "Safety Plan",
      title: "Remove Immediate Risk",
      description: "Move objects out of reach and sit in a comfortable, supported position on the floor."
    },
    {
      category: "Crisis Hotline",
      title: "Tele-Helpline Ready",
      description: "National Emergency & Mental Health Helplines are accessible with one tap."
    }
  ],
  geminiMetadata: {
    latencyMs: 128,
    model: "gemini-flash-latest",
    safetyRatingsPassed: true,
    systemInstructionUsed: "You are AnchorCare AI, direct emergency self-grounding assistant for individuals in panic/distress.",
    enforcedSchema: "JSON Schema: { headline: string, deEscalationScript: string[], physicalIntervention: string[], sosMessage: string }"
  }
};
