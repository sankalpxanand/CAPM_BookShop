sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter"
], (Controller, Sorter) => {
    "use strict";

    return Controller.extend("thebookshop.controller.ViewOrders", {

        onInit: function() {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteViewOrders")
                .attachPatternMatched(this._onViewOrdersMatched, this);
        },

        _onViewOrdersMatched: function() {
            // Sort orders by date descending every time page loads
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.sort(new Sorter("orderDate", true));
            }
        },

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        }
    });
});