import { StoreApi, UseBoundStore, create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { BaseFormController } from './controller';
import { createFieldComponent, FieldExternalProps } from './field-component';
import { BaseFormState } from './types';

type FieldHook<TFormModel> = <TKey extends keyof TFormModel>(
  props: FieldExternalProps<TFormModel, TKey>,
) => React.ReactNode | React.ReactNode[];

interface FormHookCreatorCtx<TFormModel> {
  FormModel: new () => TFormModel;
  FormController: new (
    model: new () => TFormModel,
    store: UseBoundStore<StoreApi<BaseFormState<TFormModel>>>,
  ) => BaseFormController<TFormModel>;
}

/**
 * [TODO] find better abstraction
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
