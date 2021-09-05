
const PingCommand = require('./ping.js');
const InfoCommand = require('./info.js');
const CotacaoCommand = require('./cotacao.js');
//o arquivo como index.js pode ser chamado pelo require só usando o nome da pasta
//assim, ele vai buscar nessa pasta o arquivo index.js
// é uma forma que usa para exportar varias coisas da pasta de uma só vez
// ah entendi é basicamente isso que rola no .json.
module.exports = {
    PingCommand
}