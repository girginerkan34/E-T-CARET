// fetch: api ye http istek atmamızı sağlar
// get : veri almaya yarar 
// put s: sunucuya veri göndermeye yarar 
// delete : bir veriyi silmeye yarar 

// get örneği yanlızca isteğimizi söylüyoruz.

function getUsers(){
    fetch("https://jsonplaceholder.typicode.com/users")
    // ya olumlu olur ve veri gelir
    .then((response) => response.json())
    .then((data) => renderUsers(data))
    // olumsuz olur ve hata mesajı gelir
    .catch((error) => console.log(error));
}

// fonksiyonu çağırıp isteği gerçekleştirme
getUsers();

function renderUsers(users) {
    users.forEach((user) => document.write(user.name + '<br>'));
}