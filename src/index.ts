import sources from "./sources.json"

class Product {
    Stock: number;
    readonly Name: string;
    readonly Id: number;
    private Likeability: number;
    private Price: number;
    HasDiscount: boolean;
    DiscountPercent: number;

    addLikeability() 
    { this.Likeability++ }

    getLikeability() 
    { return this.Likeability };
    
    addDiscount(newDiscount: number) {
        this.HasDiscount = true;
        this.DiscountPercent = newDiscount;
    }
    getPrice(){
        if(!this.HasDiscount)
        return this.Price;
        
        return this.Price*(100-this.DiscountPercent)/100
    }

    constructor(stock: number, name: string, id: number, price: number) {
        this.Stock = stock;
        this.Name = name;
        this.Id = id;
        this.Price = price;
        this.Likeability = 0;
        this.HasDiscount = false;
        this.DiscountPercent = 0;
    }
}

class Order {
    Customer: Customer;
    Product: Product;
    OrderTime: Date;
    Quantity: number;


    constructor(Customer: Customer,
        Product: Product,
        OrderTime: Date,
        Quantity: number) {
        this.Customer = Customer;
        this.Product = Product;
        this.OrderTime = OrderTime;
        this.Quantity = Quantity;
    }
}

class Customer {
    ProductManager: ProductManager;
    Favorites: Array<Product>
    BoughtProducts: Array<Product>
    Money: number;

    constructor(money: number, productManager: ProductManager) {
        this.Favorites = [];
        this.BoughtProducts = [];
        this.Money = money;
        this.ProductManager = productManager;
    }


    buyProduct(product: Product, quantity: number) {
        this.ProductManager.sellProduct(product, this, quantity)
    }

    addFavorites(product: Product) {
        this.ProductManager.addFavorites(product,this)
    }

}

class ProductManager {
    ProductList: Array<Product>
    OrderList: Array<Order>
    constructor() {
        this.ProductList = [];
        this.OrderList = [];

        for (let source of sources) {
            let product = new Product(source["stock"], source["name"], source["id"], source["price"]);
            this.ProductList.push(product);
        }
    }
    public sellProduct(product: Product, customer: Customer, quantity: number) {
        let foundProduct = this.ProductList.find(p => p == product)
        if (!foundProduct) {
            console.log("This products doesn't exist")
            return;
        }
        if (customer.Money * quantity <= product.getPrice()) {
            console.log("you broke")
            return;
        }
        if (product.Stock < quantity) {
            console.log("The stock is negative")
            return;
        }
        product.Stock -= quantity;
        for (let i = 1; i <= quantity; i++) {
            customer.BoughtProducts.push(product);
        }
        customer.Money -= product.getPrice() * quantity;
        let newOrder = new Order(customer, product, new Date(), quantity)
        this.OrderList.push(newOrder)
    }

    public addFavorites(product: Product, customer: Customer) {
        let foundProduct = this.ProductList.find(p => p.Id == product.Id)
        if (!foundProduct) {
            console.log("This products doesn't exist")
            return;
        }
        customer.Favorites.push(product)
        product.addLikeability()
        if(product.getLikeability()>10){
            product.addDiscount(10);
        }
    }

    public refill(product:Product, amound:number){
        product.Stock+=amound;
    }
}

let productManager = new ProductManager();

console.log(productManager.ProductList);