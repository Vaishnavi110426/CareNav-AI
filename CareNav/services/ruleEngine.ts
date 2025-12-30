
import { DEPARTMENT_RULES } from '../constants';

/**
 * Deterministically maps symptoms to medical departments based on keyword matching.
 * This is a safety layer to avoid AI hallucination for core routing.
 */
export const classifyDepartment = (symptoms: string): string => {
  const input = symptoms.toLowerCase();
  
  for (const rule of DEPARTMENT_RULES) {
    if (rule.keywords.some(keyword => input.includes(keyword))) {
      return rule.department;
    }
  }
  
  return 'General Practitioner';
};
