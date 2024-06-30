import isEqual from 'lodash.isequal';
import { BaseFormController } from './controller';
import { extractValueFrom } from './utils';
import memoizeOne from 'memoize-one';
import setWith from 'lodash.setwith';
import clone from 'lodash.clone';
import { FieldHanlders, FieldProps } from './types';

export const createFieldComponent = memoizeOne(
  <TFormController extends BaseFormController<TFormController['model']>, TKey extends keyof TFormController['model']>(
    controller: TFormController,
  ): ((props: FieldProps<TFormController['model'], TKey>) => React.ReactNode | React.ReactNode[]) => {
    {
      const mapOfCachedValue: Partial<Record<TKey, TFormController['model'][TKey]>> = {};
      const mapOfNodeCache: Partial<Record<TKey, React.ReactNode>> = {};

      return ({ name: key, children }) => {
        const store = controller.useStore();
        const value = store.values[key];

        if (!isEqual(mapOfCachedValue[key], value) || !mapOfNodeCache[key]) {
          const node = children({
            value,
            values: store.values,
            error: '',
            ...getFieldHandlers(controller, key, store.values),
          });

          mapOfCachedValue[key] = value;
          mapOfNodeCache[key] = node;
          return node;
        }

        return mapOfNodeCache[key];
      };
    }
  },
);

const getFieldHandlers = <
  TFormController extends BaseFormController<TFormController['model']>,
  TKey extends keyof TFormController['model'],
>(
  controller: TFormController,
  key: TKey,
  values: TFormController['model'],
): FieldHanlders<TFormController['model'], TFormController['model'][TKey]> => {
  return {
    fieldHandler: (value) => controller.setValue(key, extractValueFrom(value)),
    getFieldHandler:
      <TKey extends keyof TFormController['model']>(input: TKey) =>
        (value) =>
          controller.setValue(input, extractValueFrom(value)),
    getComplexFieldHandler: (path: string) => (value: unknown) => {
      const nextValues = setWith(clone(values as object), path, value, clone);
      controller.setValues(nextValues);
    },
  };
};
