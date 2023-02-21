export interface DetailedMark {
    name: string;
    comment: string;
    by: string;
}
  
export interface Package {
    name: string;
    felix: "dir" | "leaf" | "dep" | "nx";
    user: string | null;
    work: {
        kind: "pr" | "prdel" | "add" | null;
        pr: string | null;
    },
    marks: (DetailedMark | string)[];
}

export interface MelonStatus {
    workList: {
        alias: string,
        packages: string[],
    }[],
    markList: {
        name: string,
        marks: {
            name: string,
            by: { alias: string },
            comment: string,
        }[],
    }[],
}