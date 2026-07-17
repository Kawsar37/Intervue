import { InterviewTemplate } from "../models/InterviewTemplate";

const templates = [
  {
    title: "Software Engineer - Frontend",
    description:
      "Practice frontend development interviews covering React, TypeScript, CSS, and web performance topics.",
    category: "Software Engineering",
    difficulty: "intermediate",
    estimatedDuration: 45,
    questionCount: 15,
    tags: ["React", "TypeScript", "CSS", "Frontend"],
    isPremium: false,
  },
  {
    title: "Software Engineer - Backend",
    description:
      "Backend development interview focusing on Node.js, databases, API design, and system architecture.",
    category: "Software Engineering",
    difficulty: "intermediate",
    estimatedDuration: 45,
    questionCount: 15,
    tags: ["Node.js", "Databases", "API", "Architecture"],
    isPremium: false,
  },
  {
    title: "Data Scientist",
    description:
      "Data science interview covering statistics, machine learning, Python, and data analysis.",
    category: "Data Science",
    difficulty: "advanced",
    estimatedDuration: 60,
    questionCount: 20,
    tags: ["Python", "ML", "Statistics", "Analytics"],
    isPremium: true,
  },
  {
    title: "Product Manager",
    description:
      "Product management interview covering product strategy, user research, metrics, and execution.",
    category: "Product Management",
    difficulty: "intermediate",
    estimatedDuration: 45,
    questionCount: 12,
    tags: ["Strategy", "Metrics", "User Research", "Agile"],
    isPremium: false,
  },
  {
    title: "UX Designer",
    description:
      "Design interview covering UX principles, portfolio review, design thinking, and user research.",
    category: "Design",
    difficulty: "beginner",
    estimatedDuration: 30,
    questionCount: 10,
    tags: ["UX", "Design Thinking", "Portfolio", "Research"],
    isPremium: false,
  },
  {
    title: "DevOps Engineer",
    description:
      "DevOps interview covering CI/CD, cloud infrastructure, containerization, and monitoring.",
    category: "DevOps",
    difficulty: "advanced",
    estimatedDuration: 50,
    questionCount: 18,
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    isPremium: true,
  },
  {
    title: "Junior Developer",
    description:
      "Entry-level interview covering programming fundamentals, basic data structures, and problem-solving.",
    category: "Software Engineering",
    difficulty: "beginner",
    estimatedDuration: 30,
    questionCount: 10,
    tags: ["Fundamentals", "JavaScript", "Problem Solving"],
    isPremium: false,
  },
  {
    title: "Full Stack Developer",
    description:
      "Full stack interview covering frontend, backend, databases, and deployment topics.",
    category: "Software Engineering",
    difficulty: "intermediate",
    estimatedDuration: 60,
    questionCount: 20,
    tags: ["React", "Node.js", "MongoDB", "Full Stack"],
    isPremium: false,
  },
];

export const seedTemplates = async (): Promise<void> => {
  try {
    const count = await InterviewTemplate.countDocuments();
    if (count === 0) {
      await InterviewTemplate.insertMany(templates);
      console.log("Templates seeded successfully");
    } else {
      console.log("Templates already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding templates:", error);
  }
};
