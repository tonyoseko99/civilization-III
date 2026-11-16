import { readdirSync, readFileSync } from 'node:fs';
import type { Cast, Entry, Scenes, Tally } from '../scripts/lib/types';

const read = <T>(p: string) => JSON.parse(readFileSync(p, 'utf8')) as T;
export const entries = readdirSync('data/entries')
  .map((f) => read<Entry>(`data/entries/${f}`))
  .sort((a, b) => a.order - b.order);
export const scenes = read<Scenes>('data/scenes.json').scenes;
export const cast = read<Cast>('data/cast.json');
export const tally = read<Tally>('data/tally.json');
