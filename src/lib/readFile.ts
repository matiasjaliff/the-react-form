import type { DataState } from "./../app/modules/formSlice";

export default async function readFile(dataObject: DataState) {
  if (dataObject.document.url && dataObject.document.name) {
    const file = await (await fetch(dataObject.document.url)).blob();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise((resolve) => (reader.onloadend = resolve));
    dataObject.document.data = (reader.result as string).split(",")[1];
  }
}
