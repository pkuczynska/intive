if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready()
}

function ready() {
    var removeCartItems = document.getElementsByClassName('btn-danger');
    for (var i = 0; i < removeCartItems.length; i++) {
        var button = removeCartItems[i];
        button.addEventListener('click', removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButton = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButton.length; i++) {
        var button = addToCartButton[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    showShopItem()
}

function purchaseClicked() {
    alert("Thank you for shopping!");
    var cartItmes = document.getElementsByClassName('cart-items')[0];
    while (cartItmes.hasChildNodes()) {
        cartItmes.removeChild(cartItmes.firstChild);
    }
    updateCartTotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    addItemToCart(title, price);
    updateCartTotal();
}

function addItemToCart(title, price, image) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    //var cartItemName = cartItems.getElementsByClassName('cart-item-title');
    // for(var i = 0; i < cartItemName.length; i++){
    // 	if (cartItemName[i].innerText == title){
    // 		alert("The pizza is already in the basket");
    // 		return 
    // 	}
    // }
    var cartRowContent = `
		<div class="cart-item cart-column">
			<span class="cart-item-title">${title}</span>
        	
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContent;
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);

    var cartItemName = cartItems.getElementsByClassName('cart-item-title');
    if (cartItemName.length = 1) {
        total();
    }

}

function updateCartTotal() {
    var cartItemsContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemsContainer.getElementsByClassName('cart-row');
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerHTML.replace('$', ''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerHTML = '$' + total;
}

function total() {
    var cartTotal = document.getElementsByClassName('cart-total-title')[0];
    var cartRowContent = "Total";
    cartTotal.innerHTML = cartRowContent;
}

function showShopItem() {
    const url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json';
    async function getData() {
        response = await fetch(url);
        data = await response.json();
        var item = document.getElementsByClassName('shop-item');
        for (var i = 0; i < item.length; i++) {
            var title = data[i].title;
            var price = data[i].price;
            var ingredients = data[i].ingredients;
            var image = data[i].image;
            document.getElementsByClassName('shop-item-title')[i].textContent = title;
            document.getElementsByClassName('shop-item-price')[i].textContent = '$' + price;
            document.getElementsByClassName('shop-item-ingredients')[i].textContent = 'Ingredients: ' + ingredients;
            document.getElementsByClassName('shop-item-image')[i].src = image;
        }
    }
    getData();
}