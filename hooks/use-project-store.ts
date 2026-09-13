import { create } from "zustand";
import type { Project } from "@/app/utils/data/projects-data";
import type { ConvexProjectRecord } from "@/components/project-list";

interface ProjectStore {
  projects: Project[];
  rawProjects: ConvexProjectRecord[];
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setRawProjects: (rawProjects: ConvexProjectRecord[]) => void;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  rawProjects: [],
  selectedProject: null,
  setProjects: (projects) => set({ projects }),
  setRawProjects: (rawProjects) => set({ rawProjects }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
}));
