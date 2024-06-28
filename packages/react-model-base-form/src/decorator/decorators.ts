/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ClassConstructor = Function;
export type GlobalMap = Map<ClassConstructor, MetadataMap>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MetadataMap<T = any> = Map<ClassConstructor, T>;

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
