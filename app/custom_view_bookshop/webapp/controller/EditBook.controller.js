sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("thebookshop.controller.EditBook", {

        onInit: function() {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteEditBook")
                .attachPatternMatched(this._onEditBookMatched, this);
        },

        _onEditBookMatched: function(oEvent) {
            var sBookId = oEvent.getParameter("arguments").bookId;
            if (sBookId) {
                this._loadBookDetails(sBookId);
            }
        },

        _loadBookDetails: function(sBookId) {
            var oModel = this.getView().getModel();
            var oBinding = oModel.bindList("/Books");
            var aFilters = [new Filter("ID", FilterOperator.EQ, sBookId)];
            oBinding.filter(aFilters);

            oBinding.requestContexts().then((aContexts) => {
                if (aContexts.length > 0) {
                    var oBook = aContexts[0].getObject();
                    this.byId("itemCode").setValue(oBook.ID);
                    this.byId("title1").setValue(oBook.title);
                    this.byId("author1").setValue(oBook.author);
                    this.byId("price1").setValue(oBook.price);
                    this.byId("stock1").setValue(oBook.stock);
                    this.byId("location1").setValue(oBook.location);
                    this.byId("genre1").setValue(oBook.genre);
                } else {
                    MessageBox.error("Book not found");
                }
            }).catch((err) => {
                MessageBox.error("Error loading book: " + err);
            });
        },

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteViewBooks");
        },

        onUpdate: function() {
            var itemCode = this.byId("itemCode").getValue();
            var title = this.byId("title1").getValue();
            var author = this.byId("author1").getValue();
            var price = parseFloat(this.byId("price1").getValue());
            var stock = parseInt(this.byId("stock1").getValue());
            var location = this.byId("location1").getValue();
            var genre = this.byId("genre1").getValue();

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
            var sPath = "/Books('" + itemCode + "')";
            var oContext = oModel.bindContext(sPath).getBoundContext();

            var oView = this.getView();
            oView.setBusy(true);

            oContext.setProperty("title", title);
            oContext.setProperty("author", author);
            oContext.setProperty("price", price);
            oContext.setProperty("stock", stock);
            oContext.setProperty("location", location);
            oContext.setProperty("genre", genre);

            oModel.submitBatch("auto").then(() => {
                oView.setBusy(false);
                oModel.refresh();
                MessageBox.success("Book updated successfully!");
            }).catch((err) => {
                oView.setBusy(false);
                MessageBox.error("Error updating book: " + err);
            });
        }
    });
});