const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cool = require("cool-ascii-faces");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

/* express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("app"))
  .get("/cool", (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

 */

mongoose.connect(
  "mongodb+srv://sampletest:test-123@cluster0.hqxub.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const listSchema = {
  name: String,
};
const listmodel = mongoose.model("item", listSchema);
const item1 = new listmodel({
  name: "Welcome to your to do list",
});
const item2 = new listmodel({
  name: "Hit + to add your item",
});
const item3 = new listmodel({
  name: "Hit to delete an item",
});
const defaultitems = [item1, item2, item3];
app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  listmodel.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      listmodel.insertMany(defaultitems, function (err) {
        if (err) {
          console.log("Error exists");
        } else {
          console.log("Successfully inserted items");
          res.redirect("/");
        }
      });
    }
    var day = today.toLocaleDateString("en-US", options);
    res.render("list", { listTitle: day, newlistItem: foundItems });
  });
});
app.post("/", function (req, res) {
  var itemName = req.body.newItem;
  let item = new listmodel({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});
app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  listmodel.findByIdAndRemove(checkedItem, function (err) {
    if (err) {
      console.log("Error in deleting items");
    } else {
      console.log("successfully deleted items");
      res.redirect("/");
    }
  });
});
app.get("/work", function (req, res) {});
app.get("/:queryparam", function (req, res) {
  let sampleparam = req.params.queryparam;
  res.render("dynamic", { paramlist: sampleparam });
});

/* let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);*/
app.listen(PORT, function () {
  console.log("server is up and running ");
}); 
