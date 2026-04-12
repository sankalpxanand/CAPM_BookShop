sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("thebookshop.controller.Main", {

        onInit: function() {
            // Restore role from localStorage on page refresh
            var sRole = localStorage.getItem("userRole");
            if (sRole) {
                var oModel = new sap.ui.model.json.JSONModel({ role: sRole });
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
                this.byId("adminGroup").setVisible(sRole === "admin");
                this.byId("placeOrderNav").setVisible(sRole === "user");
            }.bind(this), 0);
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
                        this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
                    }
                }.bind(this)
            });
        }
    });
});