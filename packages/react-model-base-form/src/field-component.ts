import isEqual from 'lodash.isequal';
import { BaseFormController } from './controller';
import { extractValueFrom } from './utils';
import memoizeOne from 'memoize-one';
import setWith from 'lodash.setwith';
import clone from 'lodash.clone';
import { FieldHanlders, FieldProps, FieldValidator } from './types';
import { useEffect, useRef } from 'react';

export const createFieldComponent = memoizeOne(
  <TFormController extends BaseFormController<TFormController['model']>, TKey extends keyof TFormController['model']>(
    controller: TFormController,
  ): ((props: FieldProps<TFormController['model'], TKey>) => React.ReactNode | React.ReactNode[]) => {
    {
      const mapOfCachedValue: Partial<Record<TKey, TFormController['model'][TKey]>> = {};
      const mapOfNodeCache: Partial<Record<TKey, React.ReactNode>> = {};

      return ({ name: key, validator, validateOnMount, children }) => {
        const isValidatorRegistered = useRef<boolean>();
        const store = controller.useStore();
        const value = store.values[key];
        const values = store.values;


        useEffect(() => {
          if (!validator) return;
          registerValidator(validator);
          if (validateOnMount) controller.validate(key);
          () => registerValidator(null);
        }, []);

        const registerValidator = (validator: FieldValidator<TFormController['model'], TKey> | null) => {
          if (validator) {
            if (isValidatorRegistered.current) return;
            controller.registerFieldValidator(key, validator);
            isValidatorRegistered.current = true;
            return;
          };
          controller.unregisterFieldValidator(key);
        };

        if (!isEqual(mapOfCachedValue[key], value) || !mapOfNodeCache[key]) {
          const node = children({
            value,
            values,
            error: store.errors[key],
            ...getFieldHandlers(controller, key, values),
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
