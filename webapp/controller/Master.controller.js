sap.ui.define([
	"com/sap/training00/HOFIOCDSMaster/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/generic/app/navigation/service/NavigationHandler"
], function (Controller, MessageBox, Filter, FilterOperator, Fragment, JSONModel, NavigationHandler) {
	"use strict";

	return Controller.extend("com.sap.training00.HOFIOCDSMaster.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.training00.HOFIOCDSMaster.view.Master
		 */
		onInit: function () {
			this.getRouter().getRoute("Master").attachPatternMatched(this._onPatternMatched, this);

			if (sap.ushell && sap.ushell.Container) {
				let oPersonalizationService = sap.ushell.Container.getService("Personalization");
				let oComponent = sap.ui.core.Component.getOwnerComponentFor(this.getView());
				let oScope = {
					keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
					writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
					clientStorageAllowed: true
				};

				let oData = {
					container: "SmartFilterBar",
					item: "filter"
				};

				this.oPersonalizer = oPersonalizationService.getPersonalizer(oData, oScope, oComponent);

				let oFilt = this.getView().byId("master_smartfilterbar");
				this.oNavigationHelper = new NavigationHandler(this);
				this.readAppState(this.oNavigationHelper, this, oFilt);
				this.getPersonalization(this.oPersonalizer, oFilt);
			}

		},

		_onPatternMatched: function () {
			let sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage(),
				oLanguageModel = new JSONModel({
					currentLanguage: sCurrentLocale
				});

			oLanguageModel.attachPropertyChange(function (oProperty) {
				let oLanguage = oProperty.getParameter("value"),
					sFormatLocale = sap.ui.getCore().getConfiguration().getFormatLocale();

				sap.ui.getCore().getConfiguration().setLanguage(oLanguage);
				sap.ui.getCore().getConfiguration().setFormatLocale(sFormatLocale);
			});

			this.setModel(oLanguageModel, "languageModel");
		},

		_navigate: function (sParameter) {
			let oNavigationService = null;

			if (sap.ushell && sap.ushell.Container) {
				oNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
				let oTarget = {
					target: {
						semanticObject: "ZHOFIO",
						action: "display"
					},
					params: {
						"customerID": sParameter
					}
				};
				var aTarget = [oTarget];

				oNavigationService.isNavigationSupported(aTarget).done(function (aResponses) {
					if (aResponses[0].supported) {
						oNavigationService.toExternal(oTarget);
					} else {
						MessageBox.error(this.geti18nText("msgbox.shell.error"));
					}
				});

			} else {
				MessageBox.error(this.geti18nText("msgbox.shell.error"));
			}
		},

		onCustomerPress: function (oEvent) {
			let sCustomerID = oEvent.getSource().getBindingContext().sPath.split("'")[1];

			this._navigate(sCustomerID);
		},

		onNewCustomerPress: function (oEvent) {
			this._navigate("create");
		},

		onDeleteCustomerPress: function (oEvent) {
			let sCustomerPath = oEvent.getSource().getBindingContext().sPath,
				oTable = this.getView().byId("master_smarttable");

			this.deleteODataEntry(this.getModel(), sCustomerPath, null, oTable);
		},

		onSearch: function (oEvent) {
			let oFilt = this.oView.byId("master_smartfilterbar");
			if (sap.ushell && sap.ushell.Container) {
				this.setAppState(this.oNavigationHelper, oFilt);
				this.setPersonalization(this.oPersonalizer, oFilt);
			}
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.training00.HOFIOCDSMaster.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.training00.HOFIOCDSMaster.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.training00.HOFIOCDSMaster.view.Master
		 */
		//	onExit: function() {
		//
		//	}

	});

});