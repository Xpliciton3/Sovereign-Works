import { TENDING_PROFILE } from '../profiles';

export const TENDING_DECLARATION = TENDING_PROFILE.morningDeclaration;
export const TENDING_DECLARATION_INSTRUCTION = TENDING_PROFILE.morningDeclarationInstruction;
export const TENDING_AXIOM = TENDING_PROFILE.axiom;

export const TENDING_MORNING_QUIET =
  'Twenty minutes of quiet first. The rest waits.';

// TODO: full Replenishment Session instructions from MASTER_TENDING.md
export const TENDING_REPLENISHMENT =
  'Two hours. Protected. Not negotiable with the household calendar.';

// TODO: full Evening Inventory questions from MASTER_TENDING.md
export const TENDING_EVENING_INVENTORY = [
  'What did I tend today that mattered?',
  'Where did I give from depletion instead of fullness?',
];
