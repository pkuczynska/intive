'use strict'

const setLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const clearLocalStorage = () => {
    localStorage.clear()
}

const generateBasket = (first = null) => {
    if (!first) {
        document.getElementsByClassName('cart-items')[0].innerHTML = ''
    }
    const count = document.getElementsByClassName('cart-item-title')[0]
    const basket = getLocalStorage('basket')
    basket && basket.map(el => {
        addItemToCart(el.title, el.price, el.count)
        updateCartTotal()
    })
}

const purchaseFinish = () => {
    alert("Dziękujemy za zakupy!")
    const cartItmes = document.getElementsByClassName('cart-items')[0];
    while (cartItmes.hasChildNodes()) {
        cartItmes.removeChild(cartItmes.firstChild)
    }
    updateCartTotal()
    totalBack()
    clearLocalStorage()
}

const removeCartItem = (event) => {
    const buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal()

    const basket = getLocalStorage('basket')
    const getTitleCartItem = buttonClicked.parentElement.parentElement
    const titleCartItem = getTitleCartItem.getElementsByClassName('cart-item-title')[0].innerText
    let deletedElement
    basket.map(el => {
        if (titleCartItem === el.title) {
            deletedElement = basket.splice(basket.indexOf(el), 1)
            localStorage.removeItem(deletedElement)
            setLocalStorage('basket', basket)
        }
        if (basket.length === 0) {
            totalBack()
        }
    })
}

const quantityChanged = (event) => {
    let input = event.target;
    if (!(input.value) || input.value <= 0) {
        input.value = 1
    }
    const basket = getLocalStorage('basket')
    let count
    const getTitleCartItem = input.parentElement.parentElement
    const titleCartItem = getTitleCartItem.getElementsByClassName('cart-item-title')[0].innerText
    const basketCount = []
    basket.map(el => {
        count = el.count
        if (titleCartItem === el.title) {
            count = Number(input.value)
        }
        basketCount.push({
            title: el.title,
            price: el.price,
            count: count,
        })
        setLocalStorage('basket', basketCount)
    })
    updateCartTotal()
}

const addItemToBasket = (event) => {
    const button = event.target
    const shopItem = button.parentElement.parentElement
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    const getActualLocalStorage = getLocalStorage('basket')
    if (!getActualLocalStorage) {
        const tempData = []
        tempData.push({
            title: title,
            price: price,
            count: 1,
        })
        setLocalStorage('basket', tempData)
    } else {
        let countFirst = false
        getActualLocalStorage.forEach(el => {
            if (title === el.title) {
                el.count += 1
                countFirst = true
            }
        })
        if (!countFirst) {
            getActualLocalStorage.push({
                title: title,
                price: price,
                count: 1,
            })
        }
        setLocalStorage('basket', getActualLocalStorage)
    }
    generateBasket()
}

const addItemToCart = (title, price, count) => {
    const cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    const cartItems = document.getElementsByClassName('cart-items')[0]
    const itemTitle = document.getElementsByClassName('shop-item-title')
    const cartItemName = cartItems.getElementsByClassName('cart-item-title')
    Array.from(cartItemName).map((el, index) => {
        if (el.textContent === title) {
            let quantityElement = cartItems.getElementsByClassName('cart-quantity-input')[index]
            quantityElement.value = parseInt(quantityElement.value) + 1
        }
    })
    const cartRowContent = `
        <div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
            
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="${count}">
            <button class="btn btn-removeItemCard" type="button">Usuń</button>
        </div>`
    cartRow.innerHTML = cartRowContent
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-removeItemCard')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    if (cartItemName.length >= 1) total()
}

const updateCartTotal = () => {
    const basket = getLocalStorage('basket')
    let total = 0
    Array.from(basket).map((el) => {
        let price = el.price
        price = price.replace(' zł', '');
        let quantity = el.count
        total = total + (price * quantity)
    })
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].textContent = total + ' zł'
}

const total = () => {
    const cartTotal = document.getElementsByClassName('cart-total-title')[0]
    const cartRowContent = "Do zapłaty:"
    cartTotal.textContent = cartRowContent
}
const totalBack = () => {
    const cartTotal = document.getElementsByClassName('cart-total-title')[0]
    const cartRowContent = "Głodny? Zamów pizze!"
    cartTotal.textContent = cartRowContent
    document.getElementsByClassName('cart-total-price')[0].textContent = ""

}

const showShopItem = async () => {
    const url = 'https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json'
    const response = await fetch(url)
    let data = await response.json()
    return data
}

const filter = () => {
    const input = document.getElementById("filtr")
    let filter = input.value
    filter = filter.split(',')
    const list = document.getElementsByClassName("shop-item")
    Array.from(list).map((el) => {
        el.remove()
    })
    showShopItem().then((res) => {
        let filteredList = res.filter((value) => {
            return JSON.stringify(value.ingredients).includes(JSON.stringify(filter))
        });
        handlePizza(filteredList)
        eventItemToBasket()

    })  
}


const sortByTitle = () => {
    const list = document.getElementsByClassName("shop-item")
    Array.from(list).map((el) => {
        el.remove()
    })
    showShopItem().then((res) => {
        res.sort((a, b) => {
            if (a.title < b.title)
                return -1;
            if (a.title > b.title)
                return 1;
            return 0;

        })
        handlePizza(res)
        eventItemToBasket()
    })
}

const sortByTitleReverse = () => {
    const list = document.getElementsByClassName("shop-item")
    Array.from(list).map((el) => {
        el.remove()
    })
    showShopItem().then((res) => {
        res.sort((a, b) => {
            if (a.title > b.title)
                return -1;
            if (a.title < b.title)
                return 1;
            return 0;

        })
        handlePizza(res)
        eventItemToBasket()
    })
}

const sortPrice = () => {
    const list = document.getElementsByClassName("shop-item")
    Array.from(list).map((el) => {
        el.remove()
    })
    showShopItem().then((res) => {
        res.sort((a, b) => {
            if (a.price < b.price)
                return -1;
            if (a.price > b.price)
                return 1;
            return 0;

        })
        handlePizza(res)
        eventItemToBasket()
    })
}

const sortPriceReverse = () => {
    const list = document.getElementsByClassName("shop-item")
    Array.from(list).map((el) => {
        el.remove()
    })
    showShopItem().then((res) => {
        res.sort((a, b) => {
            if (a.price > b.price)
                return -1;
            if (a.price < b.price)
                return 1;
            return 0;

        })
        handlePizza(res)
        eventItemToBasket()
    })
}


const removeBasket = () => {
    const cartItmes = document.getElementsByClassName('cart-items')[0];
    while (cartItmes.hasChildNodes()) {
        cartItmes.removeChild(cartItmes.firstChild)
    }
    updateCartTotal()
    totalBack()
    clearLocalStorage()
}

const generatePizza = (image, title, ingredients, price) => {
    return `<div class="shop-item"> 
                  <img src="${image}" class="shop-item-image" alt="album 1"/>
                  <div class="shop-item-details"> 
                     <span class="shop-item-title"> 
                         ${title}
                     </span>
                      <div class="row"> 
                         <span class="shop-item-ingredients"> 
                             ${ingredients} 
                          </span> 
                          <span class="shop-item-price"> 
                              ${price} 
                          </span> 
                      </div> 
                      <div class="row"> 
                          <button class="btn btn-primary shop-item-button" type="button">Dodaj pizze</button> 
                      </div>
                  </div> 
              </div>`
}

const generateIngredients = (data) => {
    let text = ''
    if (data) {
        data.map((el, index) => {
            if (index === data.length - 1) text += el
            else text += el + ', '
        })
    }
    return text
}

const handlePizza = (data) => data.map(el => {
    const placePizza = document.getElementsByClassName('shop-items')[0]
    placePizza.innerHTML += generatePizza(el.image, el.title, generateIngredients(el.ingredients), el.price + ' zł')
})

const eventItemToBasket = () => {
    const addToCartButton = document.getElementsByClassName('shop-item-button')
    Array.from(addToCartButton).map((el) => {
        el.addEventListener('click', (el) => addItemToBasket(el))
    })
}

document.addEventListener('DOMContentLoaded', () => {
    sortByTitle()
    showShopItem().then((res) => {
        if (res) {
            //handlePizza(res)
            document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseFinish)
            document.getElementsByClassName('remove-basket')[0].addEventListener('click', removeBasket)
            document.getElementsByClassName('sort-by-title')[0].addEventListener('click', sortByTitle)
            document.getElementsByClassName('sort-by-title-reverse')[0].addEventListener('click', sortByTitleReverse)
            document.getElementsByClassName('sort-by-price')[0].addEventListener('click', sortPrice)
            document.getElementsByClassName('sort-by-price-reverse')[0].addEventListener('click', sortPriceReverse)
            const removeCartItems = document.getElementsByClassName('btn-removeItemCard')
            Array.from(removeCartItems).map((el) => {
                el.addEventListener('click', (e) => removeCartItems(e))
            })
            const quantityInputs = document.getElementsByClassName('cart-quantity-input')
            Array.from(quantityInputs).map((el) => {
                el.addEventListener('change', (e) => quantityChanged(e))
            })
            eventItemToBasket()
        }
        generateBasket(true)
    })
})