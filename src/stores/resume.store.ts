import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loadResume, saveModule, saveResumeMeta } from '@/api/resume/resume.service';
import type { EducationItem, ModuleKey, Objective, PersonalInfo, WorkItem } from '@/tools/resume/resume.type';

export interface ResumeState {
  id?: string;
  template: string;
  modulesOrder: ModuleKey[];
  modulesVisible: Record<ModuleKey, boolean>;
  personal: PersonalInfo;
  objective: Objective;
  education: EducationItem[];
  work: WorkItem[];
  project: any[];
  campus: any[];
  honor: any[];
  skills: string[]; // 自定义技能项
  custom: { id:string; title: string; content: string }[];
}

export const useResumeStore = defineStore('resume', () => {
  const resume = ref<ResumeState>({
    id: undefined,
    template: 'default',
    modulesOrder: ['personal','objective','education','work','project','campus','honor','skills','custom'],
    modulesVisible: {
      personal:true, objective:true, education:true, work:true, project:true, campus:true, honor:true, skills:true, custom:true
    },
    personal: {},
    objective: {},
    education: [],
    work: [],
    project: [],
    campus: [],
    honor: [],
    skills: [],
    custom: []
  });

  async function init(id?: string) {
    if (id) {
      const data = await loadResume(id);
      resume.value = data;
    } else {
      resume.value.id = '';
    }
  }

  async function saveModuleData(moduleKey: string, payload: any) {
    // optimistic update
    (resume.value as any)[moduleKey] = payload;
    // call backend
    await saveModule(resume.value.id!, moduleKey, payload);
  }

  async function saveMeta() {
    await saveResumeMeta({ id: resume.value.id, template: resume.value.template, modulesOrder: resume.value.modulesOrder, modulesVisible: resume.value.modulesVisible});
  }

  return { resume, init, saveModuleData, saveMeta };
});
