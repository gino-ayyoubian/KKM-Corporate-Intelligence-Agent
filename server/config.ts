/**
 * KKM Corporate Intelligence Agent v3.0
 * Centralized Server Configuration
 *
 * All Gemini model identifiers and environment configurations are defined here strictly once.
 */

export const SERVER_CONFIG = {
  // Centralized model identifier (configurable via env var, defaults to 'gemini-flash-latest')
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-flash-latest',
  
  // API Key strictly kept on the server side
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  // Fallback to local corporate knowledge engine when key is missing or quota exceeded
  FALLBACK_TO_LOCAL: true,

  // Prototype operating mode banner
  PROTOTYPE_MODE: true,

  // Maximum output tokens for structured responses
  MAX_OUTPUT_TOKENS: 4096,

  // Default generation temperature (low for analytical and epistemic precision)
  TEMPERATURE: 0.2,
};
