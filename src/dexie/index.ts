import Dexie, { type Table } from "dexie";

interface ItemTable {
  id?: number;
  reference: string;
  type: "clock";
  index: number;
  row: number;
  col: number;
}

const db = new Dexie("start");
db.version(1).stores({
  items: "++id, reference, type, index, row, col",
});

const items: Table<ItemTable> = db.table("items");

async function addItem(item: ItemTable) {
  return await items.add(item);
}

async function readAllItems() {
  return await items.orderBy("index").toArray();
}

async function updateItemById(
  id: string,
  index: number,
  { col, row }: { col: number; row: number },
) {
  return await items.where({ reference: id }).modify({ col, row, index });
}

const dexie = { addItem, readAllItems, updateItemById };
export default dexie;
