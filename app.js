const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authenticate = require('./api/middleware/authenticate');

// 'mongodb+srv://'+ process.env.MONGODB_USERNAME +':'+ process.env.MONGODB_PASSWORD +'@cluster0-vgwyw.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://IshanM:ishan123@cluster0-vgwyw.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false});


const adminRoutes = require('./api/routes/admins');
const categoryRoutes = require('./api/routes/categories');
const userRoutes = require('./api/routes/users');
const managerRoutes = require('./api/routes/managers');
const productRoutes = require('./api/routes/products');
const cartItemRoutes = require('./api/routes/cartItems');
const orderRoutes = require('./api/routes/orders');

const path = require('path');

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/manager', managerRoutes);
app.use('/products', productRoutes);
app.use('/cart', authenticate, cartItemRoutes);
app.use('/order', authenticate, orderRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client','build','index.html'));
    });
}

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not Found'
    })
})







module.exports = app;