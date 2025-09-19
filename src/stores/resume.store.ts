import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loadResume, saveModule, saveResumeMeta } from '@/api/resume/resume.service';
import type { EducationItem, ModuleKey, Objective, PersonalInfo, WorkItem } from '@/tools/resume/resume.type';

export interface ResumeState {
  id?: string;
  template: string;
  modulesOrder: ModuleKey[];
  modulesVisible: Record<ModuleKey | string, boolean>;
  data: {
    personal?: PersonalInfo;
    objective?: Objective;
    education?: EducationItem[];
    work?: WorkItem[];
    project?: any[];
    campus?: any[];
    honor?: any[];
    skills?: string[];
    custom?: { id:string; title: string; content: string }[];
  }
}

export const resumeModuleLabelMap: Record<ModuleKey | string, string> = {
  'personal': '个人信息',
  'objective': '求职意向',
  'education': '教育经历',
  'work': '工作经历',
  'project': '项目经历',
  'campus': '校内经历',
  'honor': '荣誉奖项',
  'skills': '个人技能',
}

export const useResumeStore = defineStore('resume', () => {
  const resume = ref<ResumeState>({
    id: undefined,
    template: 'default',
    modulesOrder: ['personal','objective','education','work','project','campus','honor','skills'],
    modulesVisible: {
      personal:true, objective:true, education:true, work:true, project:true, campus:true, honor:true, skills:true
    },
    data: {
      personal: {},
      objective: {},
      education: [],
      work: [],
      project: [],
      campus: [],
      honor: [],
      skills: []
    }
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
    (resume.value as any)[moduleKey] = payload;
    await saveModule(resume.value.id!, moduleKey, payload);
  }

  async function saveMeta() {
    await saveResumeMeta(resume.value);
  }

  return { resume, init, saveModuleData, saveMeta };
});
