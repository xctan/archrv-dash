import { Package, DetailedMark, MelonStatus } from "./types"

export const fetchData = async (url: string): Promise<Package[]> => {
  console.time("fetch data")
  const foo = await fetch("https://archrv-status.xctan.workers.dev/raw");
  const data = await foo.json();
  console.timeEnd("fetch data")
  const dataset: {[key: string]: Package} = {};
  
  // data from felix is an html document
  console.time("parse felix")
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
      // felix = "dep";
      // marks.push({
      //   name: "missing-dep",
      //   by: "null (felix)",
      //   comment: dep_match[1],
      // })
      continue;
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
  console.timeEnd("parse felix")

  // transform data from melon
  console.time("parse melon")
  const melon: MelonStatus = JSON.parse(data.source.MelonBot);
  for (const user of melon.workList) {
    for (const pkg of user.packages) {
      if (dataset[pkg]) {
        dataset[pkg].user = user.alias;
      } else {
        // possibly a joke package
        dataset[pkg] = {
          name: pkg,
          felix: "nx",
          user: user.alias,
          work: {
            kind: null,
            pr: null,
          },
          marks: ['non-existent?'],
        }
      }
    }
  }
  for (const pkg of melon.markList) {
    if (!dataset[pkg.name]) {
      dataset[pkg.name] = {
        name: pkg.name,
        felix: "nx",
        user: null,
        work: {
          kind: null,
          pr: null,
        },
        marks: [],
      }
    }
    for (const mark of pkg.marks) {
      dataset[pkg.name].marks.push({
        name: mark.name,
        by: mark.by.alias,
        comment: mark.comment,
      })
    }
  }
  console.timeEnd("parse melon")
  
  return Object.values(dataset);
}