const result = {
  resize: jest.fn().mockReturnThis(),
  jpeg: jest.fn().mockReturnThis(),
  metadata: jest.fn().mockResolvedValue({ metadata: 'test' }),
  toBuffer: jest.fn().mockResolvedValue({ data: Buffer.from('mocked-image-data') }),
  on: jest.fn().mockReturnThis(),
  write: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
  once: jest.fn().mockReturnThis(),
  emit: jest.fn().mockReturnThis(),
}

module.exports = jest.fn(() => result);
