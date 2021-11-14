function getUserInfo(nickname) {
    return $.ajax({
        method: 'GET',
        url: 'https://cwd-monitoring.herokuapp.com/get-acc/' + nickname,
        dataType: 'json',
        success: data => {
            console.log(data)
            $('#info').html(data.account.login);
            $('#info1').html(data.account.id);
            $('#info2').html(data.account.cwd_balance);
            console.log(data.operations);
            console.log(Object.values(data.contacts));
            var contacts = '';
            Object.values(data.contacts).forEach(e=>{
                contacts +=('<p>' + e + '</p>');
            })
            console.log(contacts);
            $('#info6').html(contacts);
            var table = '';
            var txt = '';
            var accept = '';
            for (let i = 0; i < data.operations.length; i++) {
                var oper = data.operations[i];
                oper.fee.asset_id = currencyConvert(oper.fee.asset_id);
                if (oper.operation == 'Создание ордера на обмен'){
                    oper.sell.asset_id = currencyConvert(oper.sell.asset_id);
                    oper.receive.asset_id = currencyConvert(oper.receive.asset_id);
                    table +=
                        '<tr>' +
                        '<td>' + oper.operation + '</td>' +
                        '<td>' + oper.fee.amount + '</td>' +
                        '<td>' + oper.fee.asset_id +'</td>' +
                        '<td>' + oper.sell.amount + '</td>' +
                        '<td>' + oper.sell.asset_id + '</td>' +
                        '<td>' + oper.receive.amount + '</td>' +
                        '<td>' + oper.receive.asset_id + '</td>' +
                        '</tr>';
                }
                else if (oper.operation == 'Перевод'){
                    oper.amount.asset_id = currencyConvert(oper.amount.asset_id);
                    oper.from = clientReplace(oper.from, data);
                    oper.to = clientReplace(oper.to, data);
                    txt +=
                        '<tr>' +
                        '<td>' + oper.operation + '</td>' +
                        '<td>' + oper.fee.amount + '</td>' +
                        '<td>' + oper.fee.asset_id +'</td>' +
                        '<td>' + oper.amount.amount + '</td>' +
                        '<td>' + oper.amount.asset_id + '</td>' +
                        '<td>' + oper.from + '</td>' +
                        '<td>' + oper.to + '</td>' +
                        '</tr>';
                }
                else if (oper.operation == 'Подтверждение заявки на обмен'){
                    oper.amount.asset_id = currencyConvert(oper.amount.asset_id);
                    oper.client = clientReplace(oper.client, data);
                    oper.reciever = clientReplace(oper.reciever, data);
                    accept +=
                        '<tr>' +
                        '<td>' + oper.operation + '</td>' +
                        '<td>' + oper.fee.amount + '</td>' +
                        '<td>' + oper.fee.asset_id +'</td>' +
                        '<td>' + oper.amount.amount + '</td>' +
                        '<td>' + oper.amount.asset_id + '</td>' +
                        '<td>' + oper.price/(10 ** (8)) + '</td>' +
                        '<td>' + oper.client + '</td>' +
                        '<td>' + oper.reciever + '</td>' +
                        '</tr>';
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

function currencyConvert(id) {
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