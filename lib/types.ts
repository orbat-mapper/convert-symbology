export type MatchType = "exact" | "partial" | "failed";

export interface Letter2NumberOptions {
  fallbackSidc?: string;
}

export interface Number2LetterOptions {}

export interface Letter2NumberResult {
  sidc: string;
  success: boolean;
}

export interface Number2LetterResult {
  sidc: string;
  success: boolean;
  match: MatchType;
}
