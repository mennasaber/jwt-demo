require("dotenv").config();
const app = require("./app");
require("./config/database").connect();
app.listen(Number(process.env.PORT), () => {
  console.log("***************** Server is initialized *****************");
});
