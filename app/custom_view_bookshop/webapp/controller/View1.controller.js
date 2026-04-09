sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], (Controller, MessageBox, Fragment, MessageToast, Filter, FilterOperator,Sorter) => {
    "use strict";

    return Controller.extend("thebookshop.controller.View1", {
        onInit() {
        },

        onCollapseExpandPress: function() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},

        submit: function(){
            var title = this.getView().byId("title").getValue();
            var author = this.getView().byId("author").getValue();
            var price = this.getView().byId("price").getValue();
            var stock = this.getView().byId("stock").getValue();
            var location = this.getView().byId("location").getValue();
            var genre = this.getView().byId("genre").getValue();

            // Frontend validations
            if (!title.trim()) {
                MessageBox.error("Title cannot be empty");
                return;
            }

            if (!price || price <= 0) {
                MessageBox.error("Price must be greater than zero");
                return;
            }

            if (stock === undefined || stock < 0) {
                MessageBox.error("Stock cannot be negative");
                return;
            }

            var oModel = this.getView().getModel();

            var oContext = oModel.bindList("/Books").create({
                "title" : title,
                "author" : author,
                "price" : price,
                "stock" : stock,
                "location" : location,
                "genre" : genre 
            });
            oContext.created().then(() => {
                MessageBox.success("Book added successfully");
                this.getView().getModel().refresh()
                this.getView().byId("title").setValue(null);
                this.getView().byId("author").setValue(null);
                this.getView().byId("price").setValue(null);
                this.getView().byId("stock").setValue(null);
                this.getView().byId("location").setValue(null);
                this.getView().byId("genre").setValue(null);
            }).catch((err) => {
                MessageBox.error("Error adding new book");
                console.log("Error adding item: "+err);
            });
        },

        onAddBookPressed: function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel1");
            oPanel.setVisible(true);
        },

        onViewBookPressed: function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel2");
            oPanel.setVisible(true);
        },

        onEditBookPressed: function(){
            this.hideAllPanels();
            var oPanel = this.byId("Panel3");
            oPanel.setVisible(true);
        },

        hideAllPanels: function() {
            this.byId("Panel1").setVisible(false);
            this.byId("Panel2").setVisible(false);
            this.byId("Panel3").setVisible(false);
            this.byId("Panel4").setVisible(false);
            this.byId("Panel5").setVisible(false);
        },

        // for fragment functionality:
        onActionPressed: function(oEvent){
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            this._oSelectedContext = oContext;

            if(!this._oActionSheet){
                Fragment.load({
                    id: this.getView().getId(),
                    name: "thebookshop.view.ActionSheet",
                    controller: this
                }).then(function(oActionSheet){
                    this._oActionSheet = oActionSheet;
                    this.getView().addDependent(this._oActionSheet);
                    this._oActionSheet.openBy(oButton);
                }.bind(this));
            }
            else{
                this._oActionSheet.openBy(oButton);
            }
        },

        onDeletePress: function () {
            var oContext = this._oSelectedContext;
            var sBookId = oContext.getProperty("ID");
            MessageBox.confirm("Are you sure you want to delete the book with ID: "+ sBookId +"?",{
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(oAction){
                    if(oAction === MessageBox.Action.YES){
                        oContext.delete("$direct").then(function(){
                            MessageBox.success("Book ID: "+sBookId+" deleted successfully");
                        }).catch(function(oError){
                            MessageBox.error("Error deleting book ID: "+sBookId+". "+oError+" Please try again later.");
                        });
                    }
                }
            })
        },

        onEditPress: function () {
            var oData = this._oSelectedContext.getObject();
            MessageToast.show("Edit action for Book ID: "+oData.ID);
            this.onEditBookPressed();
            var product_model = this.getOwnerComponent().getModel();
            let aFilters = [
                new Filter("ID", FilterOperator.EQ, oData.ID)
            ];
            let oBinding = product_model.bindList("/Books");
            oBinding.filter(aFilters);

            oBinding.requestContexts().then((aContexts) => {
                if(aContexts.length > 0){
                    aContexts.forEach((oContext) => {
                        let oUser = oContext.getObject();
                        this.getView().byId("title1").setValue(oUser.title);
                        this.getView().byId("author1").setValue(oUser.author);
                        this.getView().byId("price1").setValue(oUser.price);
                        this.getView().byId("stock1").setValue(oUser.stock);
                        this.getView().byId("location1").setValue(oUser.location);
                        this.getView().byId("genre1").setValue(oUser.genre);
                        this.getView().byId("itemCode").setValue(oUser.ID);
                    });
                }
                else{
                    MessageBox.error("No book found with the specified ID");
                }
            }).catch((oError) => {
                MessageBox.error("Error retrieving book details: "+oError);
            });
        },

        updateItem: function () {
            var itemCode = this.getView().byId("itemCode").getValue();

            var title = this.getView().byId("title1").getValue();
            var author = this.getView().byId("author1").getValue();
            var price = this.getView().byId("price1").getValue();
            var stock = this.getView().byId("stock1").getValue();
            var location = this.getView().byId("location1").getValue();
            var genre = this.getView().byId("genre1").getValue();

            // Frontend validations
            if (!title.trim()) {
                MessageBox.error("Title cannot be empty");
                return;
            }

            if (!price || price <= 0) {
                MessageBox.error("Price must be greater than zero");
                return;
            }

            if (stock === undefined || stock < 0) {
                MessageBox.error("Stock cannot be negative");
                return;
            }

            var update_oModel = this.getView().getModel();
            var sPath = "/Books('"+itemCode+"')";
            var oContext = update_oModel.bindContext(sPath).getBoundContext();

            var oView = this.getView();
            function resetBusy(){
                oView.setBusy(false);
            }
            oView.setBusy(true);

            oContext.setProperty("title",title);
            oContext.setProperty("author",author);
            oContext.setProperty("price",price);
            oContext.setProperty("stock",stock);
            oContext.setProperty("location",location);
            oContext.setProperty("genre",genre);

            update_oModel.submitBatch("auto").then(function(){
                resetBusy();
                oView.getModel().refresh();
                MessageBox.success("Book details are updated successfully");
            }).catch(function(err){
                resetBusy();
                MessageBox.error("An error occured while updating the book: "+err);
            })
        },
        
        onPlaceOrderPressed: function() {
            this.hideAllPanels();
            var oPanel = this.byId("Panel4");
            oPanel.setVisible(true);
        },

        onViewOrdersPressed: function() {
            this.hideAllPanels();
            var oPanel = this.byId("Panel5");
            oPanel.setVisible(true);

            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");
            var oSorter = new Sorter("orderDate", true);
            oBinding.sort(oSorter);
        },

        onSubmitOrder: function() {
            var oSelect = this.getView().byId("orderBookSelect");
            var bookId = oSelect.getSelectedItem().getKey();
            var quantity = parseInt(this.getView().byId("orderQuantity").getValue());

            // Basic frontend validation
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
                // Clear the fields
                this.getView().byId("orderBookSelect").setValue(null);
                this.getView().byId("orderQuantity").setValue(null);
            }).catch((err) => {
                MessageBox.error("Error placing order: " + err.message);
                console.log("Error placing order: " + err);
            });
        },
        
        onOrderPress: function() {
            // Get selected book from context
            var oData = this._oSelectedContext.getObject();
            
            // Navigate to Place Order panel
            this.hideAllPanels();
            this.byId("Panel4").setVisible(true);

            // Pre-select the book in the dropdown
            var oSelect = this.byId("orderBookSelect");
            
            // Wait for select items to load then set selection
            oSelect.getBinding("items").attachEventOnce("dataReceived", function() {
                var aItems = oSelect.getItems();
                var oMatchingItem = aItems.find(function(item) {
                    return item.getKey() === oData.ID;
                });
                if (oMatchingItem) {
                    oSelect.setSelectedItem(oMatchingItem);
                }
            });

            // If items already loaded
            var aItems = oSelect.getItems();
            if (aItems.length > 0) {
                var oMatchingItem = aItems.find(function(item) {
                    return item.getKey() === oData.ID;
                });
                if (oMatchingItem) {
                    oSelect.setSelectedItem(oMatchingItem);
                }
            }
        },
    });
});