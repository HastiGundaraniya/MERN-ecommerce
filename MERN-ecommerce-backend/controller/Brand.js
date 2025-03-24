const { Brand } = require('../model/Brand');

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.importBrands = async (req, res) => {
  try {
    // Fetch products from the external API
    const response = await fetch('https://dummyjson.com/products');

    if (!response.ok) {
      return res.status(500).json({ message: "Failed to fetch products from API" });
    }

    const data = await response.json();

    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      return res.status(400).json({ message: "No products found in API response" });
    }

    // Extract unique brands, filtering out undefined values
    const uniqueBrands = [...new Set(
      data.products
        .map(product => product.brand)
        .filter(brand => brand && typeof brand === 'string') // Ensure brand is a valid string
    )];

    if (uniqueBrands.length === 0) {
      return res.status(400).json({ message: "No valid brands found" });
    }

    // Transform brands to match schema
    const brandDocs = uniqueBrands.map(brand => ({
      label: brand,
      value: brand.toLowerCase().replace(/\s+/g, '-'), // Convert to slug format
    }));

    // Insert into MongoDB
    const insertedBrands = await Brand.insertMany(brandDocs, { ordered: false });

    res.status(201).json({ message: "Brands imported successfully", brands: insertedBrands });
  } catch (error) {
    console.error("Error importing brands:", error);
    res.status(500).json({ message: "Error importing brands", error: error.message });
  }
};


