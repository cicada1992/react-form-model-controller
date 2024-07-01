import { BaseFormController } from './controller';
import { extractValueFrom } from './utils';
import memoizeOne from 'memoize-one';
import setWith from 'lodash.setwith';
import clone from 'lodash.clone';
import { FieldErrors, FieldHanlders, FieldProps, FieldValidator } from './types';
import { useEffect, useRef } from 'react';
import pick from 'lodash.pick';
import isEqual from 'lodash.isequal';

export const createFieldComponent = memoizeOne(
  <TFormController extends BaseFormController<TFormController['model']>, TKey extends keyof TFormController['model']>(
    controller: TFormController,
  ): ((props: FieldProps<TFormController['model'], TKey>) => React.ReactNode | React.ReactNode[]) => {
    const mapOfCachedValues: { [P in TKey]?: Partial<TFormController['model']> } = {};
    const mapOfCachedErrors: { [P in TKey]?: Partial<FieldErrors<TFormController['model']>> } = {};

    return ({ name: key, refValues, validator, validateOnMount, children }) => {
      const isValidatorRegistered = useRef<boolean>();
      const store = controller.useTargetStore(key, refValues);

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
        }
        controller.unregisterFieldValidator(key);
      };

      const newValues = refValues ? pick(store.values, refValues) : {};
      const cachedValues = mapOfCachedValues[key];
      const values = isEqual(cachedValues, newValues) ? cachedValues : newValues;
      mapOfCachedValues[key] = values;

      const newErrors = refValues ? pick(store.errors, refValues) : {};
      const cachedErrors = mapOfCachedErrors[key];
      const errors = isEqual(cachedErrors, newErrors) ? cachedErrors : newErrors;
      mapOfCachedErrors[key] = errors;

      return children({
        value: store.value,
        error: store.error,
        values: mapOfCachedValues[key] || {},
        errors: mapOfCachedErrors[key] || {},
        ...getFieldHandlers(controller, key, values),
      });
    };
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
    getComplexFieldHandler: (path) => (value) => {
      const nextValues = setWith(clone(values as object), path, value, clone);
      controller.setValues(nextValues);
    },
  };
};
