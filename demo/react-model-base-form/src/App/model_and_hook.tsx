import { BaseFormController, formHookCreator, Mapper } from 'react-model-base-form';

export interface ReadResponse {
  name: string;
  types: string;
}

interface WriteResult {
  name: string;
  types: string;
  hasType: boolean;
}

class FormOneModel {
  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ name: data.name }))
  @Mapper.Write<FormOneModel['name'], WriteResult>((v) => ({ name: `serialized!=${v}` }))
  name: string = '';

  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ type: data.types.split(',') }))
  @Mapper.Write<FormOneModel['type'], WriteResult>((v) => ({ types: v.join(',') }))
  type: string[] = [];

  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ hasType: Boolean(data.types.split(',').length) }))
  hasType: boolean = false;
}

class FormOneController extends BaseFormController<FormOneModel, WriteResult> {}

export const useFormOne = formHookCreator({
  FormModel: FormOneModel,
  FormController: FormOneController,
});
