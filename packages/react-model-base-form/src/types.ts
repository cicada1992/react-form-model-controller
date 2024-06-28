// export type FormValue<TFormModel> = Record<keyof TFormModel, TFormModel[keyof TFormModel]>;
export type FormError = string | null | undefined;

export interface BaseFormState<TFormModel> {
  values: TFormModel;
  errors: Partial<Record<keyof TFormModel, FormError>>;
}
