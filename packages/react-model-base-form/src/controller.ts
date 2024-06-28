import { StoreApi, UseBoundStore } from 'zustand';

import DecoratorUtils from './decorator/decorators';
import { SerializeMetadata } from './decorator/serialize';
import { BaseFormState } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseFormController<TFormModel, TWriteResult = Record<string, any>> {
  model: TFormModel;
  private snapshots: TFormModel[];

  constructor(
    private ModelClass: new () => TFormModel,
    private storeCreator: UseBoundStore<StoreApi<BaseFormState<TFormModel>>>,
  ) {
    this.model = new ModelClass();
    this.snapshots = [];

    this.setValue = this.setValue.bind(this);
    this.setValues = this.setValues.bind(this);
    this.undo = this.undo.bind(this);
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  /** public store interface */
  get store() {
    return this.storeCreator();
  }

  setValue(key: keyof TFormModel, value: TFormModel[keyof TFormModel]) {
    const snapshot = this.takeModelSnapshot();
    this.snapshots.push(snapshot);
    this.model[key] = value;
    this.storeCreator.setState((state) => ({ values: { ...state.values, [key]: value } }));
  }

  setValues(newValues: TFormModel) {
    Object.keys(newValues as object).forEach((key) => {
      const assertedKey = key as keyof TFormModel;
      this.model[assertedKey] = newValues[assertedKey];
    });
    this.storeCreator.setState((state) => ({ values: { ...state.values, ...newValues } }));
  }

  undo() {
    const target = this.snapshots.pop();
    if (!target) return;
    this.setValues(target);
  }

  /** from server */
  read() {
    console.log('read!');
  }

  /** to server */
  write(): TWriteResult {
    let result = {} as TWriteResult;
    const serializeMetadata = DecoratorUtils.getOrCreateClassMetadata(this.ModelClass, SerializeMetadata);
    const fieldNames = Object.getOwnPropertyNames(this.model) as Array<keyof TFormModel>;
    fieldNames.forEach((fieldName) => {
      if (typeof fieldName !== 'string') return;
      const serializer = serializeMetadata.getSerializer(fieldName);
      const value = this.model[fieldName as keyof TFormModel];

      // TODO: apply deep merge
      if (serializer) result = { ...result, ...serializer(value) };
    });

    return result;
  }

  private takeModelSnapshot() {
    return JSON.parse(JSON.stringify(this.model));
  }
}
