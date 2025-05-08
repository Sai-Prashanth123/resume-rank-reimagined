
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { JobDescription } from "@/types/resume";

interface JobDescriptionInputProps {
  onJobDescriptionSave: (jobDescription: JobDescription) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobDescriptionSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const jobDescription: JobDescription = {
        title,
        description,
        skills: skills.split(",").map((skill) => skill.trim()),
        requirements: requirements.split(",").map((req) => req.trim()),
      };

      onJobDescriptionSave(jobDescription);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg border-resume-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-resume-text">
          Job Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium mb-1 text-resume-text"
            >
              Required Skills
            </label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="border-resume-border focus:border-resume-primary focus:ring-resume-primary"
              placeholder="e.g. React, TypeScript, Node.js (comma separated)"
              required
            />
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium mb-1 text-resume-text"
            >
              Requirements
            </label>
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[80px] border-resume-border focus:border-resume-primary focus:ring-resume-primary"
              placeholder="e.g. 5+ years experience, Bachelor's degree (comma separated)"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-resume-primary hover:bg-resume-secondary text-white"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Analyze Resumes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;
