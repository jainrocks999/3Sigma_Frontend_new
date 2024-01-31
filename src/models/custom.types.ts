export type Nillable<T> = T | null | undefined;

export type Nullable<T> = T | null;

export type Undefinable<T> = T | undefined;

export type NullableProps<T> = {[P in keyof T]: T[P] | null};
