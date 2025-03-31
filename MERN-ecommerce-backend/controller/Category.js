const { Category } = require('../model/Category');

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

//for importing data into categories database
// exports.importCategories = async (req, res) => {
//   try {
//     // Fetch categories from an external API
//     const response = await fetch('https://dummyjson.com/products/categories');

//     if (!response.ok) {
//       return res.status(500).json({ message: "Failed to fetch categories from API" });
//     }

//     const categories = await response.json();

//     console.log("API Response:", categories); // Debugging

//     if (!Array.isArray(categories) || categories.length === 0) {
//       return res.status(400).json({ message: "No categories found in API response" });
//     }

//     // Transform API response to match schema
//     const categoryDocs = categories.map(category => ({
//       label: category.name, // Use name from API
//       value: category.slug  // Use slug from API
//     }));

//     // Insert into MongoDB
//     const insertedCategories = await Category.insertMany(categoryDocs, { ordered: false });

//     res.status(201).json({ message: "Categories imported successfully", categories: insertedCategories });
//   } catch (error) {
//     console.error("Error importing categories:", error);
//     res.status(500).json({ message: "Error importing categories", error: error.message });
//   }
// };





