const app = require("./app");
require("dotenv").config();
require("./config/database").connect();
app.listen(Number(process.env.PORT), () => {
  console.log("***************** Server is initialized *****************");
});
