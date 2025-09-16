import axios from 'axios';
import type { ResumeState } from '@/stores/resume.store';

const api = axios.create({ baseURL: '/api/resume' });

export const loadResume = (id: string) => api.get<ResumeState>(`/${id}`).then(r => r.data);
export const saveModule = (resumeId: string, moduleKey: string, payload: any) =>
  api.post(`/saveModule`, { resumeId, moduleKey, payload }).then(r => r.data);
export const saveResumeMeta = (resume: Partial<ResumeState>) =>
  api.post(`/saveMeta`, resume).then(r => r.data);
