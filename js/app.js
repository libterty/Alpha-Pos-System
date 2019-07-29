const alphaPos = new AlphaPos();

const switchCategoryBtn = document.querySelector('.container')
switchCategoryBtn.addEventListener('click', (e) => {
    if (e.target.matches('#bverage-tab')) {
        document.getElementById('bverage').style.display = 'block';
        document.getElementById('snack').style.display = 'none';
    } else if (e.target.matches('#snack-tab')) {
        document.getElementById('bverage').style.display = 'none';
        document.getElementById('snack').style.display = 'block';
    }
});

const addButton = document.querySelectorAll('[data-alpha-pos]');
for (let i = 0; i < addButton.length; i++) {
    addButton[i].addEventListener('click', (e) => {
        if (e.target === addButton[3]) {
            const drinkName = alphaPos.getCheckedValue('drink');
            const ice = alphaPos.getCheckedValue('ice');
            const sugar = alphaPos.getCheckedValue('sugar');
            if (!drinkName) {
                alert('Please choose at least one item.');
                return;
            }
            const drink = new Drink(drinkName, sugar, ice);
            alphaPos.addDrink(drink);
        } else if (e.target === addButton[4]) {
            const snackName = alphaPos.getCheckedValue('snack');
            const spicy = alphaPos.getCheckedValue('spicy');
            if (!snackName) {
                alert('Please choose at least one item.');
                return;
            }
            const snack = new Snack(snackName, spicy);
            alphaPos.addSnack(snack);
        }
    })
};

const orderLists = document.querySelector('[data-order-lists]');
orderLists.addEventListener('click', function(e) {
    let isDeleteButton = e.target.matches('[data-alpha-pos="delete-item"]');
    if (!isDeleteButton) {
        return;
    }
    alphaPos.deleteDrink(e.target.parentElement.parentElement.parentElement);
});

const clearAllButton = document.querySelector('[data-alpha-pos="clearorder"]');
clearAllButton.addEventListener('click', function() {
    let isOrderConfirm = confirm('Make sure to clear all order?');
    if (isOrderConfirm) {
        alphaPos.clearOrder(orderLists);
    }
});

const processPayment = document.querySelector('.payment');
processPayment.addEventListener('click', (e) => {
    if (e.target.matches('#cancel-purchase')) {
        alphaPos.cancelBill();
    }
});

const checkoutButton = document.querySelector('[data-alpha-pos="checkout"]');
checkoutButton.addEventListener('click', function() {
    alert(`Total amount of drinks：$${alphaPos.checkout()}`);
    let isOrderConfirm = confirm('Make sure to checkout?');
    if (isOrderConfirm) {
        alphaPos.generateBillContent();
        alphaPos.generateBill();
    }
});

function AlphaPos() {}
AlphaPos.prototype.getCheckedValue = function(inputName) {
    let selectedOption = '';
    document.querySelectorAll(`[name=${inputName}]`).forEach(function(item) {
        if (item.checked) {
            selectedOption = item.value;
        }
    })
    return selectedOption;
};

AlphaPos.prototype.addDrink = function(drink) {
    let orderListsCard = `
    <div class="card mb-3">
    <div class="card-body pt-3 pr-3">
      <div class="text-right">
        <span data-alpha-pos="delete-item">×</span>
      </div>
      <h6 class="card-title mb-1">${drink.name}</h6>
      <div class="card-text">${drink.ice}</div>
      <div class="card-text">${drink.sugar}</div>
    </div>
    <div class="card-footer text-right py-2">
      <div class="card-text text-muted">$ <span data-item-price>${drink.price()}</span></div>
    </div>
  </div>
  `;

    orderLists.insertAdjacentHTML('afterbegin', orderListsCard);
};

AlphaPos.prototype.addSnack = function(snack) {
    let orderListsCard = `
    <div class="card mb-3">
    <div class="card-body pt-3 pr-3">
      <div class="text-right">
        <span data-alpha-pos="delete-item">×</span>
      </div>
      <h6 class="card-title mb-1">${snack.snack}</h6>
      <div class="card-text">${snack.spicy}</div>
    </div>
    <div class="card-footer text-right py-2">
      <div class="card-text text-muted">$ <span data-item-price>${snack.price()}</span></div>
    </div>
  </div>
  `;

    orderLists.insertAdjacentHTML('afterbegin', orderListsCard);
};

AlphaPos.prototype.deleteDrink = function(target) {
    target.remove();
};

AlphaPos.prototype.checkout = function() {
    let totalAmount = 0;
    document.querySelectorAll('[data-item-price]').forEach(function(drink) {
        totalAmount += Number(drink.textContent);
    })
    return totalAmount;
};

AlphaPos.prototype.clearOrder = function(target) {
    target.querySelectorAll('.card').forEach(function(card) {
        card.remove();
    })
};

const payForm = document.querySelector('.creditCardForm')
AlphaPos.prototype.generateBill = function() {
    switchCategoryBtn.classList.add('deactivatecontainer');
    payForm.style.display = 'grid';
    payForm.classList.add('activeCredit');
};

const checkoutFormDetail = document.getElementById('input-checkout');
AlphaPos.prototype.generateBillContent = function() {
    let htmlContent = '';
    let item = event.target.parentElement.parentElement.children;
    for (let i = 0; i < item.length - 1; i++) {
        htmlContent += `
            <tr>
                <td class="product-name">${item[i].children[0].children[1].textContent}</td>
                <td class="produt-price">${item[i].children[1].children[0].children[0].textContent}</td>
            </tr>
        `;
        checkoutFormDetail.innerHTML = htmlContent;
    }
    document.getElementById('stotal').textContent = alphaPos.checkout();
}

AlphaPos.prototype.cancelBill = function() {
    switchCategoryBtn.classList.remove('deactivatecontainer');
    payForm.style.display = 'none';
    payForm.classList.remove('activeCredit');
    document.forms[0].reset();
};

function Drink(name, sugar, ice) {
    this.name = name;
    this.sugar = sugar;
    this.ice = ice;
};

function Snack(name, spicy) {
    this.snack = name;
    this.spicy = spicy;
};

Drink.prototype.price = function() {
    switch (this.name) {
        case 'Black Tea':
        case 'Oolong Tea':
        case 'Baozong Tea':
        case 'Green Tea':
            return 30;
        case 'Bubble Milk Tea':
        case 'Lemon Green Tea':
            return 50;
        case 'Black Tea Latte':
        case 'Matcha Latte':
            return 55;
        case 'Americano':
            return 60;
        case 'Caffee Latte':
            return 70;
        case 'Mocha':
        case 'Macchiato':
            return 75;
        default:
            alert('No this drink');
    }
};

Snack.prototype.price = function() {
    switch (this.snack) {
        case 'Hamburger':
        case 'Waffles':
        case 'Burrito':
        case 'Salad':
            return 70;
        case 'French Fries':
        case 'Pop corn':
        case 'Pan Cake':
        case 'Daily Soup':
            return 55;
        case 'Cheese Burger':
            return 75;
        case 'Double Cheese Burger':
            return 85;
        case 'Chicken Burrito':
        case 'Beef Burrito':
            return 75;
    }
};