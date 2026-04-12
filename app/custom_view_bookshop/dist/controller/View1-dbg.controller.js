sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], (Controller, JSONModel, MessageBox, Fragment) => {
    "use strict";

    return Controller.extend("thebookshop.controller.View1", {

        onInit: function() {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteView1")
                .attachPatternMatched(this._onView1Matched, this);
        },

        _onView1Matched: function() {
            var sRole = localStorage.getItem("userRole");
            if (sRole) {
                localStorage.removeItem("userRole");
            }
            var oModel = new JSONModel({ role: "" });
            this.getOwnerComponent().setModel(oModel, "appState");
        },

        // =====================
        // ADMIN BUTTON PRESSED
        // =====================
        onAdminPressed: function() {
            if (!this._oAdminLoginFragment) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "thebookshop.view.AdminLogin",
                    controller: this
                }).then(function(oDialog) {
                    this._oAdminLoginFragment = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                // Clear fields before opening
                this.byId("adminEmail").setValue("");
                this.byId("adminPassword").setValue("");
                this._oAdminLoginFragment.open();
            }
        },

        onAdminLoginSubmit: function() {
            var sEmail = this.byId("adminEmail").getValue();
            var sPassword = this.byId("adminPassword").getValue();

            if (!sEmail.trim()) {
                MessageBox.error("Please enter your email");
                return;
            }
            if (!sPassword.trim()) {
                MessageBox.error("Please enter your password");
                return;
            }

            var oModel = this.getView().getModel();
            var oAction = oModel.bindContext("/adminLogin(...)");
            oAction.setParameter("email", sEmail);
            oAction.setParameter("password", sPassword);

            oAction.execute().then(function() {
                var oResult = oAction.getBoundContext().getObject();
                var oAppState = new JSONModel({
                    role: "admin",
                    ID: oResult.ID,
                    name: oResult.name,
                    email: oResult.email,
                    phone: oResult.phone
                });
                this.getOwnerComponent().setModel(oAppState, "appState");
                localStorage.setItem("userRole", "admin");
                localStorage.setItem("userName", oResult.name);
                localStorage.setItem("userEmail", oResult.email);
                localStorage.setItem("userPhone", oResult.phone);
                this._oAdminLoginFragment.close();
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            }.bind(this)).catch(function(oError) {
                MessageBox.error(oError.message || "Invalid email or password");
            });
        },

        onAdminLoginCancel: function() {
            this._oAdminLoginFragment.close();
        },

        // =====================
        // USER BUTTON PRESSED
        // =====================
        onUserPressed: function() {
            if (!this._oUserAuthFragment) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "thebookshop.view.UserAuth",
                    controller: this
                }).then(function(oDialog) {
                    this._oUserAuthFragment = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                // Clear fields before opening
                this._clearUserAuthFields();
                this._oUserAuthFragment.open();
            }
        },

        onTabSelect: function(oEvent) {
            var sKey = oEvent.getParameter("key");
            var oSubmitBtn = this.byId("userAuthSubmitBtn");
            if (sKey === "login") {
                oSubmitBtn.setText("Login");
            } else {
                oSubmitBtn.setText("Sign Up");
            }
        },

        onUserAuthSubmit: function() {
            var oTabBar = this.byId("authTabBar");
            var sKey = oTabBar.getSelectedKey();
            if (sKey === "login") {
                this._doUserLogin();
            } else {
                this._doUserSignup();
            }
        },

        _doUserLogin: function() {
            var sEmail = this.byId("userLoginEmail").getValue();
            var sPassword = this.byId("userLoginPassword").getValue();

            if (!sEmail.trim()) {
                MessageBox.error("Please enter your email");
                return;
            }
            if (!sPassword.trim()) {
                MessageBox.error("Please enter your password");
                return;
            }

            var oModel = this.getView().getModel();
            var oAction = oModel.bindContext("/userLogin(...)");
            oAction.setParameter("email", sEmail);
            oAction.setParameter("password", sPassword);

            oAction.execute().then(function() {
                var oResult = oAction.getBoundContext().getObject();
                this._setUserAppState(oResult);
                this._oUserAuthFragment.close();
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            }.bind(this)).catch(function(oError) {
                MessageBox.error(oError.message || "Invalid email or password");
            });
        },

        _doUserSignup: function() {
            var sName = this.byId("userSignupName").getValue();
            var sPhone = this.byId("userSignupPhone").getValue();
            var sEmail = this.byId("userSignupEmail").getValue();
            var sPassword = this.byId("userSignupPassword").getValue();
            var sConfirmPassword = this.byId("userSignupConfirmPassword").getValue();

            if (!sName.trim() || !sPhone.trim() || !sEmail.trim() || !sPassword.trim()) {
                MessageBox.error("All fields are required");
                return;
            }

            if (sPassword !== sConfirmPassword) {
                MessageBox.error("Passwords do not match");
                return;
            }

            var oModel = this.getView().getModel();
            var oAction = oModel.bindContext("/userSignup(...)");
            oAction.setParameter("name", sName);
            oAction.setParameter("phone", sPhone);
            oAction.setParameter("email", sEmail);
            oAction.setParameter("password", sPassword);

            oAction.execute().then(function() {
                var oResult = oAction.getBoundContext().getObject();
                this._setUserAppState(oResult);
                this._oUserAuthFragment.close();
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            }.bind(this)).catch(function(oError) {
                MessageBox.error(oError.message || "Error during signup");
            });
        },

        _setUserAppState: function(oResult) {
            var oAppState = new JSONModel({
                role: "user",
                ID: oResult.ID,
                name: oResult.name,
                email: oResult.email,
                phone: oResult.phone
            });
            this.getOwnerComponent().setModel(oAppState, "appState");
            localStorage.setItem("userRole", "user");
            localStorage.setItem("userName", oResult.name);
            localStorage.setItem("userEmail", oResult.email);
            localStorage.setItem("userPhone", oResult.phone);
        },

        _clearUserAuthFields: function() {
            this.byId("userLoginEmail").setValue("");
            this.byId("userLoginPassword").setValue("");
            this.byId("userSignupName").setValue("");
            this.byId("userSignupPhone").setValue("");
            this.byId("userSignupEmail").setValue("");
            this.byId("userSignupPassword").setValue("");
            this.byId("userSignupConfirmPassword").setValue("");
        },

        onUserAuthCancel: function() {
            this._oUserAuthFragment.close();
        }
    });
});