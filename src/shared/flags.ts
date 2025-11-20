export function setFlag(flags: number, flag: number, enable: boolean): number {
    if (enable) {
        return flags | flag;
    } else {
        return flags & ~flag;
    }
}


export function hasFlag(flags: number, flag: number): boolean {
    return (flags & flag) === flag;
}

export enum SortType {
    CreatedDate = 1 << 0,
    UpdatedDate = 1 << 1,
}
