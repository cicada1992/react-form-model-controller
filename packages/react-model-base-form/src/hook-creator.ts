import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createFieldComponent } from './field-component';
import { BaseFormState, FieldHook, FormHookCreatorCtx } from './types';

/**
 * [TODO] find better abstraction for user's right to choose store.
 * current: zustand store
 */
const createFormStore = <TFormModel>(ModelClass: new () => TFormModel) =>
  create<BaseFormState<TFormModel>>()(
    devtools(() => {
      return {
        values: new ModelClass(),
        errors: {},
      };
    }),
  );

export const formHookCreator = <TFormModel>({ FormModel, FormController }: FormHookCreatorCtx<TFormModel>) => {
  const store = createFormStore(FormModel);
  const controller = new FormController(FormModel, store);
  return () => ({
    Field: createFieldComponent(controller) as unknown as FieldHook<TFormModel>,
    controller,
  });
};
