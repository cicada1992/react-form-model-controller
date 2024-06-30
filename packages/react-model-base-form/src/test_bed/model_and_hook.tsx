import { BaseFormController } from '../controller';
import { Mapper } from '../decorator/mapper';
import { formHookCreator } from '../hook-creator';

export interface ReadResponse {
  name: string;
  types: string;
  hobby: string;
}

interface WriteResult {
  name: string;
  hobby: string;
}

class FormOneModel {
  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ name: data.name }))
  @Mapper.Write<FormOneModel['name'], WriteResult>((v) => ({ name: `name=${v}` }))
  name: string = '';

  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ hobby: data.hobby }))
  @Mapper.Write<FormOneModel['hobby'], WriteResult>((v) => ({ hobby: `hobby=${v}` }))
  hobby: string = '';
}

class FormOneController extends BaseFormController<FormOneModel, WriteResult> { }

export const useFormOne = formHookCreator({
  FormModel: FormOneModel,
  FormController: FormOneController,
});
