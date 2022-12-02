import FevoCodeTest from './FevoCodeTest'

// Note: There is a configuration issue in the project for tests that I didn't have time to solve.
// This is what tests would look like.
// Other tests that I would write is testing the cache, makeing sure that the last 10 days are
// represented, etc.
test('Test that the basic function is working', async () => {
    const codeTest = new FevoCodeTest()
    const response = await codeTest.getLastTenDaysFromNasa(new Date())
    expect(Object.keys(response).length).toBe(10);
});