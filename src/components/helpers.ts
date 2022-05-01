export function killChildren(ele: Element) {
  while (ele.firstChild) {
    ele.firstChild.remove();
  }
}
export function sortChildren(
  ele: Element | null,
  sortFunction: (a: ChildNode, b: ChildNode) => number
) {
  if (ele == null) return;

  const eles = ele.childNodes;
  const tmp: ChildNode[] = [];
  for (const i in eles) {
    if (eles[i].nodeType == 1) {
      tmp.push(eles[i]);
    }
  }
  killChildren(ele);
  tmp.sort(sortFunction);
  for (const x of tmp) {
    ele.appendChild(x);
  }
}
export function sortingFunction(a: { value: string }, b: { value: string }) {
  return parseFloat(a.value) - parseFloat(b.value);
}
