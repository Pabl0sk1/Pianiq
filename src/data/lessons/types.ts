export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'tip'; text: string }
  | { t: 'warn'; text: string }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'staff'; items: string[]; clef?: 'treble' | 'bass' | 'grand' }
  | { t: 'keys'; notes: string[]; labels?: Record<string, string>; low?: string; high?: string }
  | { t: 'listen'; label: string; notes: string; bpm?: number };

export interface Exercise {
  title: string;
  text: string;
  /** Secuencia en notación de texto: cada nota o acorde es un paso */
  steps: string;
  bpm?: number;
  clef?: 'treble' | 'bass' | 'grand' | 'none';
  /** Etiquetas de digitación por paso (opcional) */
  fingers?: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  goals: string[];
  blocks: Block[];
  exercises?: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Level {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  modules: Module[];
}
