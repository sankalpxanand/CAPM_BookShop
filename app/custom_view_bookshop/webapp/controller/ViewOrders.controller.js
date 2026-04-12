sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Sorter, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("thebookshop.controller.ViewOrders", {

        onInit: function() {
            // Make appState available to this view
            var oAppState = this.getOwnerComponent().getModel("appState");
            if (oAppState) {
                this.getView().setModel(oAppState, "appState");
            }

            this.getOwnerComponent().getRouter()
                .getRoute("RouteViewOrders")
                .attachPatternMatched(this._onViewOrdersMatched, this);
        },

        _onViewOrdersMatched: function() { 
            // Refresh appState on view every time
            var oAppState = this.getOwnerComponent().getModel("appState");
            if (oAppState) {
                this.getView().setModel(oAppState, "appState");
            }

            this.getView().getModel().refresh();
            
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                // Get role and user ID from appState
                var sRole = oAppState ? oAppState.getProperty("/role") : "";
                var sUserId = oAppState ? oAppState.getProperty("/ID") : "";

                // Filter by user if role is user
                if (sRole === "user" && sUserId) {
                    var oFilter = new Filter("user_ID", FilterOperator.EQ, sUserId);
                    oBinding.filter([oFilter]);
                } else {
                    // Admin sees all orders
                    oBinding.filter([]);
                }

                // Sort orders by date descending every time page loads
                oBinding.sort(new Sorter("orderDate", true));
            }
        },

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        }
    });
});