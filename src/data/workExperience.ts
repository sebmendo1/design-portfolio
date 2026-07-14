import { getWorkExperienceList, type ProfileRole } from '@/data/profile';

export type { ProfileRole };

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  logo?: string;
}

/** @deprecated Prefer PROFILE_ROLES from @/data/profile for full career data. */
export const workExperience: WorkExperience[] = getWorkExperienceList();

export { PROFILE_ROLES, getWorkExperienceList } from '@/data/profile';
