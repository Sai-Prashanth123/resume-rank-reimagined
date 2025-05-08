
import { Resume, ResumeScore, JobDescription } from "@/types/resume";

// Mock analysis function that would be replaced by a real NLP/AI service in production
export const analyzeResumes = async (
  resumes: Resume[],
  jobDescription: JobDescription
): Promise<ResumeScore[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const scores: ResumeScore[] = resumes.map((resume) => {
    // Generate random matching scores for demo purposes
    // In a real application, these would be calculated by comparing the resume content
    // against the job description using NLP techniques
    
    // Get random scores but make them somewhat related to each other
    const baseScore = Math.floor(Math.random() * 50) + 30;  // Base score between 30-80
    const variationRange = 20;  // Allow up to 20% variation from base score
    
    const keywordMatch = Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * variationRange) - variationRange/2));
    const skillsMatch = Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * variationRange) - variationRange/2));
    const experienceMatch = Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * variationRange) - variationRange/2));
    const educationMatch = Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * variationRange) - variationRange/2));
    
    // Overall score is weighted average of the components
    const overallScore = Math.round(
      (keywordMatch * 0.3 + skillsMatch * 0.3 + experienceMatch * 0.25 + educationMatch * 0.15)
    );

    // Generate evaluation details
    const evaluationDetails = generateEvaluationDetails(
      keywordMatch,
      skillsMatch,
      experienceMatch,
      educationMatch,
      jobDescription
    );

    return {
      resumeId: resume.id,
      resumeName: resume.name,
      fileName: resume.fileName,
      overallScore,
      keywordMatch,
      skillsMatch,
      experienceMatch,
      educationMatch,
      evaluationDetails,
    };
  });

  return scores;
};

const generateEvaluationDetails = (
  keywordMatch: number,
  skillsMatch: number,
  experienceMatch: number,
  educationMatch: number,
  jobDescription: JobDescription
): string[] => {
  const details: string[] = [];

  // Keyword match evaluation
  if (keywordMatch >= 80) {
    details.push(`Excellent keyword match with the job description. The resume contains most of the important terms required.`);
  } else if (keywordMatch >= 60) {
    details.push(`Good keyword match found. Consider adding more specific terms from the job description.`);
  } else {
    details.push(`Low keyword match. The resume lacks many important terms from the job description.`);
  }

  // Skills match evaluation
  if (skillsMatch >= 80) {
    details.push(`Excellent skills alignment. The resume demonstrates proficiency in ${jobDescription.skills.slice(0, 3).join(", ")}.`);
  } else if (skillsMatch >= 60) {
    details.push(`Good skills match, but some key skills like ${jobDescription.skills.slice(0, 2).join(", ")} could be highlighted more prominently.`);
  } else {
    details.push(`Low skills match. Consider highlighting or adding skills like ${jobDescription.skills.slice(0, 3).join(", ")}.`);
  }

  // Experience match evaluation
  if (experienceMatch >= 80) {
    details.push(`Work experience aligns very well with the job requirements.`);
  } else if (experienceMatch >= 60) {
    details.push(`Relevant work experience found, but could better highlight achievements related to ${jobDescription.requirements[0]}.`);
  } else {
    details.push(`Experience seems insufficient compared to job requirements. Consider highlighting relevant projects or achievements.`);
  }

  // Education match evaluation
  if (educationMatch >= 80) {
    details.push(`Education background is a great match for this role.`);
  } else if (educationMatch >= 60) {
    details.push(`Educational qualifications meet basic requirements, but could highlight relevant coursework or certifications.`);
  } else {
    details.push(`Educational background may need supplementing with relevant certifications or courses for this role.`);
  }

  return details;
};
