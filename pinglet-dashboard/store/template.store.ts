import { TabType } from "@/lib/interfaces/templates.interface"
import { create } from "zustand"

type TemplateStore = {
  selectedCategorySlug: string | null
  activeTab: TabType
  selectedTemplateId: string | null
  sidebarOpen: boolean
  setCategory: (slug: string) => void
  setTab: (tab: TabType) => void
  setSelectedTemplate: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
  resetSelection: () => void
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  selectedCategorySlug: null,
  activeTab: "default",
  selectedTemplateId: null,
  sidebarOpen: false,
  setCategory: (slug) =>
    set({
      selectedCategorySlug: slug,
      activeTab: "default",
      selectedTemplateId: null,
    }),
  setTab: (tab) => set({ activeTab: tab }),
  setSelectedTemplate: (id) => set({ selectedTemplateId: id }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  resetSelection: () =>
    set({
      selectedCategorySlug: null,
      activeTab: "default",
      selectedTemplateId: null,
    }),
}))
