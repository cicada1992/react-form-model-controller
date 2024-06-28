import { BaseFormController, formHookCreator, Serialize } from 'react-model-base-form';

interface WriteResultOne {
  type1: string;
  amount2: number;
  here: boolean;
}

/** --------------------------------------------------- ONE ----------------------------------------------------- */

class FormOneModel {
  @Serialize<WriteResultOne>((v: string) => ({ type1: `serialized=${v}` }))
  name: string = '';
  @Serialize<WriteResultOne>((v: string) => ({ amount2: Number(v), here: false }))
  type: string[] = [];
}

class FormOneController extends BaseFormController<FormOneModel, WriteResultOne> {}

export const useFormOne = formHookCreator({
  FormModel: FormOneModel,
  FormController: FormOneController,
});
