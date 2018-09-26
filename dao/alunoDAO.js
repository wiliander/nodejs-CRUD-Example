var pg = require("pg");

var config = {
    user: 'postgres',
    database: 'dbnode',
    password: 'postgres',
    port: 5432
};

var pool = new pg.Pool(config);

function findAll(callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            callback([]);
        }
        client.query('SELECT * FROM aluno', [], function (err, result) {
            debugger;
            if (err) {
                console.log(err);
                callback([])
            }
            callback(result.rows);
        });
    });
}

function excluir(callback, id) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            callback(err);
        }
        client.query('DELETE FROM aluno WHERE id_aluno = $1', [id], function (err, result) {
            debugger;
            if (err) {
                console.log(err);
                callback(err)
            }
            callback()
        });
    });
}

function insert(callback, aluno) {

    const sql = "INSERT INTO aluno(ds_nome, ds_email, telefone, idade) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [aluno.nome, aluno.email, aluno.telefone, aluno.idade];

    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Ocorreu um erro durante a conexão", + err);
            callback(err);
        }

        client.query(sql, values, function (err, res) {
            if (err) {
                console.log("Ocorreu um erro durante a operação" + err);
                callback(err);
            }

            callback();
        })
    })
}

function update(callback, aluno) {

    console.log(aluno);

    const sql = "UPDATE aluno " +
    "set ds_nome = $1, ds_email = $2, idade = $3, telefone = $4 "+
    "WHERE id_aluno = $5";
    const values = [aluno.nome, aluno.email, aluno.idade, aluno.telefone, aluno.idaluno];

    pool.connect(function (err, cliente, done) {

        if (err) {
            console.log("Ocorreu um erro na conexão");
            callback(err);
        }

        cliente.query(sql, values, function (err) {
            if (err) {
                console.log("Ocorreu um erro durante a operação");
                callback(err);
            }
            callback();
        })

    })
}

function findOne(callback, idaluno){

    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            callback(null);
        }
        client.query('SELECT * FROM aluno WHERE id_aluno = $1', [idaluno], function (err, result) {
            debugger;
            if (err) {
                console.log(err);
                callback(null)
            }

            var resultSet = result.rows[0];

            if(resultSet){
                var aluno = {
                    idaluno: resultSet.id_aluno,
                    nome: resultSet.ds_nome,
                    email: resultSet.ds_email,
                    idade: resultSet.idade,
                    telefone: resultSet.telefone
                }
                callback(aluno)
            }else{
                var aluno = {
                    idaluno: '',
                    nome: '',
                    email: '',
                    idade: '',
                    telefone: ''
                }
                callback(aluno)
            }
        });
    });
}

module.exports = {
    findAll,
    excluir,
    insert,
    update,
    findOne
}