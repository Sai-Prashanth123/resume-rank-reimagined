
export interface Resume {
  id: string;
  name: string;
  fileName: string;
  uploadDate: Date;
  content: string;
}

export interface ResumeScore {
  resumeId: string;
  resumeName: string;
  fileName: string;
  overallScore: number;
  keywordMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  evaluationDetails: string[];
}

export interface JobDescription {
  title: string;
  description: string;
  skills: string[];
  requirements: string[];
}
