function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZHOFIO_EMPLOYEE_CDS/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}