import { ScoreBreakdown, SimulationPersona } from "./types";

const questionBank = {
  "job-interview": [
    "Walk me through a recent high-impact decision and the measurable outcome.",
    "Tell us about a conflict with a stakeholder and how you resolved it.",
    "What makes you uniquely effective in this role under pressure?",
  ],
  "technical-interview": [
    "Design a low-latency system for bursty traffic. What tradeoffs matter most?",
    "Explain a production incident you owned and how you prevented recurrence.",
    "How would you debug a 3x latency spike during peak traffic?",
  ],
  "case-interview": [
    "Revenue is down 18%. How do you structure your analysis in the first 3 minutes?",
    "What data would you request first and why?",
    "Give a recommendation and defend the main risk.",
  ],
  "startup-pitch": [
    "Why now, and why is this market big enough to matter?",
    "What is your moat if incumbents copy your product?",
    "Your growth stalls next quarter. What is your immediate plan?",
  ],
  "panel-presentation": [
    "Summarize your proposal in 30 seconds for mixed technical and business stakeholders.",
    "What is the highest-risk assumption in your plan?",
    "If we approve this today, what happens in the next 14 days?",
  ],
  "press-interview": [
    "What went wrong, and what accountability are you taking publicly?",
    "Why should customers trust your timeline now?",
    "What are you not saying yet and why?",
  ],
  "high-stakes-qa": [
    "Defend your core decision under maximum downside risk.",
    "What is the strongest criticism of your plan, and how do you answer it?",
    "If this fails, what should your team have seen earlier?",
  ],
} as const;

const janeStreetPrompts = {
  recruiter: [
    "Hi, nice to meet you. What attracts you to Jane Street, and what kind of impact are you aiming for here?",
    "Walk me through your background and why this role is the right next step.",
  ],
  phone: [
    "Technical screen: solve this in a collaborative way. Given 12 coins with probabilities (1/2, 1/3, 1/5, 1/9, ...), how would you reason about the probability of an odd number of heads?",
    "You have a game with asymmetric outcomes. How would you model expected value and decide when to stop?",
    "Estimate quickly: what assumptions would you use to bound an unknown market or system quantity in under 2 minutes?",
  ],
  onsiteCodingSystem: [
    "Onsite coding/system design: design a Tetris-like engine from scratch. Ask clarifying questions first, define API boundaries, then propose implementation strategy.",
    "Design a video player API from scratch. What abstractions, state transitions, and failure modes matter most?",
    "You are given an underspecified practical problem. What questions do you ask before coding, and how do you sequence your implementation?",
  ],
  onsiteReasoning: [
    "Reasoning round: you pick two random points in a square. How would you approach the geometric probability that a derived circle extends outside the square?",
    "Under time pressure, compare two solution strategies with different runtime and implementation risk. Which do you pick and why?",
  ],
  projectDeepDive: [
    "Technical project deep dive: present a technically complex project you owned. Focus on architecture, tradeoffs, and measurable impact.",
    "In that project, what decision would you change today and why?",
  ],
};

export function generatePersonaReactions(params: {
  personas: SimulationPersona[];
  score: ScoreBreakdown;
  difficulty: number;
  transcript: string;
}) {
  const lower = params.transcript.toLowerCase();
  const explicitMiss =
    /i don't know|i do not know|not sure|no idea|i can't answer|cannot answer|i have no technical background|i don't have technical background|i dont have technical background/.test(
      lower,
    );

  return params.personas.map((persona, index) => {
    const interrupt = persona.interruptionTendency > 0.45 && params.difficulty >= 4 && index === 0;
    const expression =
      explicitMiss || params.score.overall < 40
        ? ("confused" as const)
        : params.score.overall < 55
          ? ("critical" as const)
          : params.score.overall < 72
            ? ("skeptical" as const)
            : params.score.overall >= 86
              ? ("approving" as const)
              : ("neutral" as const);
    const emotionalImpact =
      expression === "approving"
        ? ("calming" as const)
        : expression === "neutral"
          ? ("neutral" as const)
          : ("pressuring" as const);
    const prefix =
      expression === "confused"
        ? "Interviewer expression: confused, furrowed brow. "
        : expression === "critical"
          ? "Interviewer expression: stern, visibly concerned. "
          : expression === "skeptical"
            ? "Interviewer expression: skeptical, analytical stare. "
            : expression === "approving"
            ? "Interviewer expression: subtle nod, engaged. "
            : "";
    const alignedReaction =
      expression === "approving"
        ? "Strong answer. Clear structure and confidence."
        : expression === "neutral"
          ? "Solid baseline. Keep precision high."
          : expression === "skeptical"
            ? "I need tighter logic and one concrete metric."
            : expression === "critical"
              ? "This response is below expected bar. Be direct, structured, and specific."
              : "This answer signals lack of readiness. Reset and give your best structured attempt.";

    return {
      personaId: persona.id,
      text:
        prefix +
        (explicitMiss
          ? "This answer suggests you are underprepared. Give your best structured attempt instead of stopping."
          : alignedReaction),
      interrupt,
      expression,
      emotionalImpact,
    };
  });
}

export function chooseNextPrompt(params: {
  interviewType: keyof typeof questionBank;
  turnNumber: number;
  difficulty: number;
  priorScore: ScoreBreakdown;
  roleContext?: string;
  industry?: string;
}) {
  const roleContext = (params.roleContext ?? "").toLowerCase();
  const industry = (params.industry ?? "").toLowerCase();
  const isJaneStreet = /jane\s*street/.test(roleContext) || roleContext.includes("janestreet");
  const isQuantContext = isJaneStreet || roleContext.includes("quant") || industry.includes("finance");

  if (isQuantContext && params.interviewType === "technical-interview") {
    const phasePrompt = (() => {
      if (params.turnNumber <= 1) {
        return janeStreetPrompts.recruiter[params.turnNumber % janeStreetPrompts.recruiter.length];
      }
      if (params.turnNumber <= 3) {
        return janeStreetPrompts.phone[(params.turnNumber - 2) % janeStreetPrompts.phone.length];
      }
      if (params.turnNumber <= 7) {
        return janeStreetPrompts.onsiteCodingSystem[
          (params.turnNumber - 4) % janeStreetPrompts.onsiteCodingSystem.length
        ];
      }
      if (params.turnNumber <= 9) {
        return janeStreetPrompts.onsiteReasoning[
          (params.turnNumber - 8) % janeStreetPrompts.onsiteReasoning.length
        ];
      }
      return janeStreetPrompts.projectDeepDive[
        (params.turnNumber - 10) % janeStreetPrompts.projectDeepDive.length
      ];
    })();

    const baseQuant = phasePrompt;
    if (params.difficulty >= 7) {
      return `${baseQuant} Keep your answer under 40 seconds and include one risk mitigation.`;
    }
    return baseQuant;
  }

  const pool = questionBank[params.interviewType];
  const base = pool[params.turnNumber % pool.length];

  if (params.difficulty >= 7 || params.priorScore.overall < 55) {
    return `${base} Keep it under 45 seconds and include one metric.`;
  }

  if (params.priorScore.overall >= 82) {
    return `${base} Add one tradeoff and your mitigation plan.`;
  }

  return base;
}
