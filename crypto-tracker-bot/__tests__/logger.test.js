const logger = require('../utils/logger');

describe('logger', () => {
  it('logs info messages', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('hello');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
