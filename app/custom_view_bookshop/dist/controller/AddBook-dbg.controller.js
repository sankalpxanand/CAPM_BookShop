sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("thebookshop.controller.AddBook", {

        onInit: function() {
        },

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onSubmit: function() {
            var title = this.byId("title").getValue();
            var author = this.byId("author").getValue();
            var price = parseFloat(this.byId("price").getValue());
            var stock = parseInt(this.byId("stock").getValue());
            var location = this.byId("location").getValue();
            var genre = this.byId("genre").getValue();

            if (!title.trim()) {
                MessageBox.error("Title cannot be empty");
                return;
            }
            if (!price || price <= 0) {
                MessageBox.error("Price must be greater than zero");
                return;
            }
            if (stock === undefined || stock < 0) {
                MessageBox.error("Stock cannot be negative");
                return;
            }

            var oModel = this.getView().getModel();
            var oContext = oModel.bindList("/Books").create({
                "title": title,
                "author": author,
                "price": price,
                "stock": stock,
                "location": location,
                "genre": genre
            });

            oContext.created().then(() => {
                MessageBox.success("Book added successfully!");
                this.getView().getModel().refresh();
                this.byId("title").setValue("");
                this.byId("author").setValue("");
                this.byId("price").setValue("");
                this.byId("stock").setValue("");
                this.byId("location").setValue("");
                this.byId("genre").setValue("");
            }).catch((err) => {
                MessageBox.error("Error adding book: " + err.message);
            });
        }
    });
});