const list_endpoints = require("express-list-endpoints");
const health = require("express-ping");
const express = require("express");

class RootController {
  constructor(app = express()) {
    this._app = app;
    this._health = health;

    this.setup_health_route();
    this.setup_list_endpoint_route();
  }

  setup_health_route() {
    this._app.use("/", this._health.ping("/health"));
  }

  setup_list_endpoint_route() {
    this._app.use("/list", (req, res) => {
      res.status(200).json(list_endpoints(this._app));
    });
  }
}

module.exports = RootController;