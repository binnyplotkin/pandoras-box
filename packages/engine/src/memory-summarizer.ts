import { MemorySummarizer } from "./interfaces";

export class RollingMemorySummarizer implements MemorySummarizer {
  summarize(previous: string[], addition: string) {
    return [...previous, addition].slice(-6);
  }
}
