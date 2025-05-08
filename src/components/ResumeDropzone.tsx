
import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Resume } from "@/types/resume";

interface ResumeDropzoneProps {
  onResumeUpload: (resumes: Resume[]) => void;
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ onResumeUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf" || 
                  file.type === "application/msword" || 
                  file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      if (files.length === 0) {
        toast({
          title: "Invalid file format",
          description: "Please upload PDF or Word documents only.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFiles((prev) => [...prev, ...files]);
    },
    [toast]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      const files = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf" || 
                  file.type === "application/msword" || 
                  file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      if (files.length === 0) {
        toast({
          title: "Invalid file format",
          description: "Please upload PDF or Word documents only.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFiles((prev) => [...prev, ...files]);
    },
    [toast]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const processFiles = useCallback(async () => {
    setIsUploading(true);
    
    try {
      // In a real application, you would send these files to a server
      // Here we'll simulate file processing and extraction with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock parsed resume data
      const parsedResumes: Resume[] = uploadedFiles.map((file, index) => ({
        id: `resume-${Date.now()}-${index}`,
        name: file.name.split('.')[0],
        fileName: file.name,
        uploadDate: new Date(),
        content: `Mock content for ${file.name}. In a real application, this would contain the extracted text from the resume.`,
      }));
      
      onResumeUpload(parsedResumes);
      
      toast({
        title: "Resumes uploaded successfully",
        description: `${parsedResumes.length} ${parsedResumes.length === 1 ? 'resume' : 'resumes'} are ready for analysis.`,
      });
      
      // Clear the uploaded files
      setUploadedFiles([]);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your resumes.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles, onResumeUpload, toast]);

  return (
    <Card className="shadow-lg border-resume-border">
      <CardContent className="p-6">
        <div
          className={`resume-drop-area ${isDragging ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-resume-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-resume-primary animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Resumes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag & drop your resume files here, or click to select files
            </p>
            <Button
              variant="outline"
              className="relative border-resume-primary text-resume-primary hover:bg-resume-primary/10"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              Select Files
              <input
                id="file-input"
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileInput}
              />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6 animate-slide-up">
            <h4 className="text-sm font-medium mb-3">Selected Files</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-resume-background rounded-md border border-resume-border animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-resume-primary/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-resume-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={processFiles}
                disabled={isUploading}
                className="bg-resume-primary hover:bg-resume-secondary text-white"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Analyze Resumes"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeDropzone;
