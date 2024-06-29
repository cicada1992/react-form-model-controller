import DecoratorUtils, { ClassConstructor } from './utils';

// TODO: find type inference method
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Serializer<TResult = object> = (v: any) => Partial<TResult>;

export function Serialize<TResult = object>(serializer: Serializer<TResult>) {
  const callback = (target: ClassConstructor, propertyKey: string) => {
    const metadata = DecoratorUtils.getOrCreateClassMetadata(target, SerializeMetadata);
    metadata.setSerializer(propertyKey, serializer);
  };

  return (target: { constructor: ClassConstructor }, propertyKey: string) => {
    callback(target.constructor, propertyKey);
  };
}

export class SerializeMetadata {
  private map = new Map<string, Serializer>();

  constructor() {
    this.getSerializer = this.getSerializer.bind(this);
    this.setSerializer = this.setSerializer.bind(this);
  }

  getSerializer(fieldName: string): Serializer | null {
    return this.map.get(fieldName) || null;
  }

  setSerializer(fieldName: string, serializer: Serializer) {
    this.map.set(fieldName, serializer);
  }
}
