const Joi =require('joi')
const Sequelize =require('sequelize')
const Hapi = require('hapi');
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const port = process.env.PORT || 3001;
const server = new Hapi.Server(
  {
    port
  }
);


(async () => {
  if (!process.env.POSTGRES_HOST) {
    throw Error(
      "process.env.POSTGRES_HOST must be a: user:pass@ipService:port ",
    );
  }
  const sequelize = new Sequelize(
    `postgres://${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB || "TrueToSizeData"}`
  );
  await sequelize.authenticate();
  console.log("postgres is running");

  const TrueToSizeData = sequelize.define("TrueToSizeData", {
    product_id: Sequelize.INTEGER,
    size_fit: Sequelize.INTEGER,
  });

  await TrueToSizeData.sync({ force: true });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Node.js with Postgres Example - Viktor Orlov",
          version: "1.0",
      },
      }
  },
  ]);

  server.route([
    {
      method: "GET",
      path: "/tts/{id}",
      handler: (req) => {
        const tts = sequelize.query('SELECT sum("size_fit")/count(*)::float AS tts FROM "TrueToSizeData" WHERE product_id = ' + req.params.id + ';', {model: TrueToSizeData})
        return tts;
      },
      config: {
        description: "List All TrueToSizeData",
        notes: "TrueToSizeData from database",
        tags: ["api"],
        validate: {
          params: {
            id: Joi.number().integer().required(),
          },
        },
      },
    },
    {
      method: "POST",
      path: "/tts",
      config: {
        handler: (req) => {
          const { payload } = req;
          return TrueToSizeData.create(payload);
        },
        description: "Create a TrueToSizeData",
        notes: "create a TrueToSizeData",
        tags: ["api"],
        validate: {
          payload: {
            product_id: Joi.number().integer().required(),
            size_fit: Joi.number().integer().greater(0).less(6).required(),
          },
        },
      },
    },

    {
      method: "DELETE",
      path: "/tts/{id}",
      config: {
        handler: (req) => {
          return TrueToSizeData.destroy({ where: { id: req.params.id } });
        },
        description: "Delete a TrueToSizeData",
        notes: "Delete a TrueToSizeData",
        tags: ["api"],
        validate: {
          params: {
            id: Joi.number().integer().required(),
          },
        },
      },
    },
  ]);

  await server.start();
  console.log("server running at", server.info.port);
})();
