function getUserInfo(nickname) {
    return $.ajax({
        method: 'GET',
        url: 'https://cwd-monitoring.herokuapp.com/get-acc/' + nickname,
        dataType: 'json',
        success: data => {
            $('#info').html(data.account.login);
            $('#info1').html(data.account.id);
            $('#info2').html(data.account.cwd_balance);
            var contacts = '';
            Object.values(data.contacts).forEach(e=>{
                contacts +=('<p>' + e + '</p>');
            })
            $('#info6').html(contacts);
            var table = '';
            var txt = '';
            var accept = '';
            for (let i = 0; i < data.operations.length; i++) {
                var oper = data.operations[i];
                if (oper.operation == 'Создание ордера на обмен'){
                    oper.sell.asset_id = currencyReplace(oper.sell.asset_id);
                    oper.receive.asset_id = currencyReplace(oper.receive.asset_id);
                    table += sellTable(oper);
                }
                else if (oper.operation == 'Перевод'){
                    oper.amount.asset_id = currencyReplace(oper.amount.asset_id);
                    oper.from = clientReplace(oper.from, data);
                    oper.to = clientReplace(oper.to, data);
                    txt += amountTable(oper);
                }
                else if (oper.operation == 'Создание заявки на обмен'){
                    oper.amount.asset_id = currencyReplace(oper.amount.asset_id);
                    oper.client = clientReplace(oper.client, data);
                    oper.receiver = clientReplace(oper.receiver, data);
                    accept += clientTable(oper);
                }
            }
            $('#info3').html(table);
            $('#info4').html(txt);
            $('#info5').html(accept);
        }
    })
}
function formHandler(event) {
    event.preventDefault();
    getUserInfo(event.currentTarget.elements.nickname.value);
}

function currencyReplace(id) {
    if (id == '1.3.0'){
        return 'CWD';
    }
    if (id == '1.3.55'){
        return 'PLEASURE'
    }
    return ('UNKNOWN' + id);
}

function clientReplace(id, {contacts, account}) {
    if (account.id == id){
        return account.login;
    }

    return contacts[id];
}
function sellTable(oper) {

    return('<tr>' +
        '<td>' + oper.operation + '</td>' +
        '<td>' + currencyConvert(oper.sell.asset_id,oper.sell.amount) + '</td>' +
        '<td>' + oper.sell.asset_id + '</td>' +
        '<td>' + currencyConvert(oper.receive.asset_id,oper.receive.amount) + '</td>' +
        '<td>' + oper.receive.asset_id + '</td>' +
        '</tr>');
}
function amountTable(oper) {
    return('<tr>' +
        '<td>' + oper.operation + '</td>' +
        '<td>' + currencyConvert(oper.amount.asset_id,oper.amount.amount) + '</td>' +
        '<td>' + oper.amount.asset_id + '</td>' +
        '<td>' + oper.from + '</td>' +
        '<td>' + oper.to + '</td>' +
        '</tr>');
}
function clientTable(oper) {
    return('<tr>' +
        '<td>' + oper.operation + '</td>' +
        '<td>' + currencyConvert(oper.amount.asset_id,oper.amount.amount) + '</td>' +
        '<td>' + oper.amount.asset_id + '</td>' +
        '<td>' + oper.price/(10 ** (8)) + '</td>' +
        '<td>' + oper.client + '</td>' +
        '<td>' + oper.receiver + '</td>' +
        '</tr>');
}
function currencyConvert(currency, amount) {
    if (currency == 'CWD'){
        return amount / (10 ** (5));
    }
    if (currency == 'PLEASURE'){
        return amount / (10 ** (4));
    }
    return (amount);
}
