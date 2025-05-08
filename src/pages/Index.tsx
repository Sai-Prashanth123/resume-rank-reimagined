
import React, { useState } from "react";
import ResumeDropzone from "@/components/ResumeDropzone";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import { Resume, ResumeScore, JobDescription } from "@/types/resume";
import { analyzeResumes } from "@/services/resumeAnalysis";
import ResumeRanking from "@/components/ResumeRanking";
import { Loader } from "lucide-react";
import ResumeAnalysisHeader from "@/components/ResumeAnalysisHeader";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [resumeScores, setResumeScores] = useState<ResumeScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleResumeUpload = (uploadedResumes: Resume[]) => {
    // Add new resumes to the existing collection
    setResumes((prev) => [...prev, ...uploadedResumes]);
    
    // If job description is already provided, analyze the new resumes
    if (jobDescription) {
      analyzeNewResumes(uploadedResumes, jobDescription);
    }
  };

  const handleJobDescriptionSave = async (jd: JobDescription) => {
    setJobDescription(jd);
    
    // If we already have resumes, analyze them with the new job description
    if (resumes.length > 0) {
      await analyzeAllResumes(resumes, jd);
    } else {
      toast({
        title: "Job description saved",
        description: "Now upload some resumes to analyze against this job description.",
      });
    }
  };

  const analyzeNewResumes = async (newResumes: Resume[], jd: JobDescription) => {
    setIsAnalyzing(true);
    try {
      // For each new resume, analyze and add to scores
      const newScores = await analyzeResumes(newResumes, jd);
      
      // Merge new scores with existing ones and re-sort
      setResumeScores(prev => {
        const combined = [...prev, ...newScores];
        return combined.sort((a, b) => b.overallScore - a.overallScore);
      });
      
      toast({
        title: "Analysis complete",
        description: `${newResumes.length} new ${newResumes.length === 1 ? 'resume' : 'resumes'} analyzed and ranked.`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing the resumes.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeAllResumes = async (allResumes: Resume[], jd: JobDescription) => {
    setIsAnalyzing(true);
    try {
      const scores = await analyzeResumes(allResumes, jd);
      setResumeScores(scores);
      
      toast({
        title: "Analysis complete",
        description: `${allResumes.length} ${allResumes.length === 1 ? 'resume' : 'resumes'} analyzed and ranked.`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing the resumes.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-resume-background/50">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-resume-text mb-4">
            Resume Rank
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Evaluate and rank resumes against job descriptions using our advanced ATS scoring system
          </p>
        </header>

        {resumeScores.length > 0 && jobDescription ? (
          <div className="mb-8">
            <ResumeAnalysisHeader 
              jobDescription={jobDescription}
              resumeCount={resumes.length}
            />
            {isAnalyzing ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <Loader className="h-12 w-12 text-resume-primary animate-spin mx-auto mb-4" />
                  <p className="text-lg font-medium text-resume-text">
                    Analyzing resumes...
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This may take a moment as we evaluate each resume against the job requirements
                  </p>
                </div>
              </div>
            ) : (
              <ResumeRanking scores={resumeScores} />
            )}
            <div className="mt-8">
              <ResumeDropzone onResumeUpload={handleResumeUpload} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <JobDescriptionInput onJobDescriptionSave={handleJobDescriptionSave} />
            </div>
            <div>
              <ResumeDropzone onResumeUpload={handleResumeUpload} />
            </div>
          </div>
        )}

        {isAnalyzing && !resumeScores.length && (
          <div className="mt-12 flex items-center justify-center p-12">
            <div className="text-center">
              <Loader className="h-12 w-12 text-resume-primary animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-resume-text">
                Analyzing resumes...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a moment as we evaluate each resume against the job requirements
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
