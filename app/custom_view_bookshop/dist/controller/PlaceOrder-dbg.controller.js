sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("thebookshop.controller.PlaceOrder", {

        onInit: function() {
            this.getOwnerComponent().getRouter()
                .getRoute("RoutePlaceOrder")
                .attachPatternMatched(this._onPlaceOrderMatched, this);
        },

        _onPlaceOrderMatched: function(oEvent) {
            var sBookId = oEvent.getParameter("arguments").bookId;
            if (sBookId) {
                // Pre-select book if coming from ViewBooks
                var oSelect = this.byId("orderBookSelect");
                var oBinding = oSelect.getBinding("items");

                if (oBinding && oSelect.getItems().length > 0) {
                    this._preselectBook(sBookId);
                } else {
                    oSelect.getBinding("items").attachEventOnce("dataReceived", function() {
                        this._preselectBook(sBookId);
                    }.bind(this));
                }
            }
        },

        _preselectBook: function(sBookId) {
            var oSelect = this.byId("orderBookSelect");
            var aItems = oSelect.getItems();
            var oMatch = aItems.find(function(item) {
                return item.getKey() === sBookId;
            });
            if (oMatch) {
                oSelect.setSelectedItem(oMatch);
            }
        },

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onSubmitOrder: function() {
            var oSelect = this.byId("orderBookSelect");
            var oSelectedItem = oSelect.getSelectedItem();
            var bookId = oSelectedItem ? oSelectedItem.getKey() : null;
            var quantity = parseInt(this.byId("orderQuantity").getValue());

            if (!bookId) {
                MessageBox.error("Please select a book");
                return;
            }

            if (!quantity || quantity <= 0) {
                MessageBox.error("Please enter a valid quantity greater than zero");
                return;
            }

            var oModel = this.getView().getModel();
            var oContext = oModel.bindList("/Orders").create({
                "book_ID": bookId,
                "quantity": quantity
            });

            oContext.created().then(() => {
                MessageBox.success("Order placed successfully!");
                this.getView().getModel().refresh();
                this.byId("orderQuantity").setValue("");
            }).catch((err) => {
                MessageBox.error("Error placing order: " + err.message);
            });
        }
    });
});