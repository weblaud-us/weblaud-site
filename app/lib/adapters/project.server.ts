import type { Project } from "~/lib/types";

export interface BackendProject {
  _id: string;
  slug: string;
  name: string;
  description: string;
  featureList: string[];
  coverImage: string;
  coverImageAlt: string;
  problem: string;
  solution: string;
  techStack: string[];
  businessImpact: string;
  detailImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function toProject(doc: BackendProject): Project {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.name,
    description: doc.description,
    features: doc.featureList ?? [],
    image: doc.coverImage,
    imageAlt: doc.coverImageAlt || doc.name,
    problem: doc.problem,
    solution: doc.solution,
    techStack: doc.techStack ?? [],
    businessImpact: doc.businessImpact,
  };
}
