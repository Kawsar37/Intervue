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

export const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
  const analysis: ResumeAnalysis = {
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    summary: generateSummary(text),
  };

  return analysis;
};

const extractSkills = (text: string): string[] => {
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP",
    "Docker", "Kubernetes", "Git", "CI/CD", "REST", "GraphQL",
    "HTML", "CSS", "Tailwind", "SASS", "Redux", "MobX",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
    "SQL", "NoSQL", "Agile", "Scrum", "Jira",
  ];

  const foundSkills: string[] = [];
  const textLower = text.toLowerCase();

  commonSkills.forEach((skill) => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
};

const extractExperience = (
  text: string
): ResumeAnalysis["experience"] => {
  const experience: ResumeAnalysis["experience"] = [];
  const lines = text.split("\n");
  let currentExp: { title: string; company: string; duration: string; description: string } | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (
      trimmed.match(/\b(Software|Senior|Junior|Lead|Principal|Staff)\b/i) ||
      trimmed.match(/\b(Engineer|Developer|Architect|Manager|Director)\b/i)
    ) {
      if (currentExp) {
        experience.push(currentExp);
      }
      currentExp = { title: trimmed, company: "", duration: "", description: "" };
    } else if (currentExp && !currentExp.company) {
      currentExp.company = trimmed;
    }
  });

  if (currentExp) {
    experience.push(currentExp);
  }

  return experience;
};

const extractEducation = (text: string): ResumeAnalysis["education"] => {
  const education: ResumeAnalysis["education"] = [];
  const educationPatterns = [
    /Bachelor(?:'s)?\s+(?:of\s+)?(?:Science|Arts|Engineering)\s+in\s+(\w+(?:\s+\w+)*)/i,
    /Master(?:'s)?\s+(?:of\s+)?(?:Science|Arts|Engineering)\s+in\s+(\w+(?:\s+\w+)*)/i,
    /Ph\.?D\.?\s+in\s+(\w+(?:\s+\w+)*)/i,
    /B\.?S\.?\s+in\s+(\w+(?:\s+\w+)*)/i,
    /M\.?S\.?\s+in\s+(\w+(?:\s+\w+)*)/i,
  ];

  const lines = text.split("\n");
  lines.forEach((line) => {
    educationPatterns.forEach((pattern) => {
      const match = line.match(pattern);
      if (match) {
        education.push({
          degree: match[0],
          institution: "",
          year: "",
        });
      }
    });
  });

  return education;
};

const generateSummary = (text: string): string => {
  const wordCount = text.split(/\s+/).length;
  const skillCount = extractSkills(text).length;

  return `Resume contains approximately ${wordCount} words with ${skillCount} identified technical skills.`;
};
