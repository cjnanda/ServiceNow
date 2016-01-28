var AjaxHelper = Class.create();
AjaxHelper.prototype = {
    initialize: function() {
    },

    type: 'AjaxHelper'
};

AjaxHelper.getParameters = function(ajaxProcessor){
	var retVal = null;
	try{
		var parms = ajaxProcessor.getParameter("sysparm_json");
		if(parms != undefined && parms != ""){
			retVal = new global.JSON().decode(parms);
		}
	}catch(ex){
		gs.error(ex);
	}
	return retVal;
};

AjaxHelper.generateReturnValue = function(obj){
	var res = new global.JSON().encode(obj);
	gs.debug(res);
	return res;
};