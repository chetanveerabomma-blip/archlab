import { describe, it, expect } from 'vitest';
import { calculateMemory, calculateReverseMemory } from '../memory';

describe('Memory Address Calculator Engine', () => {
  it('calculates 16-bit address space byte-addressable = 64K locations and 64 KiB', () => {
    const res = calculateMemory({
      addressBusWidth: 16,
      dataBusWidth: 8,
      addressability: 'byte',
      chipLocations: 1024, // 1K x 8 chips
      chipWordWidth: 8,
    });

    expect(res.addressableLocations).toBe(65536n);
    expect(res.totalCapacityBytes).toBe(65536n);
    expect(res.capacityFormatted.kib).toBe('64.00 KiB');
    expect(res.expansion.horizontal).toBe(1);
    expect(res.expansion.vertical).toBe(64); // 64K / 1K = 64
    expect(res.expansion.totalChips).toBe(64);
    expect(res.decoder.offsetBits).toBe(10); // log2(1024) = 10
    expect(res.decoder.decoderBits).toBe(6);  // 16 - 10 = 6
    expect(res.decoder.decoderType).toBe('6-to-64 Decoder');
  });

  it('calculates 32-bit address space byte-addressable = 4 GiB capacity', () => {
    const res = calculateMemory({
      addressBusWidth: 32,
      dataBusWidth: 32,
      addressability: 'byte',
      chipLocations: 1048576, // 1M x 8 chips
      chipWordWidth: 8,
    });

    expect(res.addressableLocations).toBe(4294967296n);
    expect(res.totalCapacityBytes).toBe(4294967296n);
    expect(res.capacityFormatted.gib).toBe('4.0000 GiB');
    expect(res.expansion.horizontal).toBe(4); // 32 bits / 8 bits = 4
  });

  it('correctly maps chip range addresses in hex', () => {
    const res = calculateMemory({
      addressBusWidth: 12,
      dataBusWidth: 16,
      addressability: 'word',
      chipLocations: 1024, // 1K x 16 chips
      chipWordWidth: 16,
      startAddressHex: '0x0000',
    });

    expect(res.chipRanges.length).toBe(4); // 4096 / 1024 = 4 vertical banks
    expect(res.chipRanges[0].startHex).toBe('0x0000');
    expect(res.chipRanges[0].endHex).toBe('0x03FF');
    expect(res.chipRanges[1].startHex).toBe('0x0400');
    expect(res.chipRanges[1].endHex).toBe('0x07FF');
  });

  it('handles reverse mode accurately', () => {
    // 64 KiB = 65536 bytes
    const rev = calculateReverseMemory({
      desiredCapacityBytes: 65536,
      dataBusWidth: 8,
      addressability: 'byte',
    });

    expect(rev.requiredAddressBits).toBe(16);
    expect(rev.requiredLocations).toBe(65536n);
  });
});
