export type ModuleKey =
  | 'personal'
  | 'objective'
  | 'education'
  | 'work'
  | 'project'
  | 'campus'
  | 'honor'
  | 'skills'
  | 'custom';

export interface PersonalInfo {
  name?: string;
  gender?: string;
  age?: number;
  political?: string;
  city?: string;
  degree?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Objective {
  position?: string;
  city?: string;
  salary?: string;
}

export interface EducationItem {
  id: string;
  from: string;
  to: string;
  school: string;
  major: string;
  degree: string;
  gpa?: string;
  rank?: string;
}

export interface WorkItem {
  id: string;
  from: string;
  to: string;
  company: string;
  dept?: string;
  position: string;
  contents: string[]; // 多条工作内容
}
