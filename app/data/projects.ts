import pimg01 from "~/assets/pimg-01.png";
import pimg02 from "~/assets/pimg-02.png";
import pimg03 from "~/assets/pimg-03.png";
import pimg04 from "~/assets/pimg-04.png";
import pimg05 from "~/assets/pimg-05.png";
import pimg06 from "~/assets/pimg-06.png";

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  problem: string;
  solution: string;
  techStack: string[];
  businessImpact: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "machine-learning-platform",
    title: "Machine Learning Platform",
    description:
      "Advanced AI-powered platform leveraging cutting-edge machine learning algorithms to deliver predictive analytics, automated decision-making, and intelligent data processing for enterprise solutions.",
    features: [
      "Neural network training & optimization",
      "Real-time predictive analytics",
      "Automated model deployment pipeline",
    ],
    image: pimg01,
    imageAlt: "AI Machine Learning Project",
    problem: "The client, a leading logistics enterprise, struggled with inefficient route planning and unpredictable delivery times due to a lack of dynamic forecasting capabilities.",
    solution: "We engineered an end-to-end Machine Learning Platform that ingests live traffic, weather, and fleet data. By utilizing deep learning models, the system dynamically reroutes drivers and predicts delivery ETAs with high precision.",
    techStack: ["Python", "TensorFlow", "AWS SageMaker", "React", "Node.js", "PostgreSQL"],
    businessImpact: "Reduced average delivery time by 18%, slashed fuel consumption by 12%, and improved customer satisfaction scores by 35% within the first quarter of deployment."
  },

  {
    id: 4,
    slug: "data-analytics-platform",
    title: "Data Analytics Platform",
    description:
      "Comprehensive data analytics solution providing deep insights through advanced visualization, statistical analysis, and big data processing capabilities for data-driven decision making.",
    features: [
      "Interactive data visualization",
      "Big data processing engine",
      "Custom reporting & dashboards",
    ],
    image: pimg04,
    imageAlt: "Data Analytics Project",
    problem: "A large retail chain had terabytes of customer data trapped in siloed legacy systems, preventing them from understanding purchasing behavior or personalizing marketing efforts.",
    solution: "We built a centralized data lake and a custom analytics platform. Using modern data pipelines, we unified the disparate data sources into a single dashboard that provides real-time, actionable insights via interactive visual reporting.",
    techStack: ["Snowflake", "dbt", "Apache Airflow", "React", "D3.js", "Python"],
    businessImpact: "Increased cross-sell revenue by 22% through personalized marketing campaigns and saved the analytics team over 40 hours per week in manual report generation."
  },
  {
    id: 5,
    slug: "business-intelligence",
    title: "Business Intelligence",
    description:
      "Enterprise-grade business intelligence platform delivering actionable insights through powerful analytics, KPI tracking, and comprehensive reporting tools for strategic business growth.",
    features: [
      "Executive dashboard & KPI tracking",
      "Predictive business analytics",
      "Multi-source data integration",
    ],
    image: pimg05,
    imageAlt: "Business Intelligence Dashboard",
    problem: "C-suite executives at a multinational corporation lacked real-time visibility into global operations, often relying on month-old spreadsheet data to make critical financial decisions.",
    solution: "We developed a tailored Business Intelligence (BI) suite. The system aggregates global financial, HR, and operational data into role-based executive dashboards, featuring predictive forecasting and anomaly detection.",
    techStack: ["PowerBI Embedded", "Node.js", "GraphQL", "PostgreSQL", "React", "Azure"],
    businessImpact: "Accelerated executive decision-making speed by 80%, identified $4M in operational inefficiencies, and unified 15 regional departments under a single source of truth."
  },
  {
    id: 6,
    slug: "enterprise-infrastructure",
    title: "Enterprise Infrastructure",
    description:
      "Robust and scalable enterprise infrastructure solutions featuring cloud-native architecture, microservices, and DevOps automation for high-performance and reliable business operations.",
    features: [
      "Cloud-native architecture design",
      "Automated CI/CD pipelines",
      "High availability & disaster recovery",
    ],
    image: pimg06,
    imageAlt: "Enterprise Infrastructure Project",
    problem: "A rapidly growing SaaS startup experienced frequent downtime and slow deployment cycles due to a monolithic architecture and manual infrastructure provisioning.",
    solution: "We orchestrated a complete migration from a legacy monolith to a microservices architecture hosted on AWS. We implemented Infrastructure as Code (IaC) and fully automated CI/CD pipelines to ensure zero-downtime deployments.",
    techStack: ["AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Datadog"],
    businessImpact: "Achieved 99.99% uptime, reduced deployment time from 2 days to 15 minutes, and cut monthly cloud hosting costs by 30% through optimized resource allocation."
  },
];
