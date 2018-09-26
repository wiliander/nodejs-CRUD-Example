//instancia da biblioteca express
var express = require('express');

//instancia da biblioteca body-parser (para decodificar requisição POST)
var bodyParser = require("body-parser");

//instancia do serviço de email
var emailService = require("./servicos/emailservice");

//instancia do alunoDAO (para realizar as operações de banco de dados)
var alunoDao = require("./dao/alunoDAO");
var cursoDao = require("./dao/cursoDAO");
var matriculaDao = require("./dao/matriculaDAO");

var app = express();

//instancia da biblioteca path (para trabahar com os caminhos do servidor)
var path = require("path");

//configuração para decodificar requisição POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuração da view engine para abrir paginas html
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//método responsável por abrir a pagina principal (index.html)
app.get('/', function (req, res) {
    res.render('index.html');
});

//método responsável por abrir a pagina de cadastro de aluno (cadastroaluno.html)
app.get('/cadastroaluno', function (req, res) {

    var idaluno = req.param('idaluno');

    alunoDao.findOne(function (aluno) {
        res.render('cadastroaluno.html', aluno);
    }, idaluno)
});

//método responsável por abrir a pagina listagem de alunos (listaalunos.html)
app.get('/listaralunos', function (req, res) {
    res.render('listaalunos.html');
});

//método responsável por consultar no banco de dados a lista de alunos
app.get('/carregaalunos', function (req, res) {

    alunoDao.findAll(function (retorno) {
        res.send({
            data: retorno
        });
    });
});

//método responsável por deletar um aluno
app.delete('/excluir', function (req, res) {

    var idAluno = req.body.id;

    alunoDao.excluir(function (err) {
        if (err) {
            res.send({
                status: false,
                msg: err
            });
        } else {
            res.send({
                status: true,
                msg: "Registro excluído com sucesso!"
            });
        }
    }, idAluno)
});

//método responsável por salvar um aluno
app.post('/salvar', function (req, res) {

    var aluno = {
        idaluno: req.body.idaluno,
        nome: req.body.nome,
        email: req.body.email,
        idade: req.body.idade,
        telefone: req.body.telefone
    }

    if (aluno.idaluno) {
        alunoDao.update(function (err) {
            return res.redirect('/listaralunos');
        }, aluno)
    } else {
        alunoDao.insert(function (err) {
            return res.redirect('/listaralunos');
        }, aluno)
    }

    // emailService.enviarEmail(function(){
    //     console.log('Email enviado com sucesso!')
    // }, email);
});

app.get('/cadastrocurso', function(req, res){

    var idcurso = req.param('idcurso');

    cursoDao.findOne(function(curso){
        res.render("cadastrocurso.html", curso);
    }, idcurso);
});

app.post('/salvarcurso', function(req, res){

    var curso = {
        idcurso: req.body.idcurso,
        nome: req.body.nome,
        descricao: req.body.descricao,
        numerovagas: req.body.numerovagas
    }

    console.log(curso);

    if (curso.idcurso) {
        cursoDao.update(function(err){
            console.log("passou aqui");
            return res.redirect('/listarcursos');
        }, curso);
    } else {
        cursoDao.insert(function (err) {
            return res.redirect('/listarcursos');
        }, curso)
    }
});

app.get('/listarcursos', function(req, res){
    res.render('listacursos.html');
})

app.get('/carregacursos', function (req, res) {

    cursoDao.findAll(function (retorno) {
        res.send({
            data: retorno
        });
    });
});

app.delete('/excluircurso', function (req, res) {

    var idCurso = req.body.id;

    cursoDao.excluir(function (err) {
        if (err) {
            res.send({
                status: false,
                msg: err
            });
        } else {
            res.send({
                status: true,
                msg: "Registro excluído com sucesso!"
            });
        }
    }, idCurso)
});

app.get('/cadastromatricula', function(req, res){

    var matricula = {
        idmatricula: '',
        datamatricula: dateToEN("03/08/2018"),
        aluno: '',
        curso: ''
    }

    console.log(matricula.datamatricula);

    res.render("cadastromatricula.html", matricula);
});

app.post('/salvarmatricula', function(){
    var matricula ={ 
        idmatricula: req.body.idmatricula,
        datamatricula: req.body.datamatricula,
        idaluno: req.body.idaluno,
        idcurso: req.body.idaluno
    };

    if(matricula.idmatricula){
        matriculaDao.update(function (err){
            //return res.redirect('/listarmatriculas');
        }, matricula)
    }else{
        matriculaDao.insert(function (err){
            //return res.redirect('/listarmatriculas');
        },matricula)
    }
});

function dateToEN(date)
{	
	return date.split('/').reverse().join('-');
}




//método responsável por subir o servidor em localhost:3000
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!');
});




