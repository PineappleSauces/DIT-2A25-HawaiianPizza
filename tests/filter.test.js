// code to test the filter model functions, assisted by AI
const Categories = require('../src/models/CategoryFilter.js');
const Items = require('../src/models/ItemFilter.js');

describe('Category and Item model functions', () => {
  // Adjust or mock data as needed for your test environment

  //test to get all categories, if error check CategoryFilter
  test('getAll returns an array of categories including expected names', async () => {
    const categories = await Categories.getAll();
    expect(Array.isArray(categories)).toBe(true);
    const names = categories.map(c => c.name);
    expect(names).toEqual(expect.arrayContaining(['JDM', 'Euro', 'Muscle', 'AWD']));
  });

  //test to get category by id, if error check CategoryFilter
  test('getById returns category object for valid id, null for invalid', async () => {
    const validCategory = await Categories.getById(1);
    expect(validCategory).not.toBeNull();
    expect(typeof validCategory.name).toBe('string');

    const invalidCategory = await Categories.getById(9999);
    expect(invalidCategory).toBeNull();
  });

  //test to get items by category id, if error check ItemFilter
  test('getByCategory returns an array of items for a valid categoryId', async () => {
    const items = await Items.getByCategory(1);
    expect(Array.isArray(items)).toBe(true);
    // Optionally check item structure if known
    if (items.length > 0) {
      expect(items[0]).toHaveProperty('name');
      expect(items[0]).toHaveProperty('categoryId', 1);
    }
  });
});