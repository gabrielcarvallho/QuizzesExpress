global.connection = {
    promise: jest.fn(() => ({
      query: jest.fn().mockResolvedValue([[], []]),
      execute: jest.fn().mockResolvedValue([[], []]),
      end: jest.fn().mockResolvedValue()
    }))
  };

  afterEach(() => {
    jest.clearAllMocks();
  });