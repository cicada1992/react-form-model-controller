import { ClassConstructor, Reader, Writer } from '../types';
import DecoratorUtils from './utils';

const MapperReader = <TDataResponse, TFormModel>(reader: Reader<TDataResponse, TFormModel>) => {
  const callback = (target: ClassConstructor, propertyKey: string) => {
    const metadata = DecoratorUtils.getOrCreateClassMetadata(target, MapperMetadata);
    metadata.setReader(propertyKey, reader);
  };

  return (target: { constructor: ClassConstructor }, propertyKey: string) => {
    callback(target.constructor, propertyKey);
  };
};

const MapperWriter = <TValue, TResult>(writer: Writer<TValue, TResult>) => {
  const callback = (target: ClassConstructor, propertyKey: string) => {
    const metadata = DecoratorUtils.getOrCreateClassMetadata(target, MapperMetadata);
    metadata.setWriter(propertyKey, writer);
  };

  return (target: { constructor: ClassConstructor }, propertyKey: string) => {
    callback(target.constructor, propertyKey);
  };
};

export class MapperMetadata {
  private readerMap = new Map<string, Reader>();
  private writerMap = new Map<string, Writer>();

  constructor() {
    this.getReader = this.getReader.bind(this);
    this.setReader = this.setReader.bind(this);
    this.getWriter = this.getWriter.bind(this);
    this.setWriter = this.setWriter.bind(this);
  }

  getReader(fieldName: string): Reader | null {
    return this.readerMap.get(fieldName) || null;
  }

  setReader(fieldName: string, reader: Reader) {
    this.readerMap.set(fieldName, reader);
  }

  getWriter(fieldName: string): Writer | null {
    return this.writerMap.get(fieldName) || null;
  }

  setWriter(fieldName: string, writer: Writer) {
    this.writerMap.set(fieldName, writer);
  }
}

export const Mapper = { Read: MapperReader, Write: MapperWriter };
