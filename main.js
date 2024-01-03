// Html'den gelenler
const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");

// html'nin yüklenme anı
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

// yaptığımız isteklerin yamamında bulunur
const baseUrl = "https://api.escuelajs.co/api/v1";

// Kategori bilgilerini alma
// 1-Api'ye istek at
// 2-gelen veriyi işle
// 3-gelen verileri kart şeklinde ekrana basacak fonksiyonu çalıştır
// cevap hatalı olursa kullanıcıyı bilgilendir.

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    // eğerki cevap olumlu gelirse çalışır
    .then((res) => res.json())
    // veri json formatına dönüşünce çalışır
    .then((data) => {
      renderCategories(data.slice(1, 5));
    })
    // cevapta bir hata varsa err çalışır
    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  // kategoriler dizisindeki her bir obje için ekrana kart basma
  categories.forEach((category) => {
    // 1-div oluşturma
    const categoryDiv = document.createElement("div");

    // 2-div'e class ekleme
    categoryDiv.classList.add("category-card");
    // 3-div'in içeriğini belirleme
    categoryDiv.innerHTML = `
        <img src="https://picsum.photos/640/640?r=4713" />
        <p>${category.name}</p>
        `;
    // 4-elemanı htmlde categories diviine ekleme
    categoryList.appendChild(categoryDiv);
  });
}

// Ürünler için istek at

async function fetchProducts() {
  try {
    // İstek atar
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 25));
  } catch (err) {
    // Hata olursa yakalar
    console.log(err);
  }
}
// Ürünleri ekrana basar
function renderProducts(products) {
  // Her bir ürün için kart HTML'i oluştur ve diziye aktar

  const productsHTML = products
    .map(
      (product) => `
<div class="card">
          <img src="https://picsum.photos/640/640?r=4719"/>
          <h4>${product.title}</h4>
          <h4>${product.category.name ? product.category.name : "Diğer"}</h4>
    <div class="action">
 <span>${product.price} &#8378;</span> 
<button onclick="addToBasket({id:${product.id},title:'${
        product.title
      }' ,price:${product.price}, img:'${
        product.images[0]
      }' ,amount:1})">Sepete Ekle</button>
    </div>
</div>
`
    )
    // dizi şeklindeki veriyi virgülleri kaldırarak stringe dönüştürür.
    .join(" ");

  // ürünler html'sini listeye gönder
  productsArea.innerHTML = productsHTML;
}

// Sepet değişkenleri
let basket = [];
let total = 0;
//! Modal işlemleri

basketBtn.addEventListener("click", () => {
  // sepeti açma
  modal.classList.add("active");
  // sepete ürün listeleme
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  // sepeti  kapatma
  modal.classList.remove("active");
});

//! Sepet işlemleri

function addToBasket(product) {
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    // elemn sepette var  > miktarı arttır
    found.amount++;
  } else {
    // eleman sepette yok > sepete ekle
    basket.push(product);
  }
}

// Sepete Elemanı Listeleme
function renderBasket() {
  // Kaartları oluşturma
  const cardsHTML = basket
    .map(
      (product) => `
  <div class="item">
            <img src="https://picsum.photos/640/640?r=8459" />
            <h3 class="title">${product.title}</h3>
            <h4 class="price">${product.price} &#8378;</h4>
            <p>${product.amount}</p>
            <img onclick = "deleteItem(${product.id})" id="delete" src="images/trash.png" />
          </div>
  `
    )
    .join(' ');

  // Hazırladığımım kartları HTML'e gönderme
  basketList.innerHTML = cardsHTML;
  // sepete toplamı ayarlama
  calculateTotal();
}


// sepete toplamı ayarlama
function calculateTotal() {
// Toplam fiyatı hesaplama
const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

// Ürün miktarını hesaplama 
const amount = basket.reduce((sum, i) => sum + i.amount ,0);
// Miktarı html'e gönderme
totalCount.innerText = amount + ' ' + 'ürün';

// toplam edğeri html' e gönderme
totalSpan.innerHTML = sum;
}

// Sepettem ürünü silme
function deleteItem(deleteid){
  // Kaldırılacak ürün dışındak, bütün ürünleri al
  basket = basket.filter((i) => i.id !== deleteid);
//  Listeyi güncelle
renderBasket();

// Toplamı güncelle
calculateTotal();
}