import { BaseFormController, formHookCreator, Mapper } from 'react-meta-form';

export interface ReadResponse {
  name: string;
  age: number;
  cities: string;
}

interface WriteResult {
  name: string;
  age: number;
  cities: string;
}

class FormOneModel {
  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ name: data.name }))
  @Mapper.Write<FormOneModel['name'], WriteResult>((v) => ({ name: `serialized!=${v}` }))
  name: string = '';

  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ age: String(data.age) }))
  @Mapper.Write<FormOneModel['age'], WriteResult>((v) => ({ age: Number(v) }))
  age: string = '';

  @Mapper.Read<ReadResponse, FormOneModel>((data) => ({ cities: data.cities.split(',') }))
  @Mapper.Write<FormOneModel['cities'], WriteResult>((v) => ({ cities: v.join(',') }))
  cities: string[] = [];
}

class FormOneController extends BaseFormController<FormOneModel, WriteResult> { }

export const useFormOne = formHookCreator({
  FormModel: FormOneModel,
  FormController: FormOneController,
});
