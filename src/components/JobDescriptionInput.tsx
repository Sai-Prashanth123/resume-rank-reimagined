import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader, CheckCircle, ChevronDown, ChevronUp, ArrowRight, Building } from "lucide-react";
import { JobDescription } from "@/types/resume";
import { analyzeJobDescription, JobDescriptionAnalysis } from "@/services/jobDescriptionService";
import { motion, AnimatePresence } from "framer-motion";

interface JobDescriptionInputProps {
  onJobDescriptionSave: (jobDescription: JobDescription) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobDescriptionSave,
}) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<JobDescriptionAnalysis | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleAnalyzeDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await analyzeJobDescription(description);
      setAnalysis(result);
      
      // Initialize all sections as expanded
      const initialExpandedState: { [key: number]: boolean } = {};
      result.sections.forEach((_, index) => {
        initialExpandedState[index] = true;
      });
      setExpandedSections(initialExpandedState);
    } catch (error) {
      console.error("Error analyzing job description:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract skills and requirements from analysis
    const skillsSection = analysis?.sections.find(section => 
      section.section_name.toLowerCase().includes("technical") || 
      section.section_name.toLowerCase().includes("skill")
    );
    
    const requirementsSection = analysis?.sections.find(section =>
      section.section_name.toLowerCase().includes("work") ||
      section.section_name.toLowerCase().includes("experience") ||
      section.section_name.toLowerCase().includes("education") ||
      section.section_name.toLowerCase().includes("requirement")
    );

    const skills = skillsSection?.requirements || [];
    const requirements = requirementsSection?.requirements || [];

    const jobDescription: JobDescription = {
      id: `job-${Date.now()}`,
      title,
      company: company || "Not Specified",
      description,
      skills,
      requirements,
    };

    onJobDescriptionSave(jobDescription);
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Scroll to analysis results when they appear
  useEffect(() => {
    if (analysis && analysisRef.current) {
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [analysis]);

  // Count total requirements across all sections
  const totalRequirements = analysis 
    ? analysis.sections.reduce((total, section) => total + section.requirements.length, 0) 
    : 0;

  return (
    <Card className="shadow-lg border-resume-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-resume-text">
          Job Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyzeDescription} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-1 text-resume-text"
            >
              Job Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-resume-border focus:border-resume-primary focus:ring-resume-primary"
              placeholder="e.g. Senior Front-end Developer"
              required
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium mb-1 text-resume-text"
            >
              Company Name
            </label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border-resume-border focus:border-resume-primary focus:ring-resume-primary"
              placeholder="e.g. Acme Corporation"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1 text-resume-text"
            >
              Job Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] border-resume-border focus:border-resume-primary focus:ring-resume-primary"
              placeholder="Enter the full job description here..."
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-resume-primary hover:bg-resume-secondary text-white transition-all duration-300 transform hover:scale-105"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Analyze Description"
              )}
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {analysis && (
            <motion.div 
              ref={analysisRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-resume-text flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="mr-2 text-green-500"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                  Analysis Complete
                </h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-resume-primary/10 text-resume-primary text-sm font-medium px-3 py-1 rounded-full"
                >
                  {analysis.sections.length} Categories • {totalRequirements} Requirements
                </motion.div>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 gap-4"
                transition={{ 
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }}
              >
                {analysis.sections.map((section, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-resume-border shadow-sm overflow-hidden"
                  >
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-resume-primary/5 to-transparent"
                      onClick={() => toggleSection(index)}
                    >
                      <h4 className="font-semibold text-resume-text flex items-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 mr-3 rounded-full bg-resume-primary/10 text-resume-primary">
                          {index + 1}
                        </span>
                        {section.section_name}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({section.requirements.length})
                        </span>
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedSections[index] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-resume-text/50" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedSections[index] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 bg-gradient-to-b from-white to-resume-background/20">
                            <ul className="space-y-2 mt-2">
                              {section.requirements.map((req, reqIndex) => (
                                <motion.li 
                                  key={reqIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: reqIndex * 0.05 + 0.2 }}
                                  className="flex items-start text-sm text-resume-text"
                                >
                                  <span className="h-5 w-5 shrink-0 mr-2 text-resume-primary flex items-center justify-center rounded-full bg-resume-primary/10">•</span>
                                  <span>{req}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end mt-6"
              >
                <Button
                  onClick={handleSubmit}
                  className="bg-resume-primary hover:bg-resume-secondary text-white group flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                  <span>Use This Analysis</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;
