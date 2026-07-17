import { Testimonial } from "../models/Testimonial";
import { Faq } from "../models/Faq";

const testimonialData = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    content: "Intervue helped me prepare for my Google interview. The AI-generated questions were spot-on and the feedback after each answer was incredibly detailed. I got the offer!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Frontend Developer",
    company: "Meta",
    content: "The resume analysis feature is amazing. It identified skills I didn't even know I had and generated questions that matched my experience perfectly.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    company: "Amazon",
    content: "I practiced with Intervue every day for two weeks before my Amazon interview. The personalized recommendations helped me focus on my weak areas.",
    rating: 4,
  },
  {
    name: "James Wilson",
    role: "Full Stack Developer",
    company: "Startup",
    content: "As a career changer, I needed to brush up on technical interviews. Intervue's templates covered everything from system design to behavioral questions.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager",
    company: "Microsoft",
    content: "The performance tracking over time showed me exactly where I was improving. The AI feedback is like having a personal interview coach available 24/7.",
    rating: 5,
  },
];

const faqData = [
  {
    question: "Is Intervue free to use?",
    answer: "Yes, Intervue offers a free tier that includes resume analysis, 3 interview sessions per month, and basic feedback. Premium plans unlock unlimited interviews, detailed analytics, and priority AI responses.",
    category: "pricing",
    order: 1,
  },
  {
    question: "How does the AI feedback work?",
    answer: "Our AI analyzes each answer for relevance, depth, clarity, and completeness. It provides a score from 0-10 along with constructive feedback on how to improve. After the interview, you receive an overall assessment with category breakdowns and personalized recommendations.",
    category: "features",
    order: 2,
  },
  {
    question: "Can I practice for specific job roles?",
    answer: "Absolutely! We offer interview templates for various roles including Frontend Engineer, Backend Engineer, Data Scientist, Product Manager, UX Designer, DevOps Engineer, and more. You can also create custom templates tailored to specific job descriptions.",
    category: "features",
    order: 3,
  },
  {
    question: "What file formats are supported for resume upload?",
    answer: "Currently, we support PDF files up to 5MB. Our AI extracts text from your resume, identifies skills, experience, and education to generate personalized interview questions.",
    category: "features",
    order: 4,
  },
  {
    question: "How accurate are the AI-generated questions?",
    answer: "Our AI generates questions based on industry standards, job requirements, and your specific background. The questions are designed to mirror real interview scenarios at top companies. We continuously improve our models based on user feedback.",
    category: "features",
    order: 5,
  },
  {
    question: "Can I track my progress over time?",
    answer: "Yes! The dashboard provides detailed analytics including your average score, completion rate, performance trends over time, and category-specific breakdowns. You can see exactly which areas you've improved in.",
    category: "features",
    order: 6,
  },
];

export const seedTestimonialsAndFaq = async () => {
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(testimonialData);
    console.log(`Seeded ${testimonialData.length} testimonials`);
  }

  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany(faqData);
    console.log(`Seeded ${faqData.length} FAQs`);
  }
};
