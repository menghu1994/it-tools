import { defineStore } from 'pinia';
import { ref } from 'vue';
import { resumeService } from '@/api/resume/resume.service';
import { useUserStore } from '@/stores/user.store';
import type { ModuleKey, ResumeData, ResumeState, ResumeSummary } from '@/tools/resume/resume.type';

const LOCAL_DRAFT_KEY = 'resume_tool_draft';
const DEFAULT_RESUME_TITLE = '未命名简历';

export const resumeModuleLabelMap: Record<ModuleKey, string> = {
  personal: '个人信息',
  objective: '求职意向',
  education: '教育经历',
  work: '工作经历',
  project: '项目经历',
  campus: '校园经历',
  honor: '荣誉奖项',
  skills: '个人技能',
};

function createDefaultResumeData(): ResumeData {
  return {
    personal: {},
    objective: {},
    education: {},
    work: { projectExperience: [{}] },
    project: { projectExperience: [{}] },
    campus: { projectExperience: [{}] },
    honor: { honors: [{}] },
    skills: {},
  };
}

export function createDefaultResumeState(overrides?: Partial<ResumeState>): ResumeState {
  const defaultModulesOrder: ModuleKey[] = ['personal', 'objective', 'education', 'work', 'project', 'campus', 'honor', 'skills'];
  const defaultModulesVisible: Record<ModuleKey, boolean> = {
    personal: true,
    objective: true,
    education: true,
    work: true,
    project: true,
    campus: true,
    honor: true,
    skills: true,
  };

  return {
    id: undefined,
    title: DEFAULT_RESUME_TITLE,
    template: 'standard',
    modulesOrder: overrides?.modulesOrder?.length ? overrides.modulesOrder : defaultModulesOrder,
    modulesVisible: {
      ...defaultModulesVisible,
      ...(overrides?.modulesVisible || {}),
    },
    ...overrides,
    data: {
      ...createDefaultResumeData(),
      ...(overrides?.data || {}),
    },
  };
}

function cloneResume<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function readLocalDraft() {
  const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return createDefaultResumeState(JSON.parse(raw));
  }
  catch {
    localStorage.removeItem(LOCAL_DRAFT_KEY);
    return null;
  }
}

export const useResumeStore = defineStore('resume', () => {
  const userStore = useUserStore();
  const resume = ref<ResumeState>(createDefaultResumeState());
  const resumeList = ref<ResumeSummary[]>([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const isDirty = ref(false);
  const initialized = ref(false);

  function persistLocalDraft() {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(resume.value));
  }

  function clearLocalDraft() {
    localStorage.removeItem(LOCAL_DRAFT_KEY);
  }

  function setResume(nextResume: ResumeState, options?: { dirty?: boolean; keepLocalDraft?: boolean }) {
    resume.value = createDefaultResumeState(cloneResume(nextResume));
    isDirty.value = options?.dirty ?? false;
    if (options?.keepLocalDraft) {
      persistLocalDraft();
    }
    else if (!userStore.user) {
      persistLocalDraft();
    }
    else {
      clearLocalDraft();
    }
  }

  function touch() {
    isDirty.value = true;
    if (!userStore.user) {
      persistLocalDraft();
    }
  }

  function saveData(key: ModuleKey, value: ResumeState['data'][ModuleKey]) {
    resume.value.data[key] = cloneResume(value);
    touch();
  }

  function updateTitle(title: string) {
    resume.value.title = title.trim() || DEFAULT_RESUME_TITLE;
    touch();
  }

  function updateTemplate(template: ResumeState['template']) {
    resume.value.template = template;
    touch();
  }

  function updateModulesVisible(visible: Record<ModuleKey, boolean>) {
    resume.value.modulesVisible = { ...visible };
    touch();
  }

  function updateModulesOrder(modulesOrder: ModuleKey[]) {
    resume.value.modulesOrder = [...modulesOrder];
    touch();
  }

  async function loadResumeList() {
    if (!userStore.user) {
      resumeList.value = [];
      return [];
    }

    const list = await resumeService.list();
    resumeList.value = list;
    return list;
  }

  async function loadResume(id: string) {
    loading.value = true;
    try {
      const data = await resumeService.get(id);
      setResume(data);
      return data;
    }
    finally {
      loading.value = false;
    }
  }

  async function createResume(title?: string) {
    loading.value = true;
    try {
      if (!userStore.user) {
        setResume(createDefaultResumeState({ title: title?.trim() || DEFAULT_RESUME_TITLE }), { dirty: true, keepLocalDraft: true });
        return resume.value;
      }

      const created = await resumeService.create({ title: title?.trim() || DEFAULT_RESUME_TITLE });
      await loadResumeList();
      setResume(created);
      return created;
    }
    finally {
      loading.value = false;
    }
  }

  async function saveCurrentResume() {
    if (!userStore.user || !resume.value.id) {
      persistLocalDraft();
      isDirty.value = false;
      return resume.value;
    }

    saving.value = true;
    try {
      const saved = await resumeService.update(resume.value.id, cloneResume(resume.value));
      setResume(saved);
      await loadResumeList();
      return saved;
    }
    finally {
      saving.value = false;
    }
  }

  async function deleteCurrentResume() {
    if (!resume.value.id || !userStore.user) {
      setResume(createDefaultResumeState(), { dirty: false, keepLocalDraft: false });
      return;
    }

    deleting.value = true;
    try {
      await resumeService.remove(resume.value.id);
      const list = await loadResumeList();
      if (list[0]?.id) {
        await loadResume(list[0].id);
      }
      else {
        setResume(createDefaultResumeState());
      }
    }
    finally {
      deleting.value = false;
    }
  }

  async function init() {
    if (initialized.value) {
      return;
    }

    initialized.value = true;
    const localDraft = readLocalDraft();

    if (!userStore.user) {
      setResume(localDraft || createDefaultResumeState(), { keepLocalDraft: true });
      return;
    }

    const list = await loadResumeList();
    if (list[0]?.id) {
      await loadResume(list[0].id);
      return;
    }

    setResume(localDraft || createDefaultResumeState());
  }

  return {
    resume,
    resumeList,
    loading,
    saving,
    deleting,
    isDirty,
    init,
    touch,
    saveData,
    updateTitle,
    updateTemplate,
    updateModulesVisible,
    updateModulesOrder,
    loadResumeList,
    loadResume,
    createResume,
    saveCurrentResume,
    deleteCurrentResume,
  };
});
