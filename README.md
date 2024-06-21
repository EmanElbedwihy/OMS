<h1 align='center'>Order Management System</h1>

## 📝 Table of Contents

- [About](#about)
- [System Description](#sys)
- [Get started](#get-started)
  - [Installation](#install)
  - [Running](#running)
- [Swagger Documentation](#swagger)


## 📙 About <a name = "about"></a>

  Designing and implementing an Order Management System (OMS) for our e-commerce mobile app using NestJS for the framework, PostgreSQL for the database, and Prisma as the Object-Relational Mapping (ORM).


## 📃 System Description <a name = "sys"></a>
The System has the following APIs :
<h4>1-Add Product to Cart</h4>
This API adds a product to a specific user's cart or increment product's quantity if it already exists in the cart. It requires both the user ID and product ID.It checks for the product stock before it is added to the cart. It fails if either the product or user is not found, if validation fails, or if the product is out of stock (i.e., has zero stock).

<h4>2-Remove Product from Cart</h4>
This API removes a product from a specific user's cart. It requires both the user ID and the product ID. It fails if either the user or product cannot be found, or if validation fails.

<h4>3-Get User's Cart</h4>
This API retrieves the cart of a specific user. It requires the user ID . It fails if the user or is not found, or if validation fails.

<h4>4-Update Cart Item Quantity</h4>
This API updates the quantity of a product in the cart of a specific user. It requires the user ID, the product ID and the product's quantity.It checks for the product stock before its quantity is updated. It fails if either the user or product cannot be found, if validation fails or if the product is not available in the required quantity.

<h4>5-Get Order Details</h4>
This API fetches details of a specific order by its ID. It fails if the order is not found or if validation fails.

<h4>6-Update Order Status</h4>
This API updates the status of an order by its ID.The allowed status are : Pending , Delivering , Delivered or Canceled. It fails if the order is not found or if validation fails. If the order is canceled all the products in it are returned(their stocks are increased).

<h4>7-Create Order</h4>
This API creates a new order from the user's cart. It requires the user ID. It checks for every product stock in the order before the order is created.If it succeeds the cart is emptied , every produc stock is decreased and the order is created.  It fails if the user is not found, if validation fails or if the product is not available in the required quantity.

<h4>8-Apply Coupon to Order</h4>
This API applies a coupon code to reduce the total price of an order. It requires the order ID and the coupon code. It fails if either the order or coupon code cannot be found, if validation fails or if the coupon has expired.

<h4>9-Get User Orders</h4>
This API retrieves all orders for a specific user.It requires the user ID. It fails if the user is not found or if validation fails.


## 🏁 Getting Started <a name = "get-started"></a>

This is a list of needed instructions to run the project locally
### Installation <a name = "install"></a>

1. **_Clone the repository_**

```bash
$ git clone [https://github.com/EmanElbedwihy/OMS.git]
```

2. **_Create a .env file with the following database url_**
   
```bash
DATABASE_URL="postgresql://username:password@localhost:port/OMS?schema=public"
```
Replace 'username', 'password', and 'port' with your respective variables.

3. **_Install npm packages_**
   
```bash
$ npm install
```

4. **_Create the database_**
   
```bash
$ npx prisma generate
$ npx prisma migrate dev
```

### Running <a name = "running"></a>

1. **_Run the seeds and open prisma studio(for database display)_**

```bash
$ npm run seed
$ npx prisma studio
```

2. **_Run the app_**

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

3. **_Test the app_**
   <p>The app can be tested using postman or thunder client through sending requests.</p>
   <p>Use swagger documentation for more details about APIs</p>
   
```bash
http://localhost:3000/api
```


## 📃 Swagger Documentation <a name = "swagger"></a>

![Swagger](doc/Swagger.png)
   
   



