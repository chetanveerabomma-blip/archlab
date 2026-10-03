/**
 * ArchLab - Pure TypeScript Memory Address Calculation Engine
 * Handles address bus decoding, horizontal/vertical chip expansion,
 * decoder design, binary/hex address range mapping, and reverse mode calculations.
 */

export interface MemoryInputs {
  addressBusWidth: number; // in bits (e.g., 16, 32, 64)
  dataBusWidth: number;    // in bits (e.g., 8, 16, 32, 64)
  addressability: 'byte' | 'word';
  chipLocations: number;   // locations per chip (e.g., 1024 for 1K)
  chipWordWidth: number;   // bits per location in chip (e.g., 8 for 1K x 8)
  startAddressHex?: string;// optional starting base address (e.g., "0x0000")
}

export interface ChipRange {
  chipIndex: number;
  row: number; // vertical bank
  col: number; // horizontal slice
  startAddress: bigint;
  endAddress: bigint;
  startHex: string;
  endHex: string;
  startBin: string;
  endBin: string;
  sizeBytes: number;
}

export interface MemoryCalculationResult {
  addressableLocations: bigint;
  totalCapacityBits: bigint;
  totalCapacityBytes: bigint;
  capacityFormatted: {
    bits: string;
    bytes: string;
    kib: string;
    mib: string;
    gib: string;
    kb: string;
    mb: string;
    gb: string;
  };
  expansion: {
    horizontal: number; // chips to widen word size
    vertical: number;   // chips to deepen address space
    totalChips: number;
  };
  decoder: {
    offsetBits: number;
    decoderBits: number;
    decoderType: string; // e.g. "2-to-4 decoder"
    decoderInputLines: string; // e.g. "A11 - A10"
    chipOffsetLines: string;   // e.g. "A9 - A0"
    unusedBits: number;
  };
  chipRanges: ChipRange[];
  warnings: string[];
  steps: { title: string; formula: string; calculation: string; result: string }[];
}

export interface ReverseMemoryInputs {
  desiredCapacityBytes: number;
  dataBusWidth: number;
  addressability: 'byte' | 'word';
}

export interface ReverseMemoryResult {
  requiredLocations: bigint;
  requiredAddressBits: number;
  actualCapacityBytes: bigint;
  steps: { title: string; formula: string; calculation: string; result: string }[];
}

export function calculateMemory(inputs: MemoryInputs): MemoryCalculationResult {
  const {
    addressBusWidth,
    dataBusWidth,
    addressability,
    chipLocations,
    chipWordWidth,
    startAddressHex = '0x0000',
  } = inputs;

  const warnings: string[] = [];

  // 1. Validation & Safety checks
  if (addressBusWidth <= 0 || addressBusWidth > 64) {
    throw new Error('Address bus width must be between 1 and 64 bits.');
  }
  if (dataBusWidth <= 0) {
    throw new Error('Data bus width must be greater than 0.');
  }
  if (chipLocations <= 0) {
    throw new Error('Chip locations must be greater than 0.');
  }
  if (chipWordWidth <= 0) {
    throw new Error('Chip word width must be greater than 0.');
  }

  const isPowerOfTwo = (n: number) => (n & (n - 1)) === 0 && n > 0;
  if (!isPowerOfTwo(chipLocations)) {
    warnings.push(
      `Chip locations (${chipLocations}) is not a power of 2. Standard binary decoders require power-of-2 subdivisions; partial address mapping will occur.`
    );
  }
  if (dataBusWidth % chipWordWidth !== 0) {
    warnings.push(
      `Word size (${dataBusWidth} bits) is not an exact multiple of chip width (${chipWordWidth} bits). Extra chip capacity will remain unconnected or unused.`
    );
  }

  // 2. Capacity & Addressable Locations
  // Locations = 2^n
  // Use BigInt to prevent 32-bit overflow for widths up to 64
  const addressableLocations = 1n << BigInt(addressBusWidth);

  // Bit capacity = locations * word size (if word addressable) or locations * 8 (if byte addressable)
  // Note: If byte-addressable with e.g. 16-bit data bus, memory contains 2^n bytes, each word spans 2 addresses.
  const bitsPerLocation = addressability === 'byte' ? 8 : dataBusWidth;
  const totalCapacityBits = addressableLocations * BigInt(bitsPerLocation);
  const totalCapacityBytes = totalCapacityBits / 8n;

  // 3. Chip Expansion
  const horizontalChips = Math.ceil(dataBusWidth / chipWordWidth);
  
  // Locations required per vertical slice:
  // Each vertical slice must cover the total addressable locations
  const verticalChips = Math.ceil(Number(addressableLocations) / chipLocations);
  const totalChips = horizontalChips * verticalChips;

  // 4. Decoder Design
  // Chip offset bits = log2(chipLocations)
  const offsetBits = Math.ceil(Math.log2(chipLocations));
  const decoderBits = Math.max(0, addressBusWidth - offsetBits);
  const unusedBits = Math.max(0, addressBusWidth - (offsetBits + Math.ceil(Math.log2(Math.max(1, verticalChips)))));

  if (decoderBits < 0) {
    warnings.push('Chip size exceeds the entire address space of the processor.');
  }

  const decoderType =
    decoderBits > 0
      ? `${decoderBits}-to-${Math.pow(2, decoderBits)} Decoder`
      : 'None (Directly connected / Single chip row)';

  const chipOffsetLines =
    offsetBits > 0 ? `A${offsetBits - 1} .. A0 (${offsetBits} bits)` : 'None';
  
  const decoderInputLines =
    decoderBits > 0
      ? `A${addressBusWidth - 1} .. A${offsetBits} (${decoderBits} bits)`
      : 'None';

  if (verticalChips < Math.pow(2, decoderBits)) {
    warnings.push(
      `Partial Decoding Notice: The decoder has ${Math.pow(2, decoderBits)} possible selects, but only ${verticalChips} banks are populated. Unused select lines create memory aliasing/shadowing if left un-gated.`
    );
  }

  // 5. Hex & Binary Address Ranges per Chip
  let baseAddress = 0n;
  try {
    const cleanHex = startAddressHex.trim().replace(/^0x/i, '');
    if (cleanHex.length > 0) {
      baseAddress = BigInt('0x' + cleanHex);
    }
  } catch {
    baseAddress = 0n;
    warnings.push('Invalid starting address format. Reset to 0x0000.');
  }

  const chipRanges: ChipRange[] = [];
  const hexPadLength = Math.max(4, Math.ceil(addressBusWidth / 4));

  // Generate range for each vertical bank (rows)
  const locationsPerChipBigInt = BigInt(chipLocations);
  for (let row = 0; row < verticalChips; row++) {
    const startAddr = baseAddress + BigInt(row) * locationsPerChipBigInt;
    const endAddr = startAddr + locationsPerChipBigInt - 1n;

    for (let col = 0; col < horizontalChips; col++) {
      const chipIndex = row * horizontalChips + col + 1;
      
      const startHex = '0x' + startAddr.toString(16).toUpperCase().padStart(hexPadLength, '0');
      const endHex = '0x' + endAddr.toString(16).toUpperCase().padStart(hexPadLength, '0');
      const startBin = startAddr.toString(2).padStart(addressBusWidth, '0');
      const endBin = endAddr.toString(2).padStart(addressBusWidth, '0');

      chipRanges.push({
        chipIndex,
        row: row + 1,
        col: col + 1,
        startAddress: startAddr,
        endAddress: endAddr,
        startHex,
        endHex,
        startBin,
        endBin,
        sizeBytes: (chipLocations * chipWordWidth) / 8,
      });
    }
  }

  // 6. Formatted capacities
  const bytesNum = Number(totalCapacityBytes);
  const capacityFormatted = {
    bits: totalCapacityBits.toLocaleString() + ' bits',
    bytes: totalCapacityBytes.toLocaleString() + ' B',
    kib: (bytesNum / 1024).toFixed(2) + ' KiB',
    mib: (bytesNum / (1024 * 1024)).toFixed(2) + ' MiB',
    gib: (bytesNum / (1024 * 1024 * 1024)).toFixed(4) + ' GiB',
    kb: (bytesNum / 1000).toFixed(2) + ' KB',
    mb: (bytesNum / (1000 * 1000)).toFixed(2) + ' MB',
    gb: (bytesNum / (1000 * 1000 * 1000)).toFixed(4) + ' GB',
  };

  // 7. Step-by-step working derivations
  const steps = [
    {
      title: 'Addressable Locations',
      formula: 'Locations = 2^(Address Bus Width)',
      calculation: `2^${addressBusWidth} = ${addressableLocations.toLocaleString()}`,
      result: `${addressableLocations.toLocaleString()} distinct locations`,
    },
    {
      title: 'Total Memory Capacity',
      formula:
        addressability === 'byte'
          ? 'Capacity = Locations × 8 bits (Byte-addressable)'
          : `Capacity = Locations × Data Bus Width (${dataBusWidth} bits)`,
      calculation: `${addressableLocations.toLocaleString()} × ${bitsPerLocation} bits = ${totalCapacityBits.toLocaleString()} bits`,
      result: `${capacityFormatted.kib} (${capacityFormatted.gib})`,
    },
    {
      title: 'Horizontal Chip Expansion (Word Width)',
      formula: 'Horizontal Chips = ⌈Data Bus Width / Chip Data Width⌉',
      calculation: `⌈${dataBusWidth} / ${chipWordWidth}⌉ = ${horizontalChips}`,
      result: `${horizontalChips} chip(s) per row to provide ${dataBusWidth}-bit word`,
    },
    {
      title: 'Vertical Chip Expansion (Address Depth)',
      formula: 'Vertical Chips = ⌈Total Locations / Chip Locations⌉',
      calculation: `⌈${addressableLocations.toLocaleString()} / ${chipLocations.toLocaleString()}⌉ = ${verticalChips}`,
      result: `${verticalChips} bank(s) to span full address space`,
    },
    {
      title: 'Total Chips Required',
      formula: 'Total = Horizontal × Vertical',
      calculation: `${horizontalChips} × ${verticalChips} = ${totalChips}`,
      result: `${totalChips} total memory ICs`,
    },
    {
      title: 'Address Line Decoding Architecture',
      formula: 'Offset Bits = log₂(Chip Locations), Decoder Bits = Total Address Bits - Offset Bits',
      calculation: `Offset = log₂(${chipLocations}) = ${offsetBits} bits (A${offsetBits - 1}..A0). Decoder = ${addressBusWidth} - ${offsetBits} = ${decoderBits} bits (A${addressBusWidth - 1}..A${offsetBits}).`,
      result: `${decoderType}`,
    },
  ];

  return {
    addressableLocations,
    totalCapacityBits,
    totalCapacityBytes,
    capacityFormatted,
    expansion: {
      horizontal: horizontalChips,
      vertical: verticalChips,
      totalChips,
    },
    decoder: {
      offsetBits,
      decoderBits,
      decoderType,
      decoderInputLines,
      chipOffsetLines,
      unusedBits,
    },
    chipRanges,
    warnings,
    steps,
  };
}

/**
 * Reverse Calculation: Given target capacity and bus details,
 * compute the required address bus width and memory organization.
 */
export function calculateReverseMemory(inputs: ReverseMemoryInputs): ReverseMemoryResult {
  const { desiredCapacityBytes, dataBusWidth, addressability } = inputs;

  if (desiredCapacityBytes <= 0) {
    throw new Error('Desired capacity must be greater than 0 bytes.');
  }

  const bytesPerLocation = addressability === 'byte' ? 1 : dataBusWidth / 8;
  const requiredLocationsBig = BigInt(Math.ceil(desiredCapacityBytes / bytesPerLocation));

  // Minimum bits needed to cover required locations: ceil(log2(locations))
  let bits = 0;
  let temp = 1n;
  while (temp < requiredLocationsBig) {
    temp <<= 1n;
    bits++;
  }
  const requiredAddressBits = Math.max(1, bits);
  const actualLocations = 1n << BigInt(requiredAddressBits);
  const actualCapacityBytes = actualLocations * BigInt(Math.ceil(bytesPerLocation));

  const steps = [
    {
      title: 'Locations Needed',
      formula:
        addressability === 'byte'
          ? 'Locations = Target Capacity (Bytes) / 1'
          : `Locations = Target Capacity (Bytes) / (Word Size in Bytes = ${bytesPerLocation})`,
      calculation: `${desiredCapacityBytes.toLocaleString()} / ${bytesPerLocation} = ${requiredLocationsBig.toLocaleString()}`,
      result: `${requiredLocationsBig.toLocaleString()} locations`,
    },
    {
      title: 'Required Address Bus Width',
      formula: 'Address Bits = ⌈log₂(Required Locations)⌉',
      calculation: `⌈log₂(${requiredLocationsBig.toLocaleString()})⌉ = ${requiredAddressBits} bits`,
      result: `${requiredAddressBits} address bits (covers up to ${(Number(actualCapacityBytes) / (1024 * 1024)).toFixed(2)} MiB)`,
    },
  ];

  return {
    requiredLocations: requiredLocationsBig,
    requiredAddressBits,
    actualCapacityBytes,
    steps,
  };
}
