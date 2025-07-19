import { TabType } from "@/lib/interfaces/templates.interface"
import { create } from "zustand"

type TemplateStore = {
  selectedCategoryId: number | null
  activeTab: TabType
  selectedTemplateId: string | null
  sidebarOpen: boolean
  setCategory: (id: number) => void
  setTab: (tab: TabType) => void
  setSelectedTemplate: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
  resetSelection: () => void
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  selectedCategoryId: null,
  activeTab: "default",
  selectedTemplateId: null,
  sidebarOpen: false,
  setCategory: (id) =>
    set({
      selectedCategoryId: id,
      activeTab: "default",
      selectedTemplateId: null,
    }),
  setTab: (tab) => set({ activeTab: tab }),
  setSelectedTemplate: (id) => set({ selectedTemplateId: id }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  resetSelection: () =>
    set({
      selectedCategoryId: null,
      activeTab: "default",
      selectedTemplateId: null,
    }),
}))
