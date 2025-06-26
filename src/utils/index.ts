import {
  DAKUON_LIST,
  HIRA_TO_OTO,
  HIRA_TO_OTO_TYPE,
  OtoType,
  SEION_LIST,
  YOUON_LIST,
  type Oto,
} from "./kanas";

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
  const config = useMyConfigStore();
  return (
    (type === OtoType.seion && config.enableSeion) ||
    (type === OtoType.dakuon && config.enableDakuon) ||
    (type === OtoType.youon && config.enableYouon)
  );
}

function getFullList() {
  const config = useMyConfigStore();
  let list: Oto[] = [];
  if (config.enableSeion) {
    list = list.concat(SEION_LIST);
  }
  if (config.enableDakuon) {
    list = list.concat(DAKUON_LIST);
  }
  if (config.enableYouon) {
    list = list.concat(YOUON_LIST);
  }
  return list;
}

function getWeightedList() {
  const config = useMyConfigStore();
  let result = getFullList();
  Object.keys(config.weights).forEach((k) => {
    let weight = config.weights[k];
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
  const config = useMyConfigStore();
  const types = [];
  if (config.blankHira) {
    types.push("hira");
  }
  if (config.blankKana) {
    types.push("kana");
  }
  // if (config.enableRomaji && config.blankRomaji) {
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

function selectRandomly<T>(array: T[], count: number): T[] {
  const result: T[] = [];
  while (count-- > 0) {
    let index = Math.floor(Math.random() * array.length);
    result.push(array[index]);
    array.splice(index, 1);
  }
  return result;
}

function insertRandomly(element: any, array: any[]) {
  const randomIndex = Math.floor(Math.random() * (array.length + 1));
  array.splice(randomIndex, 0, element);
}

export function generateOptions(oto: Oto, blankType: string): string[] {
  const config = useMyConfigStore();
  const otoType = HIRA_TO_OTO_TYPE[oto.hira];
  const list = [...OTO_TYPE_TO_LIST[otoType]];
  list.splice(
    list.findIndex((o) => o.hira === oto.hira),
    1
  );
  const result: string[] = [];
  switch (blankType) {
    case "hira":
      result.push(
        ...selectRandomly(list, config.optionCount - 1).map((o) => o.hira)
      );
      break;
    case "kana":
      result.push(
        ...selectRandomly(list, config.optionCount - 1).map((o) => o.kana)
      );
      break;
    default:
      return [];
  }
  insertRandomly((oto as { [key: string]: string })[blankType], result);
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
