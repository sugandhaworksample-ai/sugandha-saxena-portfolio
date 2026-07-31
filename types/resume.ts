import { z } from "zod";

export const skillGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string()).min(1),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  location: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  location: z.string().min(1),
});

export const freelanceProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().optional(),
  role: z.string().optional(),
});

export const highlightSchema = z.object({
  name: z.string().min(1),
  year: z.number().optional(),
  description: z.string().min(1),
});

export const resumeFrontmatterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().min(1),
  skills: z.array(skillGroupSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(freelanceProjectSchema).default([]),
  languages: z.array(z.string()).default([]),
  highlights: z.array(highlightSchema).default([]),
  links: z
    .object({
      behance: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      portfolio: z.string().url().optional(),
    })
    .default({}),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type FreelanceProject = z.infer<typeof freelanceProjectSchema>;
export type Highlight = z.infer<typeof highlightSchema>;
export type Resume = z.infer<typeof resumeFrontmatterSchema>;

export type TimelineEvent = {
  id: string;
  kind: "role" | "education" | "highlight" | "freelance";
  title: string;
  subtitle: string;
  start: string;
  end?: string;
  description?: string;
};
