import {MemorySize, MemorySizeEnum} from 'datalib/entity/memorySize.enum';

const memorySizeFactor: (sizeUnit: MemorySizeEnum) => number = (sizeUnit: MemorySizeEnum) => {
  let memoryPowerFactor = 0;
  if (sizeUnit) {
    switch (sizeUnit) {
      case 'B':
        memoryPowerFactor = 0;
        break;
      case 'KB':
        memoryPowerFactor = 1;
        break;
      case 'MB':
        memoryPowerFactor = 2;
        break;
      case 'GB':
        memoryPowerFactor = 3;
        break;
      case 'TB':
        memoryPowerFactor = 4;
        break;
      default:
        memoryPowerFactor = 0;
        break;
    }
  }
  return 1024 ** memoryPowerFactor;
};

export const addMemoriesAndReturnInByte: (memories: MemorySize[]) => number = (
  memories: MemorySize[],
) => memories.map((memory) => convertInByte(memory)).reduce((acc, curr) => acc + curr, 0);

export const convertInByte: (aMemorySize: MemorySize) => number = (aMemorySize) =>
  (aMemorySize.size ?? 0) * memorySizeFactor(aMemorySize.sizeUnit ?? MemorySizeEnum.B);

const isGreaterThan: (aMemorySize: MemorySize, bMemorySize: MemorySize) => boolean = (
  aMemorySize: MemorySize,
  bMemorySize: MemorySize,
) => {
  const aMemorySizeInByte = convertInByte(aMemorySize);
  const bMemorySizeInByte = convertInByte(bMemorySize);
  return aMemorySizeInByte > bMemorySizeInByte;
};

export default {addMemoriesAndReturnInByte, convertInByte, isGreaterThan};
