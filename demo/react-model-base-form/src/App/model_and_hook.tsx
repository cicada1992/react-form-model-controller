import { BaseFormController, formHookCreator, Serialize } from 'react-model-base-form';

interface WriteResult {
  type1: string;
  amount2: number;
  here: boolean;
}

/** --------------------------------------------------- ONE ----------------------------------------------------- */

class FormOneModel {
  @Serialize<WriteResult>((v: string) => ({ type1: `serialized=${v}` }))
  name: string = '';
  @Serialize<WriteResult>((v: string) => ({ amount2: Number(v), here: false }))
  type: string[] = [];
}

class FormOneController extends BaseFormController<FormOneModel, WriteResult> { }

export const useFormOne = formHookCreator({
  FormModel: FormOneModel,
  FormController: FormOneController,
});
