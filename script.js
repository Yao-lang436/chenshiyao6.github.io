// ========== 商品数据 ==========
// 定义网站的商品数据，包含商品的基本信息
// ========== 商品数据 ==========
// 定义网站的商品数据，包含商品的基本信息
const products = [
    {
        id: 1,
        name: "皇家幼猫粮",
        description: "专为12个月以下幼猫设计，提供全面营养支持",
        price: 158.00,
        category: "kitten",
        icon: "fa-cat",
        imageUrl: "images/product1.jpg" // 添加图片路径
    },
    {
        id: 2,
        name: "希尔斯成猫粮",
        description: "富含优质蛋白质，维护成猫健康体态",
        price: 189.00,
        category: "dry-food",
        icon: "fa-bowl-food",
        imageUrl: "images/product2.jpg" // 添加图片路径
    },
    {
        id: 3,
        name: "巅峰猫罐头",
        description: "新西兰原装进口，高肉含量，无谷物添加",
        price: 32.00,
        category: "wet-food",
        icon: "fa-drumstick-bite",
        imageUrl: "images/product3.jpg" // 添加图片路径
    },
    {
        id: 4,
        name: "渴望六种鱼",
        description: "富含六种新鲜海鱼，满足猫咪天生食肉需求",
        price: 245.00,
        category: "dry-food",
        icon: "fa-fish",
        imageUrl: "images/product4.jpg" // 添加图片路径
    },
    {
        id: 5,
        name: "伊纳宝猫条",
        description: "猫咪最爱零食，多种口味可选",
        price: 15.00,
        category: "snacks",
        icon: "fa-cookie-bite",
        imageUrl: "images/product5.jpg" // 添加图片路径
    }
];

// ========== 购物车数据 ==========
// 使用数组存储购物车中的商品，每个商品包含id、名称、价格、数量等信息
let cart = [];

// ========== 页面初始化 ==========
// 当页面加载完成后执行初始化函数
document.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    // 获取页面上的主要DOM元素
    const productsGrid = document.getElementById('products-grid');
    const productModal = document.getElementById('product-modal');
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    const loginPlaceholder = document.getElementById('login-placeholder');
    
    // 渲染商品列表到页面
    renderProducts(products);
    
    // 更新购物车数量显示
    updateCartCount();
    
    // ========== 事件监听器设置 ==========
    
    // 购物车按钮点击事件 - 显示购物车
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });
    
    
    // 关闭模态框功能
    // 为所有关闭按钮添加点击事件
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });
    
    // 点击模态框外部区域关闭模态框
    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.style.display = 'none';
        if (e.target === cartModal) cartModal.style.display = 'none';
    });
    
    // ========== 搜索功能 ==========
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 如果搜索框为空，显示所有商品
            renderProducts(products);
            return;
        }
        
        // 根据搜索词过滤商品
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        
        // 渲染过滤后的商品
        renderProducts(filteredProducts);
    });
    
    // 按回车键也可以搜索
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // ========== 分类筛选功能 ==========
    const categoryLinks = document.querySelectorAll('.category-list a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            
            // 更新活动状态的分类链接
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            // 根据分类筛选商品
            if (category === 'all') {
                renderProducts(products);
                return;
            }
            
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        });
    });
    
    // ========== 结算功能 ==========
    const checkoutBtn = document.getElementById('checkout-btn');
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('购物车是空的，无法结算');
            return;
        }
        
        // 计算总金额
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showNotification(`结算成功！总金额：¥${total.toFixed(2)}`);
        
        // 清空购物车
        cart = [];
        updateCartCount();
        cartModal.style.display = 'none';
    });
}

// ========== 渲染商品列表 ==========
// 将商品数组渲染到页面的商品网格中
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    const productCount = document.getElementById('product-count');
    
    // 清空现有的商品网格
    productsGrid.innerHTML = '';
    
    // 更新商品数量显示
    productCount.textContent = `${productsToRender.length}个商品`;
    
    // 遍历商品数组，为每个商品创建HTML元素
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                
                <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='images/default-product.jpg';this.onerror=null;">
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-desc">${product.description}</div>
                <div class="product-price">¥${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">加入购物车</button>
            </div>
        `;
        
        // 点击商品卡片查看详情
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                showProductDetail(product.id);
            }
        });
        
        // 点击加入购物车按钮
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发商品卡片的点击事件
            addToCart(product.id);
        });
        
        // 将商品卡片添加到网格中
        productsGrid.appendChild(productCard);
    });
}

// ========== 显示商品详情 ==========
// 在模态框中显示选中商品的详细信息
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productDetailContent = document.getElementById('product-detail-content');
    const productModal = document.getElementById('product-modal');
    
    // 创建商品详情HTML
    productDetailContent.innerHTML = `
        <div class="product-detail">
            <div class="detail-img">
                
                <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='images/default-product.jpg';this.onerror=null;">
            </div>
            <div class="detail-info">
                <h2 class="detail-title">${product.name}</h2>
                <div class="detail-price">¥${product.price.toFixed(2)}</div>
                <p class="detail-desc">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">加入购物车</button>
            </div>
        </div>
    `;
    
    // 为详情页的加入购物车按钮添加事件
    const detailAddToCartBtn = productDetailContent.querySelector('.add-to-cart');
    detailAddToCartBtn.addEventListener('click', () => {
        addToCart(product.id);
        productModal.style.display = 'none';
    });
    
    // 显示商品详情模态框
    productModal.style.display = 'flex';
}

// ========== 添加到购物车 ==========
// 将商品添加到购物车数组，并更新页面显示
function addToCart(productId, quantity = 1) {
    // 在商品数组中查找对应的商品
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // 检查购物车中是否已存在该商品
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // 如果已存在，增加数量
        existingItem.quantity += quantity;
    } else {
        // 如果不存在，添加新商品到购物车
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            icon: product.icon
        });
    }
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 显示添加成功的通知
    showNotification(`已添加"${product.name}"到购物车`);
}

// ========== 更新购物车数量显示 ==========
// 计算购物车中商品总数并更新页面上的显示
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    
    // 使用reduce方法计算商品总数
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // 更新页面上的购物车数量显示
    cartCount.textContent = totalItems;
}

// ========== 显示购物车 ==========
// 在模态框中显示购物车内容
// ========== 显示购物车 ==========
// 在模态框中显示购物车内容
function showCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartModal = document.getElementById('cart-modal');
    
    // 检查购物车是否为空
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 30px;">购物车是空的</p>';
        cartTotalPrice.textContent = '¥0.00';
    } else {
        // 清空购物车内容区域
        cartItems.innerHTML = '';
        let totalPrice = 0;
        
        // 遍历购物车中的每个商品
        cart.forEach(item => {
            // 计算当前商品的总价
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            // 查找商品的图片URL
            const product = products.find(p => p.id === item.id);
            const imageUrl = product ? product.imageUrl : 'images/default-product.jpg';
            
            // 创建购物车商品HTML
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='images/default-product.jpg';this.onerror=null;">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">¥${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
                <button class="quantity-btn remove" data-id="${item.id}">删除</button>
            `;
            
            // 为删除按钮添加事件
            const removeBtn = cartItem.querySelector('.remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromCart(item.id);
            });
            
            // 将商品添加到购物车列表
            cartItems.appendChild(cartItem);
        });
        
        // 更新总价显示
        cartTotalPrice.textContent = `¥${totalPrice.toFixed(2)}`;
    }
    
    // 显示购物车模态框
    cartModal.style.display = 'flex';
}

// ========== 从购物车移除商品 ==========
// 从购物车数组中移除指定商品
function removeFromCart(productId) {
    // 过滤掉指定id的商品
    cart = cart.filter(item => item.id !== productId);
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 重新显示购物车（刷新购物车内容）
    showCart();
    
    // 显示移除成功的通知
    showNotification('已从购物车移除商品');
}

// ========== 显示通知 ==========
// 在页面右上角显示临时通知消息
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: bold;
    `;
    notification.textContent = message;
    
    // 将通知添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除通知
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}