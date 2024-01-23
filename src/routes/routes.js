const express = require('express');
const router = express.Router();
const sequelize = require('../database/database.js'); // Importa la conexión a la base de datos

// Obtener todos los productos desde la tabla existente
router.get('/api/productos', async (req, res) => {
  try {
    const products = await sequelize.query('SELECT * FROM productos', {
      type: sequelize.QueryTypes.SELECT,
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/api/destacados', async (req, res) => {
  try {
    const products = await sequelize.query('SELECT * FROM productos WHERE stock <= 5', {
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.post('/api/pay', async (req, res) => {
  const ids = req.body;

  try {
    // Inicia una transacción
    const t = await sequelize.transaction();

    try {
      const productsFromDB = await sequelize.query('SELECT * FROM productos', {
        type: sequelize.QueryTypes.SELECT,
        transaction: t, // Asocia la transacción a esta consulta
      });

      for (const id of ids) {
        const productFromDB = productsFromDB.find(p => p.id === id);

        if (productFromDB && productFromDB.stock > 0) {
          // Realiza la actualización de stock en la base de datos
          await sequelize.query('UPDATE productos SET stock = stock - 1 WHERE id = :id AND stock > 0', {
            replacements: { id },
            type: sequelize.QueryTypes.UPDATE,
            transaction: t, // Asocia la transacción a esta consulta
          });
        } else {
          throw "sin stock";
        }
      }

      // Si todo está bien, realiza la confirmación de la transacción
      await t.commit();

      res.send("Pago procesado exitosamente");
    } catch (error) {
      await t.rollback();
      throw error; 
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
})

router.get('/api/productos/categoria/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
      const productos = await sequelize.query(`
          SELECT productos.* FROM productos
          JOIN subcategories ON productos.subcategory_id = subcategories.id
          WHERE subcategories.category_id = :categoryId
      `, {
          replacements: { categoryId: categoryId },
          type: sequelize.QueryTypes.SELECT
      });
      res.json(productos);
  } catch (error) {
      console.error('Error al obtener los productos por categoría:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/api/productos/subcategoria/:subcategoryId', async (req, res) => {
  const subcategoryId = req.params.subcategoryId;
  try {
      const productos = await sequelize.query(`
          SELECT * FROM productos WHERE subcategory_id = :subcategoryId
      `, {
          replacements: { subcategoryId: subcategoryId },
          type: sequelize.QueryTypes.SELECT
      });
      res.json(productos);
  } catch (error) {
      console.error('Error al obtener los productos por subcategoría:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/api/productos/buscar', async (req, res) => {
  const searchTerm = req.query.termino; 

  try {
    
    const productosEncontrados = await buscarProductosPorNombre(searchTerm);
    res.json(productosEncontrados);
  } catch (error) {
    console.error('Error al buscar productos en el backend:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

async function buscarProductosPorNombre(searchTerm) {
  try {
    // Realiza la consulta SQL para buscar productos por nombre
    const productosEncontrados = await sequelize.query(`
      SELECT * FROM productos
      WHERE name ILIKE :searchTerm
    `, {
      replacements: { searchTerm: `%${searchTerm}%` }, 
      type: sequelize.QueryTypes.SELECT
    });

    return productosEncontrados;
  } catch (error) {
    throw error;
  }
}


router.get('/api/productos/ofertas', async (req, res) => {
  try {
    
    const productosOfertas = await buscarProductosEnOferta();
    res.json(productosOfertas);
  } catch (error) {
    console.error('Error al obtener productos en oferta en el backend:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

});

async function buscarProductosEnOferta() {
  try {
    
    const productosOfertas = await sequelize.query(`
      SELECT * FROM productos
      WHERE price <= 500
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    return productosOfertas;
  } catch (error) {
    throw error;
  }
}





module.exports = router;