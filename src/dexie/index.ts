import Dexie, { type Table } from "dexie";

interface ItemTable {
  id?: number;
  reference: string;
  type: "clock" | "text" | "image" | "bookmark";
  index: number;
  row: number;
  col: number;
}

interface ImageTable {
  id?: number;
  reference: string;
  image: File;
}

interface BookmarkTable {
  id?: number;
  reference: string;
  link: string;
  text: string;
}

const db = new Dexie("start");
db.version(1).stores({
  items: "++id, reference, type, index, row, col",
  images: "++id, reference",
  bookmark: "++id, reference, link, text",
});

const items: Table<ItemTable> = db.table("items");
const images: Table<ImageTable> = db.table("images");
const bookmark: Table<BookmarkTable> = db.table("bookmark");

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

async function removeItemById(id: string) {
  const item = await items.where({ reference: id }).first();
  await items.where({ reference: id }).delete();

  if (item?.type == "image") {
    await images.where({ reference: id }).delete();
  }
  if (item?.type == "bookmark") {
    await bookmark.where({ reference: id }).delete();
  }
}

async function addImage(item: ImageTable) {
  return await images.add(item);
}

async function imageByRef(ref: string) {
  const record = await images.where({ reference: ref }).first();
  return record ? record.image : null;
}

async function addBookmark(item: BookmarkTable) {
  return await bookmark.add(item);
}

async function bookmarksByRef(ref: string) {
  return await bookmark.where({ reference: ref }).toArray();
}

const dexie = {
  addItem,
  readAllItems,
  updateItemById,
  removeItemById,
  addImage,
  imageByRef,
  addBookmark,
  bookmarksByRef,
};
export default dexie;
