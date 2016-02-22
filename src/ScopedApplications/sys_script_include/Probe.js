/**
Author: Chris Nanda
Description:





**/

var Probe = Class.create();
Probe.prototype = {
    _probeGr: null,
    _eccGr: null,
    _properties: {},
    _parameters: {},
    _xmlDoc:null,
    _resultEccGr: null,
    initialize: function(pgr) {
        if(pgr !=  undefined && pgr != null){
            this._probeGr = pgr;
            this._init();
        }
             
    },
    _init: function(){
        if(this._probeGr != null && this._probeGr.isValidRecord()){
            this.setTopic(this._probeGr.getValue("ecc_queue_topic"));
            this.setName(this._probeGr.getValue("ecc_queue_name"));
            this.setSource(this._probeGr.getValue("ecc_queue_source"));
            this._addParametersValues(this._probeGr.sys_id.toString());
        }
    },
     
    setSource: function(value){
        this._properties["source"] = value;
    },
    getSource: function(){
        return this._properties["source"];
    },
     
    setTopic: function(value){
        this._properties["topic"] = value;
    },
    getTopic: function(){
        return this._properties["topic"];
    },
     
    setName: function(value){
        this._properties["name"] = value;
    },
    getName: function(){
        return this._properties["name"];
    },
    setAgent: function(value){
        this._properties["agent"] = "mid.server." + value;
    },
    getAgent: function(){
        return this._properties["agent"];
    },
     
    setPayload: function(value){
        this._properties["payload"] = value;
    },
     
    getPayload: function(){
         
        var payload = this._eccGr.getValue("payload");
        return payload;
    },
     
    setEccQueueRecord: function(val){
        this._eccGr = val;
    },
     
    setCorrelator: function(){
         
    },
     
     
     
    _addParametersToDocument: function(){
        this.addParameter("probe_name", this.getName());   
        this.addParameter("probe", this._probeGr.sys_id.toString());
         
         
        this._xmlDoc = new XMLDocument2();
        this._xmlDoc.parseXML("<parameters></parameters>");
        for (var prop in this._parameters) {
            var el = this._xmlDoc.createElement("parameter");
            el.setAttribute("name", prop);
            el.setAttribute("value", this._parameters[prop]);
        }
    },
    _addParametersValues: function(probeSysId) {
        var pgr = new GlideRecord("discovery_probe_parameter");
        pgr.addQuery("probe", probeSysId);
        pgr.query();
        while (pgr.next()) {
            var name = pgr.getValue("name");
            var value = pgr.getValue("value");
            //var v = processValueScript(pgr, values);
            //if (v != null && v != "")
            //  value = v;
            this.addParameter(name, value);
        }
    },
    addParameter: function(name, value){
        this._parameters[name] = value;
    },
     
    getParameter: function(name){
        if(this._parameters[name] == undefined || this._parameters[name] == null)
            return null;
        return this._parameters[name];
    },
     
     getProperty: function(key) {
        var obj = this._properties[key];
        if (obj != undefined && obj != null)
            return obj.toString();
        return "";
    },
     
    create: function(ms){
        var gr = new GlideRecord("ecc_queue");
        gr.queue = "output";
        if(ms != undefined && ms != null && ms != "")
             this.setAgent(ms)
        gr.agent = this.getAgent();
        gr.topic = this.getTopic();
        gr.name =  this.getName();
        gr.source= this.getSource();
        this._addParametersToDocument();
        if (this._xmlDoc != null) {
            fPayload = this._xmlDoc.toString();
            gr.payload = fPayload;
        }
        return gr.insert();
    },
    type: 'Probe'
};
Probe.get = function(name){
    if(name == null)
        return new Probe();
    var pgr = new GlideRecord("discovery_probes");
    pgr.get("name", name);
    if(pgr.isValidRecord()){
        return new Probe(pgr);
    }  
    return null;
};
Probe.createProbeResponse = function(eccGr){
     var probe = Probe.get(null);
    probe.setTopic(eccGr.getValue("topic"));
    probe.setName(eccGr.getValue("name"));
    probe.setSource(eccGr.getValue("source"));
    probe.setAgent(eccGr.getValue("agent"));
    //probe.setCorrelator(eccQGr.getValue(AGENT_CORRELATOR));
    probe.setEccQueueRecord(eccGr);
    probe.setPayload(Probe.getPayloadValue(eccGr));
    return probe;
};
Probe.getPayloadValue = function(eccGr){
    var payload = eccGr.getValue("payload");
    if(payload == "<see_attachment/>"){
        var att = new GlideRecord("sys_attachment");
        att.addQuery("table_sys_id", eccGr.sys_id.toString());
        att.addQuery("table_name", eccGr.getTableName());
        att.query();
        if(att.next()){
            var attachmentApi = new GlideSysAttachment();
            payload = attachmentApi.getContent(att);
        }else{
            payload = null;
        }      
    }
    return payload;
};
