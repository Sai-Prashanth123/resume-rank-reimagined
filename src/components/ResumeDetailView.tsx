
import React from "react";
import { ResumeScore } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResumeDetailViewProps {
  score: ResumeScore;
  onBack: () => void;
}

const ResumeDetailView: React.FC<ResumeDetailViewProps> = ({ score, onBack }) => {
  return (
    <Card className="shadow-lg border-resume-border animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rankings
          </Button>
          <CardTitle className="text-2xl text-resume-text">
            {score.resumeName}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {score.fileName}
          </p>
        </div>
        <div className={`score-badge score-badge-${
          score.overallScore >= 80 ? "high" : score.overallScore >= 60 ? "medium" : "low"
        } text-lg px-4 py-2`}>
          {score.overallScore}%
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Keyword Match</span>
                    <span className="text-sm font-bold">{score.keywordMatch}%</span>
                  </div>
                  <Progress value={score.keywordMatch} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Skills Match</span>
                    <span className="text-sm font-bold">{score.skillsMatch}%</span>
                  </div>
                  <Progress value={score.skillsMatch} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Experience Match</span>
                    <span className="text-sm font-bold">{score.experienceMatch}%</span>
                  </div>
                  <Progress value={score.experienceMatch} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Education Match</span>
                    <span className="text-sm font-bold">{score.educationMatch}%</span>
                  </div>
                  <Progress value={score.educationMatch} className="h-2 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Evaluation Details</h3>
            <div className="space-y-4">
              {score.evaluationDetails.map((detail, index) => (
                <div key={index} className="p-4 bg-resume-background rounded-lg border border-resume-border">
                  <p className="text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-resume-border">
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-resume-primary/10 rounded-lg">
              <h4 className="font-medium mb-2">How to Improve</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {score.keywordMatch < 70 && (
                  <li>Add more relevant keywords from the job description</li>
                )}
                {score.skillsMatch < 70 && (
                  <li>Highlight technical skills more prominently</li>
                )}
                {score.experienceMatch < 70 && (
                  <li>Better quantify achievements in work experience</li>
                )}
                {score.educationMatch < 70 && (
                  <li>Add relevant certifications or courses</li>
                )}
                <li>Tailor resume specifically to this position</li>
              </ul>
            </div>
            
            <div className="p-4 bg-resume-success/10 rounded-lg">
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {score.keywordMatch >= 70 && (
                  <li>Good keyword optimization</li>
                )}
                {score.skillsMatch >= 70 && (
                  <li>Strong technical skills alignment</li>
                )}
                {score.experienceMatch >= 70 && (
                  <li>Relevant experience well highlighted</li>
                )}
                {score.educationMatch >= 70 && (
                  <li>Education background matches requirements</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeDetailView;
