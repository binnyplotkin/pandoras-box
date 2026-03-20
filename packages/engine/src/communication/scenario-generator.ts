import { createId } from "@odyssey/utils";
import { CommunicationScenario, CommunicationScenarioInput } from "./types";
import { createPersonasForScenario } from "./persona-engine";

function defaultSetting(type: CommunicationScenarioInput["interviewType"]) {
  switch (type) {
    case "technical-interview":
      return "Live technical interview room with shared coding screen.";
    case "case-interview":
      return "Consulting case room with whiteboard and time pressure.";
    case "startup-pitch":
      return "Investor pitch meeting with partner panel.";
    case "panel-presentation":
      return "Executive panel presentation in conference setting.";
    case "press-interview":
      return "Press room with cameras and rapid-fire questions.";
    case "high-stakes-qa":
      return "High-pressure public Q&A after major announcement.";
    case "job-interview":
    default:
      return "Structured hiring interview room.";
  }
}

function defaultGoal(input: CommunicationScenarioInput) {
  switch (input.interviewType) {
    case "technical-interview":
      return `Demonstrate technical depth and clear problem solving for ${input.jobType}.`;
    case "case-interview":
      return "Structure ambiguous problems clearly and defend recommendations.";
    case "startup-pitch":
      return "Convince evaluators of market, execution, and defensibility.";
    case "panel-presentation":
      return "Present with clarity under challenge from multiple stakeholders.";
    case "press-interview":
      return "Maintain composure and deliver clear, credible messaging.";
    case "high-stakes-qa":
      return "Handle difficult questions without losing structure or confidence.";
    case "job-interview":
    default:
      return `Earn strong confidence for the ${input.jobType} role.`;
  }
}

function defaultTimeLimitMinutes(input: CommunicationScenarioInput) {
  const role = input.jobType.toLowerCase();
  const isJaneStreet = role.includes("jane street");

  if (isJaneStreet) {
    // Practical approximation of Jane Street interview-day duration.
    return 300;
  }

  switch (input.interviewType) {
    case "technical-interview":
    case "case-interview":
      return 40;
    case "panel-presentation":
      return 30;
    case "press-interview":
    case "high-stakes-qa":
      return 25;
    case "startup-pitch":
      return 20;
    case "job-interview":
    default:
      return 30;
  }
}

export function generateCommunicationScenario(
  input: CommunicationScenarioInput,
): CommunicationScenario {
  const interviewerCount = Math.max(1, Math.min(input.interviewerCount, 5));
  const timeLimitSeconds = Math.max(
    300,
    (input.timeLimitMinutes ?? defaultTimeLimitMinutes(input)) * 60,
  );

  return {
    id: createId("comms_scenario"),
    role: input.jobType,
    setting: input.setting ?? defaultSetting(input.interviewType),
    goal: input.goal ?? defaultGoal(input),
    timeLimitSeconds,
    participantCount: interviewerCount + 1,
    difficultyLevel: input.difficultyLevel,
    interviewType: input.interviewType,
    industry: input.industry,
    tone: input.tone,
    personas: createPersonasForScenario({
      interviewType: input.interviewType,
      tone: input.tone,
      difficultyLevel: input.difficultyLevel,
      interviewerCount,
    }),
  };
}
