require('dotenv').config();
const express = require('express');
const app = express();


const pool = require('./db');

app.use(express.json());
app.use(express.static('public'));

const clienteRouter = require('./routes/clienteRouter');
const productoRouter = require('./routes/productoRouter');
const carritoRouter = require('./routes/carritoRouter');
const pedidoRouter = require('./routes/pedidoRouter');

app.use('/api/cliente', clienteRouter);
app.use('/api/productos', productoRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/pedido', pedidoRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
