
const controller = require("../controllers/solve.controller");

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/solves",controller.getSolves);

  app.post("/solves/add", controller.addSolve)

  app.delete("/:id", controller.deleteSolve);

};