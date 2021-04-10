import sources from "./sources.json"

class Product {
    Stock: number;
    readonly Name: string;
    readonly Id: number;
    private Likeability: number;
    private Price: number;
    HasDiscount: boolean;
    DiscountPercent: number;

    AddLikeability() { this.Likeability++ }
    GetLikeability() { return this.Likeability };
    AddDiscount(newDiscount: number) {
        this.HasDiscount = true;
        this.DiscountPercent = newDiscount;
    }
    GetPrice(){
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


    BuyProduct(product: Product, quantity: number) {
        this.ProductManager.SellProduct(product, this, quantity)
    }
    AddFavorites(product: Product) {
        this.ProductManager.AddFavorites(product,this)
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
    public SellProduct(product: Product, customer: Customer, quantity: number) {
        let foundProduct = this.ProductList.find(p => p == product)
        if (!foundProduct) {
            console.log("This products doesn't exist")
            return;
        }
        if (customer.Money * quantity <= product.GetPrice()) {
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
        customer.Money -= product.GetPrice() * quantity;
        let newOrder = new Order(customer, product, new Date(), quantity)
        this.OrderList.push(newOrder)
    }

    public AddFavorites(product: Product, customer: Customer) {
        let foundProduct = this.ProductList.find(p => p.Id == product.Id)
        if (!foundProduct) {
            console.log("This products doesn't exist")
            return;
        }
        customer.Favorites.push(product)
        product.AddLikeability()
        if(product.GetLikeability()>10){
            product.AddDiscount(10);
        }
    }

    public Refill(product:Product, amound:number){
        product.Stock+=amound;
    }
}

let productManager = new ProductManager();

console.log(productManager.ProductList);