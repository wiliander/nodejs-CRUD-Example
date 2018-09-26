var arquivo = require("fs");

function openPage (callback) {

    arquivo.readFile('paginas/cadastroaluno.html', function (err, html) {
        return callback(html);
    });
  }

module.exports = {
    openPage
}