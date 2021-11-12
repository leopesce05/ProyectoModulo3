//Llamando lo utilizado para express.
const express = require("express");
const app = express();
const port = 4000;
app.use(express.json());
//Llamando la app del frontend.

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//CONECTANDO A LA BASE DE DATOS
const URL = "mongodb://localhost:27017/DBProyecto";
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const conexion = mongoose.connection;

//Mensaje de confirmacion de la conexion
conexion.once("open", () => {
  console.log("Conexion a la base de datos con exitos");
});
conexion.on("error", (err) => {
  console.log("error al conectar a la BD");
});

//Iniciando servidor

app.listen(port, () => {
  console.log(`El servidor se inicio en: http://localhost:${port}`);
});

//IMPORTAMOS MODELOS

const ListCancion = require("./models/canciones");
const ListUser = require("./models/user");
const { findByIdAndUpdate } = require("./models/canciones");

//Pagina principal


app.get('/', (req, res) => {
  res.send("hello")
})
//Obtencion de USUARIOS

app.get("/users", (req, res) => {
  ListUser.find()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("Error al consultar datos...", err.message);
    });
});

//AGREGAR USUARIO

app.post("/users", (req, res) => {
  const usuario = new ListUser({
    info: {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      edad: req.body.edad,
    },
  });
  usuario.save().then((doc) => {
    console.log("dato agregado correctamente...");
  });
  res.json({ response: "succes" });
});

//MODIFICAR USUARIO

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  ListUser.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        info: {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          email: req.body.email,
          edad: req.body.edad,
        },
      },
    }
  )
    .then((doc) => {
      res.json({ response: "Succes" });
    })
    .catch((err) => {
      console.log("Error al actualizar los datos", err.message);
      res.json({ response: "Error Failed" });
    });
});

// ELIMINAR USUARIO
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  ListUser.findByIdAndDelete({ _id: id })
    .then((doc) => {
      res.json({ response: "succes" });
    })
    .catch((err) => {
      console.log("Error al eliminar datos ", err.message);
      res.json({ response: "Failed" });
    });
});

//OBTENCION DE CANCIONES
app.get("/canciones", (req, res) => {
  ListCancion.find()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("Error al consultar datos...", err.message);
    });
});

//AGREGAR CANCION
app.post("/canciones", (req, res) => {
  const cancion = new ListCancion({
    name: req.body.name,
    album: req.body.album,
    duration: req.body.duration,
    artist: req.body.artist,
  });
  cancion.save().then((doc) => {
    console.log("cancion agregada correctamente...");
  });
  res.json({ response: "succes" });
});

//MODIFICAR CANCION
app.put("/canciones/:id", (req, res) => {
  const id = req.params.id;
  ListCancion.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        album: req.body.album,
        duration: req.body.duration,
        artist: req.body.artist,
      },
    }
  )
    .then((doc) => {
      res.json({ response: "Succes" });
    })
    .catch((err) => {
      console.log("Error al actualizar los datos", err.message);
      res.json({ response: "Error Failed" });
    });
});

//ELIMINAR CANCION
app.delete("/canciones/:id", (req, res) => {
  const id = req.params.id;
  ListCancion.findByIdAndDelete({ _id: id })
    .then((doc) => {
      res.json({ response: "succes" });
    })
    .catch((err) => {
      console.log("Error al eliminar datos ", err.message);
      res.json({ response: "Failed" });
    });
});


//..pruebas..
app.get("/fav/:id", async (req, res) => {
      const usuario = await ListUser.findById(req.params.id)
      var favoritos = await usuario.info.favs;
      var songsData=[];
      for (var i=0; i<favoritos.length; i++) {
        const cancion = await ListCancion.findById(favoritos[i]);
        songsData.push(cancion);
      }
      res.json(songsData);
});

//AGREGAR A FAVORITO USUARIO
app.post("/fav/:idusuario/:idcancion", (req, res) => {
  ListUser.findById(req.params.idusuario).then((doc) => {
    var fav = doc.info.favs;
    fav.push(req.params.idcancion);
    ListUser.findOneAndUpdate(
      { _id: req.params.idusuario },
      {
        $set: {
          info: {
            nombre: doc.info.nombre,
            apellido: doc.info.apellido,
            email: doc.info.email,
            edad: doc.info.edad,
            favs: fav,
          },
        },
      }
    )
      .then((doc) => {
        res.json({ response: "succes" });
      })
      .catch((err) => {
        console.log("Error al agregar favorito ", err.message);
        res.json({ response: "Failed" });
      });
  });
});

//ELIMINAR A FAVORITO DE USUARIO
app.delete("/fav/:idusuario/:idcancion", (req, res) => {
  ListUser.findById(req.params.idusuario).then((doc) => {
    var fav = doc.info.favs;
    var i = fav.indexOf(req.params.idcancion);
    fav.splice(i, 1);
    ListUser.findOneAndUpdate(
      { _id: req.params.idusuario },
      {
        $set: {
          info: {
            nombre: doc.info.nombre,
            apellido: doc.info.apellido,
            email: doc.info.email,
            edad: doc.info.edad,
            favs: fav,
          },
        },
      }
    )
      .then((doc) => {
        res.json({ response: "succes" });
      })
      .catch((err) => {
        console.log("Error al eliminar favoritos ", err.message);
        res.json({ response: "Failed" });
      });
  });
});

// Letra de la resolucion de api.

// Mostrar toda la lista de usuarios.
// Agregar, modificar y eliminar usuarios.
// Agregar, modificar y eliminar canciones.
// Agregar y eliminar canciones a favoritos de un usuario.
