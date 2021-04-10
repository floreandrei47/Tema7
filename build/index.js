"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sources_json_1 = __importDefault(require("./sources.json"));
var Product = /** @class */ (function () {
    function Product(stock, name, id, price) {
        this.Stock = stock;
        this.Name = name;
        this.Id = id;
        this.Price = price;
        this.Likeability = 0;
        this.HasDiscount = false;
        this.DiscountPercent = 0;
    }
    Product.prototype.AddLikeability = function () { this.Likeability++; };
    Product.prototype.GetLikeability = function () { return this.Likeability; };
    ;
    Product.prototype.AddDiscount = function (newDiscount) {
        this.HasDiscount = true;
        this.DiscountPercent = newDiscount;
    };
    Product.prototype.GetPrice = function () {
        if (!this.HasDiscount)
            return this.Price;
        return this.Price * (100 - this.DiscountPercent) / 100;
    };
    return Product;
}());
var Order = /** @class */ (function () {
    function Order(Customer, Product, OrderTime, Quantity) {
        this.Customer = Customer;
        this.Product = Product;
        this.OrderTime = OrderTime;
        this.Quantity = Quantity;
    }
    return Order;
}());
var Customer = /** @class */ (function () {
    function Customer(money, productManager) {
        this.Favorites = [];
        this.BoughtProducts = [];
        this.Money = money;
        this.ProductManager = productManager;
    }
    Customer.prototype.BuyProduct = function (product, quantity) {
        this.ProductManager.SellProduct(product, this, quantity);
    };
    Customer.prototype.AddFavorites = function (product) {
        this.ProductManager.AddFavorites(product, this);
    };
    return Customer;
}());
var ProductManager = /** @class */ (function () {
    function ProductManager() {
        this.ProductList = [];
        this.OrderList = [];
        for (var _i = 0, sources_1 = sources_json_1.default; _i < sources_1.length; _i++) {
            var source = sources_1[_i];
            var product = new Product(source["stock"], source["name"], source["id"], source["price"]);
            this.ProductList.push(product);
        }
    }
    ProductManager.prototype.SellProduct = function (product, customer, quantity) {
        var foundProduct = this.ProductList.find(function (p) { return p == product; });
        if (!foundProduct) {
            console.log("This products doesn't exist");
            return;
        }
        if (customer.Money * quantity <= product.GetPrice()) {
            console.log("you broke");
            return;
        }
        if (product.Stock < quantity) {
            console.log("The stock is negative");
            return;
        }
        product.Stock -= quantity;
        for (var i = 1; i <= quantity; i++) {
            customer.BoughtProducts.push(product);
        }
        customer.Money -= product.GetPrice() * quantity;
        var newOrder = new Order(customer, product, new Date(), quantity);
        this.OrderList.push(newOrder);
    };
    ProductManager.prototype.AddFavorites = function (product, customer) {
        var foundProduct = this.ProductList.find(function (p) { return p.Id == product.Id; });
        if (!foundProduct) {
            console.log("This products doesn't exist");
            return;
        }
        customer.Favorites.push(product);
        product.AddLikeability();
        if (product.GetLikeability() > 10) {
            product.AddDiscount(10);
        }
    };
    ProductManager.prototype.Refill = function (product, amound) {
        product.Stock += amound;
    };
    return ProductManager;
}());
var productManager = new ProductManager();
console.log(productManager.ProductList);
