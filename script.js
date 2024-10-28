// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAj-Z3JwZI1Kmvz1szGFPGQKb7eYow1AfY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "storemanagement-69735",
    storageBucket: "gs://storemanagement-69735.appspot.com",
    messagingSenderId: "191065166257",
    appId: "YOUR_APP_ID",
    databaseURL: "https://storemanagement-69735-default-rtdb.firebaseio.com"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  
  // Authentication
  function login() {
    auth.signInWithEmailAndPassword("test@example.com", "password").catch(console.error);
  }
  
  function logout() {
    auth.signOut();
  }
  
  auth.onAuthStateChanged(user => {
    document.getElementById("user-status").innerText = user ? `Logged in as ${user.email}` : "Logged out";
    fetchProducts();
  });
  
  // Fetch Products from Firebase
  async function fetchProducts() {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = ""; // Clear previous products
    try {
      const snapshot = await db.ref("products").once("value");
      const products = snapshot.val();
      for (const key in products) {
        const product = products[key];
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
          <button onclick="addToCart('${key}', ${product.price})">Add to Cart</button>
        `;
        productsContainer.appendChild(productCard);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  
  // Cart Operations
  const cart = {};
  
  function addToCart(productId, price) {
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price };
    } else {
      cart[productId].quantity += 1;
    }
    updateCart();
  }
  
  function updateCart() {
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    cartList.innerHTML = ""; // Clear previous cart items
    let total = 0;
    for (const id in cart) {
      const item = cart[id];
      const listItem = document.createElement("li");
      listItem.innerText = `Product ID: ${id}, Quantity: ${item.quantity}`;
      cartList.appendChild(listItem);
      total += item.quantity * item.price;
    }
    cartTotal.innerText = `Total: $${total}`;
  }
  