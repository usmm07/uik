import {
  users,
  categories,
  menuItems,
  carts,
  orders,
  orderItems,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type MenuItem,
  type InsertMenuItem,
  type Cart,
  type InsertCart,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Menu Items
  getMenuItems(categoryId?: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Cart
  getCartItems(userId: number): Promise<(Cart & { menuItem: MenuItem })[]>;
  addToCart(cartItem: InsertCart): Promise<Cart>;
  updateCartItem(id: number, quantity: number): Promise<Cart | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Orders
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<(OrderItem & { menuItem: MenuItem })[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class DatabaseStorage implements IStorage {

  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) {
        return; // Data already seeded
      }

      // Create default user
      await db.insert(users).values({
        telegramId: "123456789",
        firstName: "Алексей",
        lastName: "Иванов",
        username: "alexivanov",
        phone: "+998901234567",
      });

      // Create categories
      const categoryData = [
        {
          name: "Пицца",
          description: "Свежая пицца на тонком тесте",
          image: "🍕",
          isActive: true,
          sortOrder: 1,
        },
        {
          name: "Бургеры",
          description: "Сочные бургеры с говядиной и курицей",
          image: "🍔",
          isActive: true,
          sortOrder: 2,
        },
        {
          name: "Узбекская кухня",
          description: "Традиционные узбекские блюда",
          image: "🍛",
          isActive: true,
          sortOrder: 3,
        },
        {
          name: "Напитки",
          description: "Освежающие напитки и соки",
          image: "🥤",
          isActive: true,
          sortOrder: 4,
        },
      ];

      await db.insert(categories).values(categoryData);

      // Create menu items
      const menuItemData = [
        // Пицца
        {
          categoryId: 1,
          name: "Пицца Маргарита",
          description: "Классическая пицца с томатным соусом, моцареллой и свежим базиликом",
          price: "89000",
          image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 15,
          ingredients: ["томатный соус", "моцарелла", "свежий базилик", "оливковое масло"],
          allergens: ["глютен", "молочные продукты"],
          tags: ["вегетарианская", "популярная"],
          sortOrder: 1,
        },
        {
          categoryId: 1,
          name: "Пицца Пепперони",
          description: "Классическая пицца с пепперони и сыром моцарелла",
          price: "125000",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 15,
          ingredients: ["томатный соус", "моцарелла", "пепперони"],
          allergens: ["глютен", "молочные продукты"],
          tags: ["популярная"],
          sortOrder: 2,
        },
        {
          categoryId: 1,
          name: "Пицца Четыре сыра",
          description: "Пицца с четырьмя видами сыра: моцарелла, горгонзола, пармезан, рикотта",
          price: "145000",
          image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 18,
          ingredients: ["моцарелла", "горгонзола", "пармезан", "рикотта"],
          allergens: ["глютен", "молочные продукты"],
          tags: ["вегетарианская", "премиум"],
          sortOrder: 3,
        },
        // Бургеры
        {
          categoryId: 2,
          name: "Классический бургер",
          description: "Сочная говяжья котлета с салатом, помидором и маринованными огурцами",
          price: "95000",
          image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 12,
          ingredients: ["говяжья котлета", "салат", "помидор", "маринованные огурцы", "булочка"],
          allergens: ["глютен"],
          tags: ["популярный"],
          sortOrder: 1,
        },
        {
          categoryId: 2,
          name: "Чикен бургер",
          description: "Куриная грудка на гриле с авокадо и майонезом",
          price: "85000",
          image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 12,
          ingredients: ["куриная грудка", "авокадо", "майонез", "булочка"],
          allergens: ["глютен"],
          tags: ["здоровый"],
          sortOrder: 2,
        },
        {
          categoryId: 2,
          name: "Двойной чизбургер",
          description: "Двойная говяжья котлета с сыром чеддер и специальным соусом",
          price: "135000",
          image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 15,
          ingredients: ["двойная говяжья котлета", "чеддер", "специальный соус", "лук", "булочка"],
          allergens: ["глютен", "молочные продукты"],
          tags: ["популярный", "острый"],
          sortOrder: 3,
        },
        // Узбекская кухня
        {
          categoryId: 3,
          name: "Плов",
          description: "Традиционный узбекский плов с бараниной, морковью и рисом",
          price: "65000",
          image: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 25,
          ingredients: ["баранина", "рис", "морковь", "лук", "специи"],
          allergens: [],
          tags: ["традиционный", "популярный"],
          sortOrder: 1,
        },
        {
          categoryId: 3,
          name: "Лагман",
          description: "Традиционная лапша с мясом и овощами в ароматном бульоне",
          price: "55000",
          image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 20,
          ingredients: ["лапша", "говядина", "овощи", "зелень", "специи"],
          allergens: ["глютен"],
          tags: ["традиционный", "суп"],
          sortOrder: 2,
        },
        {
          categoryId: 3,
          name: "Шашлык из баранины",
          description: "Сочный шашлык из маринованной баранины на мангале",
          price: "98000",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 18,
          ingredients: ["баранина", "лук", "специи"],
          allergens: [],
          tags: ["гриль", "популярный"],
          sortOrder: 3,
        },
        {
          categoryId: 3,
          name: "Манты",
          description: "Паровые пельмени с мясной начинкой и луком",
          price: "45000",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 22,
          ingredients: ["говядина", "баранина", "лук", "тесто"],
          allergens: ["глютен"],
          tags: ["традиционный", "на пару"],
          sortOrder: 4,
        },
        // Напитки
        {
          categoryId: 4,
          name: "Кока-Кола",
          description: "Классический освежающий напиток",
          price: "15000",
          image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 1,
          ingredients: ["кола"],
          allergens: [],
          tags: [],
          sortOrder: 1,
        },
        {
          categoryId: 4,
          name: "Зеленый чай",
          description: "Ароматный зеленый чай высшего качества",
          price: "12000",
          image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 3,
          ingredients: ["зеленый чай"],
          allergens: [],
          tags: ["здоровый"],
          sortOrder: 2,
        },
        {
          categoryId: 4,
          name: "Свежевыжатый апельсиновый сок",
          description: "100% натуральный апельсиновый сок",
          price: "25000",
          image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop&crop=center",
          isAvailable: true,
          preparationTime: 2,
          ingredients: ["свежие апельсины"],
          allergens: [],
          tags: ["свежий", "витамины"],
          sortOrder: 3,
        },
      ];

      await db.insert(menuItems).values(menuItemData);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.sortOrder);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Menu Item methods
  async getMenuItems(categoryId?: number): Promise<MenuItem[]> {
    if (categoryId) {
      return await db.select().from(menuItems)
        .where(eq(menuItems.categoryId, categoryId))
        .orderBy(menuItems.sortOrder);
    }
    return await db.select().from(menuItems).orderBy(menuItems.sortOrder);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem || undefined;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db
      .insert(menuItems)
      .values(insertMenuItem)
      .returning();
    return menuItem;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [menuItem] = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return menuItem || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return result.rowCount > 0;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<(Cart & { menuItem: MenuItem })[]> {
    const cartWithItems = await db
      .select({
        id: carts.id,
        userId: carts.userId,
        itemId: carts.itemId,
        quantity: carts.quantity,
        notes: carts.notes,
        createdAt: carts.createdAt,
        menuItem: {
          id: menuItems.id,
          categoryId: menuItems.categoryId,
          name: menuItems.name,
          description: menuItems.description,
          price: menuItems.price,
          image: menuItems.image,
          isAvailable: menuItems.isAvailable,
          preparationTime: menuItems.preparationTime,
          ingredients: menuItems.ingredients,
          allergens: menuItems.allergens,
          tags: menuItems.tags,
          sortOrder: menuItems.sortOrder,
        }
      })
      .from(carts)
      .innerJoin(menuItems, eq(carts.itemId, menuItems.id))
      .where(eq(carts.userId, userId));

    return cartWithItems as any;
  }

  async addToCart(insertCart: InsertCart): Promise<Cart> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, insertCart.userId))
      .where(eq(carts.itemId, insertCart.itemId));

    if (existingItem) {
      // Update quantity
      const [updatedCart] = await db
        .update(carts)
        .set({ quantity: existingItem.quantity + insertCart.quantity })
        .where(eq(carts.id, existingItem.id))
        .returning();
      return updatedCart;
    } else {
      // Create new cart item
      const [cart] = await db
        .insert(carts)
        .values(insertCart)
        .returning();
      return cart;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<Cart | undefined> {
    const [cart] = await db
      .update(carts)
      .set({ quantity })
      .where(eq(carts.id, id))
      .returning();
    return cart || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(carts).where(eq(carts.id, id));
    return result.rowCount > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(carts).where(eq(carts.userId, userId));
    return true; // Always return true as clearing empty cart is successful
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(orders.createdAt);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async getOrderItems(orderId: number): Promise<(OrderItem & { menuItem: MenuItem })[]> {
    const orderItemsWithMenu = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        itemId: orderItems.itemId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        createdAt: orderItems.createdAt,
        menuItem: {
          id: menuItems.id,
          categoryId: menuItems.categoryId,
          name: menuItems.name,
          description: menuItems.description,
          price: menuItems.price,
          image: menuItems.image,
          isAvailable: menuItems.isAvailable,
          preparationTime: menuItems.preparationTime,
          ingredients: menuItems.ingredients,
          allergens: menuItems.allergens,
          tags: menuItems.tags,
          sortOrder: menuItems.sortOrder,
          createdAt: menuItems.createdAt,
          updatedAt: menuItems.updatedAt,
        }
      })
      .from(orderItems)
      .innerJoin(menuItems, eq(orderItems.itemId, menuItems.id))
      .where(eq(orderItems.orderId, orderId));

    return orderItemsWithMenu;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db
      .insert(orderItems)
      .values(insertOrderItem)
      .returning();
    return orderItem;
  }
}

export const storage = new DatabaseStorage();