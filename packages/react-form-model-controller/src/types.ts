/* eslint-disable @typescript-eslint/no-explicit-any */

import { StoreApi, UseBoundStore } from 'zustand';
import { BaseFormController } from './controller';

// DECORATOR UTILS
// eslint-disable-next-line @typescript-eslint/ban-types
export type ClassConstructor = Function;
export type GlobalMap = Map<ClassConstructor, MetadataMap>;
export type MetadataMap<T = any> = Map<ClassConstructor, T>;

// FORMS
export type FieldError = string | null | undefined;
export type FieldErrors<TFormModel> = Record<keyof TFormModel, FieldError>;
export type FieldValidator<TFormModel, TKey extends keyof TFormModel> = (
  value: TFormModel[TKey],
  values: TFormModel,
) => FieldError;
export type FieldValidators<TFormModel, TKey extends keyof TFormModel> = {
  [p in TKey]?: FieldValidator<TFormModel, TKey>;
};
export type ControllerOptions = Partial<{
  replace: boolean;
  preventValidation: boolean;
}>;

// STORE
export interface BaseFormState<TFormModel> {
  values: TFormModel;
  errors: Partial<Record<keyof TFormModel, FieldError>>;
}

type PrimitiveType = string | number | symbol | boolean | null | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
type LeafType = Function | any[] | PrimitiveType;

type Dot<T extends string, U extends string> = '' extends U ? T : `${T}.${U}`;
type PathsToFields<T, StopTypes = LeafType> = T extends LeafType
  ? ''
  : {
    [K in Extract<keyof T, string>]: Dot<K, PathsToFields<T[K], StopTypes>>;
  }[Extract<keyof T, string>];
type GetPropertyType<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer Property}.${infer SubField}`
  ? Property extends keyof T
  ? GetPropertyType<NonNullable<T[Property]>, SubField>
  : never
  : never;

// FIELD COMPONENMT
export interface FieldHanlders<TFormModel, TValue> {
  fieldHandler: (value: TValue | unknown) => void; // a value argument can be synthetic change event or like that. so i handle this util function in implementation.
  getFieldHandler: <TKey extends keyof TFormModel>(key: TKey) => (value: TFormModel[TKey] | unknown) => void; // a value argument can be synthetic change event or like that. so i handle this util function in implementation.
  getComplexFieldHandler: <T extends TFormModel, P extends PathsToFields<T>, V extends GetPropertyType<T, P>>(
    path: P,
  ) => (value: V) => void;
}

export interface FieldRenderProps<TFormModel, TValue> extends FieldHanlders<TFormModel, TValue> {
  value: TValue;
  values: Partial<TFormModel>;
  error: FieldError;
  errors: Partial<FieldErrors<TFormModel>>;
}

export type FieldRenderFunc<TFormModel, TKey extends keyof TFormModel> = (
  props: FieldRenderProps<TFormModel, TFormModel[TKey]>,
) => React.ReactNode;

export interface FieldProps<TFormModel, TKey extends keyof TFormModel> {
  name: TKey;
  validator?: FieldValidator<TFormModel, TKey>;
  validateOnMount?: boolean;
  refValues?: Array<keyof TFormModel>; // TODO
  children: FieldRenderFunc<TFormModel, TKey>;
}

// HOOK CREATOR
export type FieldHook<TFormModel> = <TKey extends keyof TFormModel>(
  props: FieldProps<TFormModel, TKey>,
) => React.ReactNode | React.ReactNode[];

export interface FormHookCreatorCtx<TFormModel> {
  FormModel: new () => TFormModel;
  FormController: new (
    model: new () => TFormModel,
    store: UseBoundStore<StoreApi<BaseFormState<TFormModel>>>,
  ) => BaseFormController<TFormModel>;
}

// MAPPER DECORATOR
// TODO: find type inference method
export type Reader<TDataResponse = any, TFormModel = object> = (v: TDataResponse) => Partial<TFormModel>;
export type Writer<TValue = any, TResult = object> = (v: TValue) => Partial<TResult>;
