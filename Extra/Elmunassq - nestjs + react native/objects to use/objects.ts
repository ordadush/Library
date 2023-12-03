export interface Group {
    id: number;
    name: string;
    type: Code;
    inclusiveGroupId?: number;
}

export interface Soldier {
    id: number;
    soldierId: number;
    name: string;
    rank: Code;
    role: Code;
    recruitmentDate: Date;
    phone: string;
    email: string;
    gender: Code;
    birthday: Date;
    address: string;
    inclusiveGroupId: number;
}

export interface Code {
    id: number;
    value: string;
}
