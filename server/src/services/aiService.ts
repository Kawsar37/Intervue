import { geminiModel } from "../config/gemini";

export interface ResumeAnalysis {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  summary: string;
}

export interface GeneratedQuestion {
  question: string;
  category: string;
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
}

export interface OverallFeedback {
  overallScore: number;
  categoryScores: { category: string; score: number; feedback: string }[];
  feedback: string;
  recommendations: string[];
}

export const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
  const prompt = `Analyze the following resume text and extract structured information. Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "skills": ["skill1", "skill2"],
  "experience": [
    { "title": "Job Title", "company": "Company Name", "duration": "Jan 2020 - Present", "description": "Brief description of role" }
  ],
  "education": [
    { "degree": "Degree name", "institution": "University name", "year": "2020" }
  ],
  "summary": "A 2-3 sentence professional summary"
}

Resume text:
${text}`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response.text().trim();

  const jsonStr = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    skills: parsed.skills || [],
    experience: parsed.experience || [],
    education: parsed.education || [],
    summary: parsed.summary || "",
  };
};

export const generateInterviewQuestions = async (
  templateTitle: string,
  templateCategory: string,
  templateDifficulty: string,
  questionCount: number,
  resumeText?: string,
  jobDescription?: string
): Promise<GeneratedQuestion[]> => {
  const resumeSection = resumeText
    ? `\nCandidate's resume:\n${resumeText}`
    : "";
  const jobSection = jobDescription
    ? `\nTarget job description:\n${jobDescription}`
    : "";

  const prompt = `You are an expert interview coach. Generate ${questionCount} realistic interview questions for the following interview template.

Template: "${templateTitle}"
Category: ${templateCategory}
Difficulty: ${templateDifficulty}
${resumeSection}
${jobSection}

Requirements:
- Questions should match the difficulty level
- Include a mix of technical, behavioral, and scenario-based questions as appropriate for the category
- Each question must have a category label (e.g., "Technical", "Behavioral", "Problem Solving", "Experience", "Culture Fit")

Return ONLY valid JSON (no markdown, no code fences) as an array:
[
  { "question": "Question text here?", "category": "Category" }
]`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response.text().trim();

  const jsonStr = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return Array.isArray(parsed) ? parsed : [];
};

export const evaluateAnswer = async (
  question: string,
  answer: string,
  category: string
): Promise<AnswerEvaluation> => {
  const prompt = `You are an expert interview evaluator. Score the candidate's answer to the following interview question.

Question: "${question}"
Category: ${category}
Answer: "${answer}"

Evaluate the answer based on:
- Relevance to the question
- Depth and accuracy of the response
- Communication clarity
- Structure and completeness

Return ONLY valid JSON (no markdown, no code fences):
{ "score": <number 0-10>, "feedback": "<2-3 sentences of constructive feedback>" }

Score guide: 0-3 = Poor, 4-5 = Below Average, 6-7 = Good, 8-9 = Excellent, 10 = Outstanding`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response.text().trim();

  const jsonStr = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    score: Math.max(0, Math.min(10, parsed.score || 0)),
    feedback: parsed.feedback || "No feedback available.",
  };
};

export const generateOverallFeedback = async (
  questions: { question: string; category: string; answer: string; score: number }[]
): Promise<OverallFeedback> => {
  const qaBlock = questions
    .map(
      (q, i) =>
        `Q${i + 1} [${q.category}] (Score: ${q.score}/10): ${q.question}\nA: ${q.answer}`
    )
    .join("\n\n");

  const prompt = `You are an expert interview coach. The candidate just completed an interview. Here are the questions, answers, and per-question scores:

${qaBlock}

Provide a comprehensive evaluation. Return ONLY valid JSON (no markdown, no code fences):
{
  "overallScore": <number 0-100>,
  "categoryScores": [
    { "category": "Category Name", "score": <0-10>, "feedback": "Brief feedback for this category" }
  ],
  "feedback": "A detailed 3-5 sentence overall performance summary",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

The overallScore should be the weighted average of category scores scaled to 0-100.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response.text().trim();

  const jsonStr = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    overallScore: Math.max(0, Math.min(100, parsed.overallScore || 0)),
    categoryScores: parsed.categoryScores || [],
    feedback: parsed.feedback || "",
    recommendations: parsed.recommendations || [],
  };
};
