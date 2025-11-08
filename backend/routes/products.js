const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Helper function to read products
const readProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Helper function to write products
const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// GET all products
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// POST - Add new product
router.post('/', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.body.image,
      category: req.body.category || 'General'
    };
    
    products.push(newProduct);
    
    if (writeProducts(products)) {
      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to save product'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message
    });
  }
});

// DELETE - Remove product
router.delete('/:id', (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    if (writeProducts(products)) {
      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// PUT - Update product
router.put('/:id', (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    products[productIndex] = {
      ...products[productIndex],
      name: req.body.name || products[productIndex].name,
      description: req.body.description || products[productIndex].description,
      price: req.body.price ? parseFloat(req.body.price) : products[productIndex].price,
      image: req.body.image || products[productIndex].image,
      category: req.body.category || products[productIndex].category
    };
    
    if (writeProducts(products)) {
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: products[productIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

module.exports = router;