import { defineStore } from "pinia";

export const useMyConfigStore = defineStore("config", {
  state: () => ({
    enableSeion: true,
    enableDakuon: true,
    enableYouon: true,
    // enableHira: true,
    // enableKana: true,
    enableRomaji: true,
    blankHira: true,
    blankKana: true,
    // blankRomaji: false,
    totalCount: 10,
    currentCount: 0,
    mistakeCount: 0,
    startTime: Date.now(),
    started: false,
    weights: {} as Record<string, number>,
    fonts: '"Noto Sans JP"',
    // lastNoticeTime: "",
    optionCount: 6,
    correctWaitingTime: 500,
    wrongWaitingTime: 2000,
  }),
  actions: {},
  persist: true,
});
