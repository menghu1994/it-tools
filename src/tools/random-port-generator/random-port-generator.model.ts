import { randIntFromInterval } from '@/utils/random';

export const generatePort = (min: number, max: number) => randIntFromInterval(min, max);
