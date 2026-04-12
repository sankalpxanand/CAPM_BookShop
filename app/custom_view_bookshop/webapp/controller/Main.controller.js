sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("thebookshop.controller.Main", {

        onInit: function() {
            // Restore full state from localStorage on page refresh
            var sRole = localStorage.getItem("userRole");
            if (sRole) {
                var oModel = new JSONModel({
                    role: sRole,
                    name: localStorage.getItem("userName"),
                    email: localStorage.getItem("userEmail"),
                    phone: localStorage.getItem("userPhone")
                });
                this.getOwnerComponent().setModel(oModel, "appState");
            }

            this.getOwnerComponent().getRouter()
                .getRoute("RouteMain")
                .attachPatternMatched(this._onMainMatched, this);
        },

        _onMainMatched: function() {
            var oAppState = this.getOwnerComponent().getModel("appState");
            var sRole = oAppState ? oAppState.getProperty("/role") : "";

            // Show/hide nav items based on role
            setTimeout(function() {
                this.byId("addBookNav").setVisible(sRole === "admin");
                this.byId("placeOrderNav").setVisible(sRole === "user");
            }.bind(this), 50);
        },

        onCollapseExpandPress: function() {
            var oSideNavigation = this.byId("sideNavigation");
            oSideNavigation.setExpanded(!oSideNavigation.getExpanded());
        },

        onAddBookPressed: function() {
            this.getOwnerComponent().getRouter().navTo("RouteAddBook");
        },

        onViewBooksPressed: function() {
            this.getOwnerComponent().getRouter().navTo("RouteViewBooks");
        },

        onPlaceOrderPressed: function() {
            this.getOwnerComponent().getRouter().navTo("RoutePlaceOrder");
        },

        onViewOrdersPressed: function() {
            this.getOwnerComponent().getRouter().navTo("RouteViewOrders");
        },

        onLogoutPressed: function() {
            MessageBox.confirm("Are you sure you want to logout?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        localStorage.removeItem("userRole");
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userEmail");
                        localStorage.removeItem("userPhone");
                        this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
                    }
                }.bind(this)
            });
        }
    });
});