import { ClassConstructor, GlobalMap } from '../types';

/* eslint-disable @typescript-eslint/no-namespace */
namespace DecoratorUtils {
  const globalMetadataMap: GlobalMap = new Map();

  const getOrCreateMetadataMap = (classConstructor: ClassConstructor) => {
    let map = globalMetadataMap.get(classConstructor);
    if (!map) {
      map = new Map();
      globalMetadataMap.set(classConstructor, map);
    }
    return map;
  };

  export function getOrCreateClassMetadata<T>(classConstructor: ClassConstructor, MetadataClass: new () => T): T {
    const metadataMap = getOrCreateMetadataMap(classConstructor);
    let metadata = metadataMap.get(MetadataClass);
    if (!metadata) {
      metadata = new MetadataClass();
      metadataMap.set(MetadataClass, metadata);
    }
    return metadata;
  }
}

export default DecoratorUtils;
