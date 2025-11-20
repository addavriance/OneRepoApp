export function setFlag(flags: number, flag: number, enable?: boolean): number {
    const has = hasFlag(flags, flag);
    if (enable !== undefined && enable || !has) {
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
