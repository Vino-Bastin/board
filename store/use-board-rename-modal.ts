import { create } from "zustand";

const defaultValues = {
  id: "",
  title: "",
};

interface UseBoardRenameModalState {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  open: (id: string, title: string) => void;
  close: () => void;
}

export const useBoardRenameModal = create<UseBoardRenameModalState>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  open: (id, title) => set({ isOpen: true, initialValues: { id, title } }),
  close: () => set({ isOpen: false, initialValues: defaultValues }),
}));
