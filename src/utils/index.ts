import { GLOBAL_CONFIG } from "./config";
import {
  DAKUON_LIST,
  HIRA_TO_OTO,
  HIRA_TO_OTO_TYPE,
  OtoType,
  SEION_LIST,
  YOUON_LIST,
  type Oto,
} from "./gojuon";

export type Blank = {
  fill: Oto;
  answer: Oto;
  blank: "hira" | "kana" | "romaji";
};

function searchOtoByHira(hira: string): Oto | undefined {
  return HIRA_TO_OTO[hira];
}

function getHiraType(hira: string): OtoType | undefined {
  return HIRA_TO_OTO_TYPE[hira];
}

function isOtoTypeEnabled(type: OtoType): boolean {
  return (
    (type === OtoType.seion && GLOBAL_CONFIG.enableSeion) ||
    (type === OtoType.dakuon && GLOBAL_CONFIG.enableDakuon) ||
    (type === OtoType.youon && GLOBAL_CONFIG.enableYouon)
  );
}

function getFullList() {
  let list: Oto[] = [];
  if (GLOBAL_CONFIG.enableSeion) {
    list = list.concat(SEION_LIST);
  }
  if (GLOBAL_CONFIG.enableDakuon) {
    list = list.concat(DAKUON_LIST);
  }
  if (GLOBAL_CONFIG.enableYouon) {
    list = list.concat(YOUON_LIST);
  }
  return list;
}

function getWeightedList() {
  let result = getFullList();
  Object.keys(GLOBAL_CONFIG.weights).forEach((k) => {
    let weight = GLOBAL_CONFIG.weights[k];
    const type = getHiraType(k);
    if (type && weight > 0 && isOtoTypeEnabled(type)) {
      let oto = searchOtoByHira(k);
      if (oto) {
        while (weight-- > 0) {
          result.push(oto);
        }
      }
    }
  });
  return result;
}

function getRandomBlankType() {
  const types = [];
  if (GLOBAL_CONFIG.blankHira) {
    types.push("hira");
  }
  if (GLOBAL_CONFIG.blankKana) {
    types.push("kana");
  }
  // if (GLOBAL_CONFIG.enableRomaji && GLOBAL_CONFIG.blankRomaji) {
  //   types.push("romaji");
  // }
  return types[Math.floor(Math.random() * types.length)];
}

export function generateBlank() {
  let list = getWeightedList();
  let answer = list[Math.floor(Math.random() * list.length)];
  let blank = getRandomBlankType();
  let fill = { ...answer };
  (fill as { [key: string]: string })[blank] = "";
  return { fill, answer, blank };
}

function randomlySelect<T>(array: T[], count: number): T[] {
  const result: T[] = [];
  while (count-- > 0) {
    let index = Math.floor(Math.random() * array.length);
    result.push(array[index]);
    array.splice(index, 1);
  }
  return result;
}

export function generateOptions(oto: Oto, blankType: string): string[] {
  const otoType = HIRA_TO_OTO_TYPE[oto.hira];
  const list = OTO_TYPE_TO_LIST[otoType];
  list.splice(
    list.findIndex((o) => o.hira === oto.hira),
    1
  );
  const result: string[] = [];
  switch (blankType) {
    case "hira":
      result.push(
        ...randomlySelect(list, GLOBAL_CONFIG.optionCount - 1).map(
          (o) => o.hira
        )
      );
      break;
    case "kana":
      result.push(
        ...randomlySelect(list, GLOBAL_CONFIG.optionCount - 1).map(
          (o) => o.kana
        )
      );
      break;
    default:
      return [];
  }
  result.push((oto as { [key: string]: string })[blankType]);
  return result;
}

export function stringifyDuration(duration: number) {
  let result = "";
  duration /= 1000;
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  if (minutes > 0) {
    result += minutes + "m";
  }
  result += seconds + "s";
  return result;
}
