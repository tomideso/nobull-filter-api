module.exports = {
  apps: [
    {
      name: "nobull-filterapi",
      script: "dist/index.js",
      node_args: "-r dotenv/config",
      // instances  : 4,
      // exec_mode  : "cluster"
    },
  ],
};
