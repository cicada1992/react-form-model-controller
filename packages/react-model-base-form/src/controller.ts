import { StoreApi, UseBoundStore } from 'zustand';

import DecoratorUtils from './decorator/utils';
import { SerializeMetadata } from './decorator/serialize';
import { BaseFormState } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseFormController<TFormModel, TWriteResult = Record<string, any>> {
  private snapshots: TFormModel[];

  constructor(
    private ModelClass: new () => TFormModel,
    private storeCreator: UseBoundStore<StoreApi<BaseFormState<TFormModel>>>,
  ) {
    this.snapshots = [];

    this.setValue = this.setValue.bind(this);
    this.setValues = this.setValues.bind(this);
    this.undo = this.undo.bind(this);
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  /** hook interface for being used in component */
  useStore(): BaseFormState<TFormModel> {
    return this.storeCreator();
  }

  /** get data interface for everywhere */
  get model(): TFormModel {
    return this.storeCreator.getState().values;
  }

  setValue<TKey extends keyof TFormModel>(key: TKey, value: TFormModel[TKey]) {
    const snapshot = this.takeModelSnapshot();
    this.snapshots.push(snapshot);
    this.storeCreator.setState((state) => ({ values: { ...state.values, [key]: value } }));
  }

  setValues(newValues: TFormModel) {
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
