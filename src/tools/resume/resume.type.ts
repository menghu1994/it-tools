export type ModuleKey =
  | 'personal'
  | 'objective'
  | 'education'
  | 'work'
  | 'project'
  | 'campus'
  | 'honor'
  | 'skills';

export interface PersonalInfo {
  name?: string
  sex?: string
  birth?: number | null
  showAge?: boolean
  fresh?: boolean
  firstWorking?: number | null
  political?: string
  address?: string
  originPlace?: string
  highestEducation?: string
  email?: string
  phoneNumber?: string
  avatar?: string | null
}

export interface ObjectiveInfo {
  post?: string
  intendedCities?: string
  lowest?: number | null
  highest?: number | null
  arrivalTime?: string
}

export interface EducationInfo {
  eduDuring?: [number, number] | null
  school?: string
  major?: string
  education?: string
  gpa?: string
  ranking?: string
}

export interface ExperienceDetail {
  title?: string
  content?: string
}

export interface WorkInfo {
  workDuring?: [number, number] | null
  company?: string
  department?: string
  position?: string
  projectExperience?: ExperienceDetail[]
}

export interface ProjectInfo {
  workDuring?: [number, number] | null
  organization?: string
  project?: string
  role?: string
  projectExperience?: ExperienceDetail[]
}

export interface CampusInfo {
  workDuring?: [number, number] | null
  organization?: string
  department?: string
  position?: string
  projectExperience?: ExperienceDetail[]
}

export interface HonorItem {
  date?: number | null
  competitionAwards?: string
}

export interface HonorInfo {
  honors?: HonorItem[]
}

export interface SkillsInfo {
  skill?: string
}

export interface ResumeData {
  personal: PersonalInfo
  objective: ObjectiveInfo
  education: EducationInfo
  work: WorkInfo
  project: ProjectInfo
  campus: CampusInfo
  honor: HonorInfo
  skills: SkillsInfo
}

export interface ResumeState {
  id?: string
  title: string
  template: 'standard' | 'simple'
  modulesOrder: ModuleKey[]
  modulesVisible: Record<ModuleKey, boolean>
  data: ResumeData
  createdAt?: string
  updatedAt?: string
}

export interface ResumeSummary {
  id: string
  title: string
  template: 'standard' | 'simple'
  updatedAt?: string
  createdAt?: string
}
