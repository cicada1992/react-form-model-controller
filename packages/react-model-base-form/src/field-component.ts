import isEqual from 'lodash.isequal';
import { BaseFormController } from './controller';
import { extractValueFrom } from './utils';
import memoizeOne from 'memoize-one';

interface FieldRenderProps<TFormModel, TValue> {
  value: TValue;
  values: TFormModel;
  error: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldHanlder: (value: any) => void; // value에 event가 올수도 있기에 any 처리 (extractValueFrom util 함수에서 처리해줌)
}

type FieldRenderFunc<TFormModel, TKey extends keyof TFormModel> = (
  props: FieldRenderProps<TFormModel, TFormModel[TKey]>,
) => React.ReactNode;

export interface FieldExternalProps<TFormModel, TKey extends keyof TFormModel> {
  name: TKey;
  refValues?: Array<keyof TFormModel>;
  children: FieldRenderFunc<TFormModel, TKey>;
}

export const createFieldComponent = memoizeOne(<
  TFormController extends BaseFormController<TFormController['model']>,
  TKey extends keyof TFormController['model'],
>(
  controller: TFormController,
): ((props: FieldExternalProps<TFormController['model'], TKey>) => React.ReactNode | React.ReactNode[]) => {
  {
    const mapOfCachedValue: Partial<Record<TKey, TFormController['model'][TKey]>> = {};
    const mapOfNodeCache: Partial<Record<TKey, React.ReactNode>> = {};

    return ({ name: fieldName, children }) => {
      const store = controller.useStore();
      const value = store.values[fieldName];

      if (!isEqual(mapOfCachedValue[fieldName], value) || !mapOfNodeCache[fieldName]) {
        const fieldHanlder = (value: unknown) => {
          const extractedValue = extractValueFrom(value) as TFormController['model'][TKey];
          controller.setValue(fieldName, extractedValue);
        };

        const node = children({
          value,
          values: store.values,
          error: '',
          fieldHanlder,
        });

        mapOfCachedValue[fieldName] = value;
        mapOfNodeCache[fieldName] = node;
        return node;
      }

      return mapOfNodeCache[fieldName];
    };
  }
});
