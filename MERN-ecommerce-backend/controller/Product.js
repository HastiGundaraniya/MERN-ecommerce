const { Product } = require('../model/Product');

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {}
  if(!req.query.admin){
      condition.deleted = {$ne:true}
  }
  
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  console.log(req.query.category);

  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: {$in:req.query.brand.split(',')} });
    totalProductsQuery = totalProductsQuery.find({ brand: {$in:req.query.brand.split(',') }});
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
    product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.importProducts = async (req, res) => {
  try {
      // Fetch products from the external API
      const response = await fetch('https://dummyjson.com/products');

      if (!response.ok) {
          return res.status(500).json({ message: "Failed to fetch products from API" });
      }

      const data = await response.json();

      // Ensure products exist in response
      if (!data.products || data.products.length === 0) {
          return res.status(400).json({ message: "No products found in API response" });
      }

      // Transform products to match your schema
      const products = data.products.map(product => {
          const validPrice = Math.max(product.price ?? 1, 1); // Ensure minimum price of 1
          const validDiscount = Math.max(product.discountPercentage ?? 1, 1); // Ensure minimum discount of 1

          return {
              title: product.title,
              description: product.description,
              price: validPrice,
              discountPercentage: validDiscount,
              discountPrice: Math.round(validPrice * (1 - validDiscount / 100)),
              rating: product.rating ?? 0,
              stock: product.stock ?? 0,
              brand: product.brand || "Unknown Brand",
              category: product.category || "Uncategorized",
              thumbnail: product.thumbnail || "",
              images: product.images || [],
              colors: [],
              sizes: [],
              highlights: [],
              deleted: false
          };
      });

      // Insert products into MongoDB
      const insertedProducts = await Product.insertMany(products);

      res.status(201).json({ message: "Products imported successfully", products: insertedProducts });
  } catch (error) {
      console.error("Error importing products:", error);
      res.status(500).json({ message: "Error importing products", error: error.message });
  }
};

