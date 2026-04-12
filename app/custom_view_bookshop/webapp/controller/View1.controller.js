sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("thebookshop.controller.View1", {

        onInit: function() {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteView1")
                .attachPatternMatched(this._onView1Matched, this);
        },

        _onView1Matched: function() {
            // Reset appState when landing on home page
            var oModel = new JSONModel({ role: "" });
            this.getOwnerComponent().setModel(oModel, "appState");
        },

        onAdminPressed: function() {
            // Store role in component model
            var oModel = new sap.ui.model.json.JSONModel({ role: "admin" });
            this.getOwnerComponent().setModel(oModel, "appState");
            localStorage.setItem("userRole", "admin");

            // Navigate to Main
            setTimeout(function() {
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            }.bind(this), 100);
        },

        onUserPressed: function() {
            // Store role in component model
            var oModel = new sap.ui.model.json.JSONModel({ role: "user" });
            this.getOwnerComponent().setModel(oModel, "appState");
            localStorage.setItem("userRole", "user");

            // Navigate to Main
            setTimeout(function() {
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            }.bind(this), 100);
        }
    });
});