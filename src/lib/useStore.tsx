import { create } from "zustand";

export type CompressionResult = {
  error: string;
  original_file: string;
  success: boolean;
};

type StoreState = {
  selectedImages: string | string[] | null;
  setSelectedImages: (selected: string | string[] | null) => void;

  compressionResult: CompressionResult[] | null;
  setCompressionResult: (result: CompressionResult[] | null) => void;
};

const useStore = create<StoreState>((set) => ({
  selectedImages: null,
  setSelectedImages: (selected) => set(() => ({ selectedImages: selected })),

  compressionResult: null,
  setCompressionResult: (result) => set(() => ({ compressionResult: result })),
}));

export default useStore;
