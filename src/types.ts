export interface TavanaFile {
  path: string;
  content: string;
}

export interface ProjectGalleries {
  code: string;
  assets: string;
  config: string;
}

export type DeploymentStatus = "Draft" | "Scaffolded" | "Compiled" | "Parked" | "Failed";
export type DeploymentProvider = "Netlify" | "Cloudflare-Pages" | "Custom-VPS" | "Firebase";

export interface DeploymentVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  status: "Success" | "Failed";
  provider: DeploymentProvider;
  files: TavanaFile[];
  sizeMB: number;
  commitMessage: string;
}

export interface TavanaProject {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  idea: string;
  sizeMB: number;
  status: DeploymentStatus;
  location?: string;
  files: TavanaFile[];
  galleries: ProjectGalleries;
  createdAt: string;
  automationLog: string[];
  manifestNote?: string;
  deployments?: DeploymentVersion[];
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  points: number;
}

export interface ManifestoPrinciple {
  key: string;
  title: string;
  farsiTitle: string;
  description: string;
  badge: string;
}
