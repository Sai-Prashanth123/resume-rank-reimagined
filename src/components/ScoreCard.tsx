
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResumeScore } from "@/types/resume";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScoreCardProps {
  score: ResumeScore;
  rank: number;
  previousRank?: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  score, 
  rank, 
  previousRank 
}) => {
  const [animated, setAnimated] = useState(false);
  const [showRankChange, setShowRankChange] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show rank change animation if rank has changed
    if (previousRank !== undefined && rank !== previousRank) {
      setShowRankChange(true);
      const timer = setTimeout(() => {
        setShowRankChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [rank, previousRank]);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "score-badge-high";
    if (score >= 60) return "score-badge-medium";
    return "score-badge-low";
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Low Match";
  };

  const rankChange = previousRank !== undefined ? previousRank - rank : 0;
  const hasImproved = rankChange > 0;

  return (
    <Card
      className={`resume-card transition-all duration-500 ${
        animated ? "animate-bounce-in opacity-100" : "opacity-0"
      }`}
      style={{ animationDelay: `${rank * 0.1}s` }}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-resume-primary text-white flex items-center justify-center font-bold">
              {rank + 1}
            </div>
            <CardTitle className="text-lg truncate">{score.resumeName}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{score.fileName}</p>
        </div>
        <div className="flex items-center">
          <div
            className={`score-badge ${getScoreBadgeClass(score.overallScore)} animate-score-pulse`}
          >
            {score.overallScore}%
          </div>
          
          {showRankChange && rankChange !== 0 && (
            <div 
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium animate-score-count ${
                hasImproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {hasImproved ? `↑ ${rankChange}` : `↓ ${Math.abs(rankChange)}`}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                Keyword Match
              </span>
              <span className="text-xs font-medium">{score.keywordMatch}%</span>
            </div>
            <Progress
              value={score.keywordMatch}
              className="progress-bar"
              // Fixed: removed indicatorClassName
              style={{ "--progress-width": `${score.keywordMatch}%` } as React.CSSProperties}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                Skills Match
              </span>
              <span className="text-xs font-medium">{score.skillsMatch}%</span>
            </div>
            <Progress
              value={score.skillsMatch}
              className="progress-bar"
              // Fixed: removed indicatorClassName
              style={{ "--progress-width": `${score.skillsMatch}%` } as React.CSSProperties}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                Experience Match
              </span>
              <span className="text-xs font-medium">
                {score.experienceMatch}%
              </span>
            </div>
            <Progress
              value={score.experienceMatch}
              className="progress-bar"
              // Fixed: removed indicatorClassName
              style={{ "--progress-width": `${score.experienceMatch}%` } as React.CSSProperties}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                Education Match
              </span>
              <span className="text-xs font-medium">
                {score.educationMatch}%
              </span>
            </div>
            <Progress
              value={score.educationMatch}
              className="progress-bar"
              // Fixed: removed indicatorClassName
              style={{ "--progress-width": `${score.educationMatch}%` } as React.CSSProperties}
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-4 pt-3 border-t border-resume-border">
                  <p className="text-sm font-medium text-resume-text">
                    {getScoreBadgeText(score.overallScore)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {score.evaluationDetails[0]}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  {score.evaluationDetails.map((detail, i) => (
                    <p key={i} className="text-sm">{detail}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
