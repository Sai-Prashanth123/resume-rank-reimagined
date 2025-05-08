
import React, { useState, useEffect, useCallback } from "react";
import { ResumeScore } from "@/types/resume";
import ScoreCard from "./ScoreCard";
import ResumeDetailView from "./ResumeDetailView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ResumeRankingProps {
  scores: ResumeScore[];
}

const ResumeRanking: React.FC<ResumeRankingProps> = ({ scores }) => {
  const [sortedScores, setSortedScores] = useState<ResumeScore[]>([]);
  const [previousRanks, setPreviousRanks] = useState<Record<string, number>>({});
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Set up the initial sorting (descending by default)
  useEffect(() => {
    if (scores.length) {
      // Store the previous ranks before sorting
      const currentRanks: Record<string, number> = {};
      sortedScores.forEach((score, index) => {
        currentRanks[score.resumeId] = index;
      });
      
      if (Object.keys(currentRanks).length) {
        setPreviousRanks(currentRanks);
      }

      // Sort the scores
      const sorted = [...scores].sort((a, b) => 
        sortAscending ? a.overallScore - b.overallScore : b.overallScore - a.overallScore
      );
      
      setSortedScores(sorted);
    }
  }, [scores, sortAscending]);

  const toggleSortOrder = useCallback(() => {
    // Store current ranks before changing sort order
    const currentRanks: Record<string, number> = {};
    sortedScores.forEach((score, index) => {
      currentRanks[score.resumeId] = index;
    });
    
    setPreviousRanks(currentRanks);
    setSortAscending(prev => !prev);
  }, [sortedScores]);

  const handleCardClick = useCallback((resumeId: string) => {
    setSelectedResumeId(resumeId);
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedResumeId(null);
  }, []);

  if (scores.length === 0) return null;
  
  // Show detailed view if a resume is selected
  if (selectedResumeId) {
    const selectedResume = sortedScores.find(score => score.resumeId === selectedResumeId);
    if (selectedResume) {
      return <ResumeDetailView score={selectedResume} onBack={handleBackClick} />;
    }
  }

  return (
    <Card className="shadow-lg border-resume-border">
      <CardHeader className="pb-4 flex justify-between">
        <CardTitle className="text-xl text-resume-text">
          Resume Rankings
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="border-resume-border text-resume-text hover:bg-resume-background"
        >
          {sortAscending ? (
            <div className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4" /> Lowest First
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <ArrowDown className="h-4 w-4" /> Highest First
            </div>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedScores.map((score, index) => (
            <div 
              key={score.resumeId} 
              onClick={() => handleCardClick(score.resumeId)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <ScoreCard
                score={score}
                rank={index}
                previousRank={previousRanks[score.resumeId]}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeRanking;
