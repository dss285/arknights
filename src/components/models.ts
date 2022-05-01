export class Matrix {
  stageId: string;
  itemId: string;
  times: number;
  quantity: number;
  start: number;
  end?: number;
}
export class Item {
  id: string;
  name: string;
  description: string;
  rarity: number;
  icon_id: string;
  usage: string;
}
export class Formula {
  id: string;
  item_id: string;
  count: number;
  costs: string;
  room: string;
}
export class Stage {
  id: string;
  code: string;
  name: string;
  description: string;
  sanity_cost: number;
}
