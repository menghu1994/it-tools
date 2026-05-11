import request from '@/api/request';
import type { ResumeState, ResumeSummary } from '@/tools/resume/resume.type';

const basePath = '/it-tools/resumes';

export const resumeService = {
  list() {
    return request.get<ResumeSummary[]>(basePath).then(response => response.data);
  },
  get(id: string) {
    return request.get<ResumeState>(`${basePath}/${id}`).then(response => response.data);
  },
  create(payload?: { title?: string }) {
    return request.post<ResumeState>(basePath, payload || {}).then(response => response.data);
  },
  update(id: string, payload: ResumeState) {
    return request.patch<ResumeState>(`${basePath}/${id}`, payload).then(response => response.data);
  },
  remove(id: string) {
    return request.delete(`${basePath}/${id}`).then(response => response.data);
  },
};
