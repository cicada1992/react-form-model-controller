import { StoreApi, UseBoundStore } from 'zustand';

import DecoratorUtils from './decorator/utils';
import { MapperMetadata } from './decorator/mapper';
import { BaseFormState, FieldError, FieldValidator, FieldValidators } from './types';
import deepmerge from 'deepmerge';
import pick from 'lodash.pick';
import isEqual from 'lodash.isequal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseFormController<TFormModel, TWriteResult = any> {
  private readonly snapshots: TFormModel[] = [];
  private readonly fieldValidators: FieldValidators<TFormModel, keyof TFormModel> = {};

  constructor(
    private ModelClass: new () => TFormModel,
    private storeCreator: UseBoundStore<StoreApi<BaseFormState<TFormModel>>>,
  ) {
    // FORMS
    this.setValue = this.setValue.bind(this);
    this.setValues = this.setValues.bind(this);
    this.validate = this.validate.bind(this);
    this.validateAll = this.validateAll.bind(this);
    this.undo = this.undo.bind(this);
    this.reset = this.reset.bind(this);

    // HELPER
    this.registerFieldValidator = this.registerFieldValidator.bind(this);
    this.unregisterFieldValidator = this.unregisterFieldValidator.bind(this);

    // API
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  /** hook interface for being used in field-component (using selector for render-optimization) */
  useTargetStore<TKey extends keyof TFormModel>(key: TKey, refValues: Array<keyof TFormModel> = []) {
    return this.storeCreator(
      (state) => ({
        value: state.values[key],
        error: state.errors[key],
        values: pick(state.values, refValues),
        errors: pick(state.errors, refValues),
      }),
      isEqual,
    );
  }

  /** get data interface for everywhere */
  get model(): TFormModel {
    return this.storeCreator.getState().values;
  }

  setValue<TKey extends keyof TFormModel>(key: TKey, value: TFormModel[TKey]) {
    const snapshot = this.takeModelSnapshot();
    this.snapshots.push(snapshot);
    this.storeCreator.setState((state) => ({ values: { ...state.values, [key]: value } }));
    this.validate(key);
  }

  setValues(newValues: TFormModel) {
    this.storeCreator.setState((state) => ({ values: { ...state.values, ...newValues } }));
    const fieldNames = this.getFieldKeys();
    fieldNames.forEach(this.validate);
  }

  validate<TKey extends keyof TFormModel>(key: TKey): void {
    const validator = this.fieldValidators[key];
    const error = validator?.(this.model[key], this.model);
    this.storeCreator.setState((state) => ({ errors: { ...state.errors, [key]: error } }));
  }

  /** @returns {boolean} 에러 보유여부 */
  validateAll(): boolean {
    const keys = this.getFieldKeys();
    const nextErrors = keys.reduce(
      (acc, key) => ({ ...acc, [key]: this.fieldValidators[key]?.(this.model[key], this.model) }),
      {} as Partial<Record<keyof TFormModel, FieldError>>,
    );
    this.storeCreator.setState(() => ({ errors: nextErrors }));
    return Object.values(nextErrors).some(Boolean);
  }

  undo() {
    const target = this.snapshots.pop();
    if (!target) return;
    this.setValues(target);
  }

  reset() {
    const initialState = this.storeCreator.getInitialState();
    console.log({ initialState, aa: { ...initialState } });
    this.storeCreator.setState(() => initialState);
  }

  /** from server */
  read<TDataResponse>(data: TDataResponse extends object ? TDataResponse : never): void {
    let result = JSON.parse(JSON.stringify(this.model)) as TFormModel;
    const serializeMetadata = DecoratorUtils.getOrCreateClassMetadata(this.ModelClass, MapperMetadata);
    const fieldNames = this.getFieldKeys();
    fieldNames.forEach((fieldName) => {
      if (typeof fieldName !== 'string') return;
      const reader = serializeMetadata.getReader(fieldName);
      if (reader) result = { ...result, ...reader(data) };
    });

    this.setValues(result);
  }

  /** to server */
  write(): TWriteResult {
    let result = {} as TWriteResult;
    const serializeMetadata = DecoratorUtils.getOrCreateClassMetadata(this.ModelClass, MapperMetadata);
    const fieldNames = this.getFieldKeys();
    fieldNames.forEach((fieldName) => {
      if (typeof fieldName !== 'string') return;
      const writer = serializeMetadata.getWriter(fieldName);
      const value = this.model[fieldName as keyof TFormModel];

      if (writer) result = deepmerge(result, writer(value));
    });

    return result;
  }

  registerFieldValidator<TKey extends keyof TFormModel>(
    key: TKey,
    validator: FieldValidator<TFormModel, TKey>,
  ): boolean {
    const fieldValidator = this.fieldValidators[key];
    if (fieldValidator) {
      console.warn('Failed to register field validator, already have registered one');
      return false;
    }
    this.fieldValidators[key] = validator as FieldValidator<TFormModel, keyof TFormModel>;
    return true;
  }

  unregisterFieldValidator<TKey extends keyof TFormModel>(fieldName: TKey): boolean {
    const registered = this.fieldValidators[fieldName];
    if (registered) {
      delete this.fieldValidators[fieldName];
      return true;
    }
    return false;
  }

  private getFieldKeys<TKey extends keyof TFormModel>(): TKey[] {
    return Object.getOwnPropertyNames(this.model) as TKey[];
  }

  private takeModelSnapshot() {
    return JSON.parse(JSON.stringify(this.model));
  }
}
