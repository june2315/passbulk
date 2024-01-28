import { create } from 'zustand';

interface globalState {
  bears: number;
  increasePopulation: () => void;
  passwordMap: any;
  updatePasswordMap: (record: any) => void;
  removeAllBears: () => void;
}

const useStore = create<globalState>((set) => ({
  bears: 0,
  passwordMap: {},
  updatePasswordMap: (record) =>
    set((state: any) => {
      state.passwordMap[record.id] = state.passwordMap[record.id] ? null : record.password;
      return { passwordMap: { ...state.passwordMap } };
    }),
  increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default useStore;
