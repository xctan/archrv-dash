export interface DetailedMark {
    name: string;
    comment: string;
    by: string;
}
  
export interface Package {
    name: string;
    felix: "dir" | "leaf" | "dep";
    user: string | null;
    work: {
        kind: "pr" | "prdel" | "add" | null;
        pr: string | null;
    },
    marks: (DetailedMark | string)[];
}