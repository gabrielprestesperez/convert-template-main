const form = document.querySelector('form')
const amount = document.getElementById('amount');
const currency = document.getElementById('currency');
const footer = document.querySelector('main footer');
const description = document.getElementById('description');
const result = document.getElementById('result');

amount.addEventListener('input', () => {
    const hasCharacterRegex = /\D+/g;
    amount.value = amount.value.replace(hasCharacterRegex, "");
})

form.onsubmit = async (event) => {
    event.preventDefault();

    const valueCurrency = await getValueCurrency(currency.value);
    const price = Number(valueCurrency.bid).toFixed(2);

    switch (currency.value) {
        case "USD":
            convertCurrency(amount.value, price, 'US$');
            break;
        case "EUR":
            convertCurrency(amount.value, price, '€');
            break;
        case "GBP":
            convertCurrency(amount.value, price, '£');
            break;
    }
}

async function getValueCurrency(currency) {
    try {
        const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${currency}-BRL`);
        const data = await response.json();
        return data[`${currency}BRL`];
    } catch (error) {
        console.log(error)
        footer.classList.remove('show-result')
        toast("Não foi possível converter. Tente novamente mais tarde.", 'red');
    }
}

function convertCurrency(amount, price, symbol) {
    try {
        description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`

        let total = amount * price;

        if (isNaN(total)) {
            toast("Por favor, digite o valor corretamente para converter", 'red');
        }

        total = formatCurrencyBRL(total).replace("R$", "")

        result.textContent = `${total} Reais`

        footer.classList.add('show-result');

    } catch (error) {
        console.log(error)
        footer.classList.remove('show-result')
        toast("Não foi possível converter. Tente novamente mais tarde.", 'red');
    }
}

function formatCurrencyBRL(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
}

function toast(text, background) {
    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: background,
            color: "white",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}