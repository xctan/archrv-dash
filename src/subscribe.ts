import { Package, DetailedMark } from "./types"

export const fetchData = async (url: string): Promise<Package[]> => {
  const foo = await fetch("https://archrv-status.xctan.workers.dev/raw");
  const data = await foo.json();
  const dataset: {[key: string]: Package} = {};
  
  // data from felix is an html document
  const felix_dom = new DOMParser().parseFromString(data.source.FelixStatus, "text/html");
  for (const tr of Array.from(felix_dom.querySelectorAll("tr"))) {
    const name = tr.querySelector("td:nth-child(2)")?.textContent;
    if (!name) continue;

    const re_base = /.* \((.*)\)/;
    const base_match = name.match(re_base);
    const base = base_match ? base_match[1] : null;
    if (base) continue;
    
    let marks: (DetailedMark | string)[] = [];
    const status = tr.querySelector("td:nth-child(3)")?.textContent || '';
    let felix: "dir" | "leaf" | "dep" = "dir";
    const re_leaf = /Leaf package|Changes/;
    if (status.match(re_leaf)) {
      felix = "leaf";
    }
    const re_dep = /Dependency '(.*)' not satisfied\./;
    const dep_match = status.match(re_dep);
    if (dep_match) {
      felix = "dep";
      marks.push({
        name: "missing_dep",
        by: "null (felix)",
        comment: dep_match[1],
      })
    }

    const triage = tr.querySelector('span.badge.bg-danger');
    if (triage) {
      const reason = triage.textContent
        ?.trim()
        .replaceAll(/[()]/g, '')
        .replaceAll(' ', '-')
        .toLowerCase();
      if (reason) {
        marks.push(`triage-${reason}`);
      }
    }

    if (tr.querySelector('span.badge.bg-warning')) {
      marks.push('legacy');
    }

    if (tr.querySelector('span.badge.bg-secondary')) {
      marks.push('patched');
    }
    
    dataset[name] = {
      name,
      felix,
      user: null,
      work: {
        kind: null,
        pr: null,
      },
      marks,
    }
  }
  
  return Object.values(dataset);
}