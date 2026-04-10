sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("thebookshop.controller.Main", {

        onInit: function() {
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
                        this.getOwnerComponent().getRouter().navTo("RouteView1");
                    }
                }.bind(this)
            });
        }
    });
});