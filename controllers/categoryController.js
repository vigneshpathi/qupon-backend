const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'categoryId name');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories };