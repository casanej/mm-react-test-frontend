export interface FilterObject {
    filters: Filter[];
}

export interface Filter {
    id: string;
    name: string;
    values: Value[];
    validation: Validation;
}

export interface Value {
    value: string;
    name: string;
}

export interface Validation {
    primitiveType: "STRING" | "INTEGER";
    entityType: "DATE_TIME";
    pattern: string;
    min?: number;
    max?: number;
}