import express from "express";
import { createConnection } from "mysql";
import cors from "cors";
import { z } from "zod";
const serve = express();

// serve.use(cors());

// Schema

const zodScheme = z.object({
  name: z.string({
    required_error: "Campo requerido",
  }),
  lastName: z.string(),
  age: z.number().int().min(18),
});

// Database connection

// let connection = createConnection({
//   host: "localhost",
//   user: "root",
//   password: "29760953",
//   database: "prueba",
// });

// connection.connect((err) => {
//   if (err) {
//     console.log(`Error ${err}`);
//     return;
//   }

//   console.log("connected as id " + connection.threadId);
// });

// code

serve.disable("X-Powered-By");

serve.use(express.json());

const port = process.env.PORT ?? 1234;

// serve.use((req, res, next) => {
//   if (
//     req.method === "POST" &&
//     req.header("content-type").includes("application/json")
//   )
//     console.log(req.method, req.body, req.header("content-type"));
//   next();
// });

let dataRick = [
  {
    name: "Rick Sanchez",
    planeta: "Tierra",
    age: "70",
  },
  {
    name: "Morty Smith",
    planeta: "Tierra",
    age: "14",
  },
  {
    name: "Summer Smith",
    planeta: "Tierra",
    age: "17",
  },
  {
    name: "Beth Smith",
    planeta: "Tierra",
    age: "34",
  },
  {
    name: "Jerry Smith",
    planeta: "Tierra",
    age: "34",
  },
  {
    name: "Abadango Cluster Princess",
    planeta: "Abadango",
    age: "300",
  },
  {
    name: "Abradolf Lincler",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Adjudicator Rick",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Agency Director",
    planeta: "Tierra",
    age: "Unknown",
  },
  {
    name: "Alan Rails",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Albert Einstein",
    planeta: "Tierra",
    age: "76",
  },
  {
    name: "Alexander",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Alien Googah",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Alien Morty",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Alien Rick",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Amish Cyborg",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Annie",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Antenna Morty",
    planeta: "N/A",
    age: "Unknown",
  },
  {
    name: "Antenna Rick",
    planeta: "N/A",
    age: "Unknown",
  },
];

serve.get("/usuarios", (req, res) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://practi-dev-qkkq.4.us-1.fl0.io/"
  );
  res.status(200).send(dataRick);
});

serve.get("/usuario/:id", (req, res) => {
  let { id } = req.params;
  connection.query(`SELECT * FROM prueba WHERE id = ${id}`, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }

    res.status(200).send(data);
  });
});

serve.get("/usuario", (req, res) => {
  let { name } = req.query;
  connection.query(
    `SELECT * FROM prueba WHERE name = '${name}'`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }

      res.status(200).send(data);
    }
  );
});

serve.post("/postea", (req, res) => {
  console.log(req.body);

  let result = zodScheme.safeParse(req.body);

  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  let sql = `INSERT INTO prueba(name, lastName, age) VALUES('${result.data.name}', '${result.data.lastName}', '${result.data.age}')`;

  connection.query(`INSERT INTO prueba SET ?`, result.data, (err) => {
    if (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        message: err.sqlMessage,
      });
      return;
    }

    res.status(201).json({
      status: true,
    });
  });

  // res.status(201).send("posted " + req.body.name);
});

serve.patch("/postea/:id", (req, res) => {
  const { id } = req.params;
  let result = zodScheme.partial().safeParse(req.body); // el partial sirve para validar si viene el dato y si no viene, no lo hace.
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  const sql = `UPDATE prueba SET name = '${result.data.name}', age = ${result.data.age}, lastName = '${result.data.lastName}' WHERE id = ${id}`;

  connection.query(sql, (err) => {
    if (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        message: err.sqlMessage,
      });
      return;
    }

    res.status(202).json({
      status: true,
    });
  });
});

serve.delete("/postea/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.send("hola");
});

serve.options("/postea/:id", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Origin", "http://localhost:1234");
  res.send("hola");
});

//para poder utilizar PUT, PATCH y DELETE tengo que agregarle un metodo 'options' para saber que verbo http puedo utilizar en la api.

serve.use((req, res) => {
  res.status(404).send("<h1>404 not found</h1>");
});

serve.listen(port);
