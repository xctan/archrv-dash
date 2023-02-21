import { Package } from "./types"

export const fetchData = (url: string): Promise<Package[]> => {
    // fake data
    return new Promise((resolve, reject) => {
        resolve([
            {
              name: "glib2",
              felix: "dir",
              user: null,
              work: {
                kind: null,
                pr: null,
              },
              mark: [
                "triage-check-failed",
                "patched"
              ]
            },
            {
              name: "guile",
              felix: "dir",
              user: "shimarin",
              work: {
                kind: "add",
                pr: null,
              },
              mark: [
                "triage-check-failed",
                {
                  name: "failing",
                  comment: "2023/1/27 19:17:05 (UTC+8)",
                  by: "null (bot)"
                },
                {
                  name: "upstreamed",
                  comment: "https://debbugs.gnu.org/cgi/bugreport.cgi?bug=50730",
                  by: "shimarin"
                }
              ]
            }
        ])
    })
}