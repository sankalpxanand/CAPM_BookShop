sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("thebookshop.controller.View1", {

        onInit: function() {
        },

        onAdminPressed: function() {
            // Store role in component model
            var oModel = new sap.ui.model.json.JSONModel({ role: "admin" });
            this.getOwnerComponent().setModel(oModel, "appState");

            // Navigate to Main
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onUserPressed: function() {
            // Store role in component model
            var oModel = new sap.ui.model.json.JSONModel({ role: "user" });
            this.getOwnerComponent().setModel(oModel, "appState");

            // Navigate to Main
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        }
    });
});