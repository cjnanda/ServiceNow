var AppUtils = Class.create();
AppUtils.prototype = {
    initialize: function() {
    },

    type: 'AppUtils'
};

AppUtils.sleep = function(val){
	var endNum = new GlideDateTime().getNumericValue() + val;
	var num =  new GlideDateTime().getNumericValue();

	while(num < endNum){
		num =  new GlideDateTime().getNumericValue();

	}

}