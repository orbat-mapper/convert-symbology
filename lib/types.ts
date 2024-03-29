export type MatchType = "exact" | "partial" | "closest" | "failed";

export interface Letter2NumberOptions {
  fallbackSidc?: string;
}

export interface Number2LetterOptions {}

export interface Letter2NumberResult {
  sidc: string;
  success: boolean;
  match: MatchType;
}

export interface Number2LetterResult {
  sidc: string;
  success: boolean;
  match: MatchType;
}
