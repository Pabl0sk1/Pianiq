import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import type { Lesson, Level, Module } from './types';

export type { Block, Exercise, Lesson, Level, Module } from './types';

export const LEVELS: Level[] = [level1, level2, level3, level4];

export interface LessonRef {
  lesson: Lesson;
  module: Module;
  level: Level;
  index: number;
}

export const ALL_LESSONS: LessonRef[] = LEVELS.flatMap((level) =>
  level.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module, level, index: 0 }))),
).map((r, index) => ({ ...r, index }));

export const findLesson = (id: string) => ALL_LESSONS.find((r) => r.lesson.id === id);
