export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  logo?: string;
}

export const workExperience: WorkExperience[] = [
  {
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer',
    period: '2023 - Current',
    startYear: 2023,
    current: true
  },
  {
    company: 'Salesforce',
    role: 'Product Designer',
    period: '2021 - 2023',
    startYear: 2021,
    endYear: 2023,
    current: false
  },
  {
    company: 'Writer.com',
    role: 'Product Designer (Contract)',
    period: '2021',
    startYear: 2021,
    endYear: 2021,
    current: false
  },
  {
    company: 'Chorus AI',
    role: 'Product Designer (Contract)',
    period: '2020 - 2021',
    startYear: 2020,
    endYear: 2021,
    current: false
  },
  {
    company: 'Shift',
    role: 'Product Design Intern',
    period: '2019 - 2020',
    startYear: 2019,
    endYear: 2020,
    current: false
  }
];
