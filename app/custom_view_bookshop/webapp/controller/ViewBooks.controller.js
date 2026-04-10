sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageBox, Fragment, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("thebookshop.controller.ViewBooks", {

        onInit: function () {
            console.log("View books controller called");
        },

        onActionPressed: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            this._oSelectedContext = oContext;

            if (!this._oActionSheet) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "thebookshop.view.ActionSheet",
                    controller: this
                }).then(function (oActionSheet) {
                    this._oActionSheet = oActionSheet;
                    // Pass appState model to fragment
                    this._oActionSheet.setModel(
                        this.getOwnerComponent().getModel("appState"), "appState"
                    );
                    this.getView().addDependent(this._oActionSheet);
                    this._oActionSheet.openBy(oButton);
                }.bind(this));
            } else {
                // Update appState model every time it opens
                this._oActionSheet.setModel(
                        this.getOwnerComponent().getModel("appState"), "appState"
                );
                this._oActionSheet.openBy(oButton);
            }
        },

        onDeletePress: function () {
            var oContext = this._oSelectedContext;
            var sBookId = oContext.getProperty("ID");
            MessageBox.confirm("Are you sure you want to delete book ID: " + sBookId + "?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oContext.delete("$direct").then(function () {
                            MessageBox.success("Book deleted successfully");
                        }).catch(function (oError) {
                            MessageBox.error("Error deleting book: " + oError);
                        });
                    }
                }
            });
        },

        onEditPress: function () {
            var oData = this._oSelectedContext.getObject();
            this.getOwnerComponent().getRouter().navTo("RouteEditBook", {
                bookId: oData.ID
            });
        },

        onOrderPress: function () {
            var oData = this._oSelectedContext.getObject();
            this.getOwnerComponent().getRouter().navTo("RoutePlaceOrder", {
                bookId: oData.ID
            });
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
    });
});