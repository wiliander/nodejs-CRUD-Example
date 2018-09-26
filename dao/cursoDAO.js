var pg = require("pg");

var config = {
    user: 'postgres',
    database: 'dbnode',
    password: 'postgres',
    port: 5432,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function findAll(callback) {
    pool.connect(function (err, client, done)  {
        if (err) {
            console.log("not able to get connection " + err);
            callback([]);
        }
        client.query('SELECT * FROM curso', [], function (err, result) {
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
        client.query('DELETE FROM curso WHERE id_curso = $1', [id], function (err, result) {
            debugger;
            if (err) {
                console.log(err);
                callback(err)
            }
            callback()
        });
    });
}

function insert(callback, curso) {

    const sql = "INSERT INTO curso(ds_nome_curso, ds_descricao, nr_vagas) VALUES($1, $2, $3) RETURNING *";
    const values = [curso.nome, curso.descricao, curso.numerovagas];

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

function update(callback, curso) {

    console.log(curso);

    const sql = "UPDATE curso " +
    "set ds_nome = $1, ds_descricao = $2, nr_vagas = $3 "+
    "WHERE id_curso = $4";
    
    const values = [curso.nome, curso.descricao, curso.numerovagas, curso.idcurso];

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

function findOne(callback, idcurso){

    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            callback(null);
        }
        client.query('SELECT * FROM curso WHERE id_curso = $1', [idcurso], function (err, result) {
            debugger;
            if (err) {
                console.log(err);
                callback(null)
            }

            var resultSet = result.rows[0];

            if(resultSet){
                var curso = {
                    idcurso: resultSet.id_curso,
                    nome: resultSet.ds_nome,
                    descricao: resultSet.ds_descricao,
                    numerovagas: resultSet.nr_vagas
                }
                callback(curso)
            }else{
                var curso = {
                    idcurso: '',
                    nome: '',
                    descricao: '',
                    numerovagas: ''
                }
                callback(curso)
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