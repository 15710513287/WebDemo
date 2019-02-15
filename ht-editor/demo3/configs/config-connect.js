//拓展ht.DataModel方法
ht.DataModel.prototype.connectInit = function() {
    var me = this;
    var dataSetList = me.getDataSet();
    if(dataSetList.length < 1){
    	return;
    }
    analogEntitySet(dataSetList,me);
    var O = location.hostname + ':10000';
    var socket = io.connect(O);
    socket.on("connect", function() {
		console.log('连接')
	})
    var pageCookie = encodeURIComponent(userCookieStr) || document.cookie
    socket.emit('explore',me.getDataSet(),pageCookie);
    var userStr = userCookie || getCookie("user");
    if(!userStr){
    	userStr = '{}'
    }
	var UserJson = JSON.parse(userStr);
	if(UserJson && UserJson.name){
		socket.on(UserJson.name + "/data", function(data) {
	    	var item = JSON.parse(data);
	    	me.nodeReassignment(item);
		})
	}
    
    socket.on("disconnect", function() {
		console.log('断开')
	})
};
//获取图元上的数据集
ht.DataModel.prototype.getDataSet = function(){
	var me = this,dataSetList = [];
	me.each(function(data) {
    	var dataBindings = data.getDataBindings();
    	var dataSet = data.a('dataSet');
    	if (dataBindings && dataSet) {
    		for (var name in dataBindings.a) {
                var db = dataBindings.a[name];
                if(db.fieldName){
                	dataSetList.push(dataSet);
                }
            }
    	}
    })
	me.dataSetList = [];
	for(var i = 0; i < dataSetList.length; i++){
		if(me.dataSetList.indexOf(dataSetList[i]) == -1){
			me.dataSetList.push(dataSetList[i]);
		}
	}
	return me.dataSetList;
}
//获取绑定字段详情
ht.DataModel.prototype.getDataSetFiledInfo = function(){
	var me = this;
	var fieldList = []
	var dataSetList = me.dataSetList ? me.dataSetList : me.getDataSet();
	for(var i = 0; i < dataSetList.length; i++){
		var item = {
			dataSetId: dataSetList[i],
			bindingNode:[]
		}
		fieldList.push(item);
	}
	me.each(function(data) {
    	var dataBindings = data.getDataBindings();
    	var dataSet = data.a('dataSet');
    	if (dataBindings && dataSet) {
    		for (var name in dataBindings.a) {
                var db = dataBindings.a[name];
                if(db.fieldName){
                	for(var j = 0; j < fieldList.length; j++){
                		if(fieldList[j].dataSetId === dataSet){
                			var info = {
		                		propertyName : name,
		                		fieldName : db.fieldName,
		                		nodeId : data.getId(),
		                		func : db.func
		                	}
                			fieldList[j].bindingNode.push(info)
                		}
                	}
                }
            }
    	}
    })
	me.filedInfoList = fieldList;
	return fieldList;
}
//根据获取值刷新图元
ht.DataModel.prototype.nodeReassignment = function(data){
	var me = this;
	var infoList = me.filedInfoList ? me.filedInfoList : me.getDataSetFiledInfo();
	//需要优化
	for(var i = 0; i < infoList.length; i++){
		if(data.id === infoList[i].dataSetId){
			var item = data.data;
			for(var k = 0; k < item.length; k++){
				if(infoList[i].bindingNode && infoList[i].bindingNode.length > 0){
					for(var j = 0; j < infoList[i].bindingNode.length; j++){
						if(item[k].name === infoList[i].bindingNode[j].fieldName){
							var selNode = infoList[i].bindingNode[j];
							if(selNode.func){item[k].value = selNode.func(item[k].value)}
							me.setDataValueById(selNode.nodeId,selNode.propertyName,item[k].value);
						}
					}
					
				}
			}
		}
	}
	data.dataSetId
}
//设置图元属性值
ht.DataModel.prototype.setDataValueById = function(id,name,value){
	if(!id && !name){
		return;
	}
	var me = this;
	var node = me.getDataById(id);
	node.a(name,value);
}
//根据name获取cookie
function getCookie(name) {
	var cookies = document.cookie;
	var list = cookies.split("; ");

	for(var i = 0; i < list.length; i++) {
		var arr = list[i].split("=");
		if(arr[0] == name){
			return decodeURIComponent(arr[1]);
		}
	}
  return "";
}
//模拟数据
function analogEntitySet(dataSetList,me){
	for(var i = 0; i < dataSetList.length; i++){
		if(dataSetList[i].indexOf('AnalogEntity') > -1){
			getAnalogData(dataSetList,me)
			return ;
		}
	}
}
function getAnalogData(dataSetList,me){
	var dataSetUrl = '/database/info';
	var pageCookie = encodeURIComponent(userCookieStr) || document.cookie
	$.ajax({
		type:"get",
		url:dataSetUrl,
		async:true,
		scope:dataSetList,
		me:me,
		headers: {
            'cookies':pageCookie
       	},
		success:function(data){
			var list = this.scope;
			var me = this.me;
			for(var i = 0; i < list.length; i++){
				if(list[i].indexOf('AnalogEntity') > -1 && data.msg){
					for(var j = 0; j < data.msg.length; j++){
						if(data.msg[j].type === 'analogData' && data.msg[j].id === list[i]){
							var json = {
								"id":data.msg[j].id,
							    "data":[]
							}
							if(JSON.parse(data.msg[j].jsonStr)){
								json.data.push(JSON.parse(data.msg[j].jsonStr));
							}
							me.nodeReassignment(json)
						}
					}
				}
			}
		},
		error:function(){
			editor.showMessage('数据集获取失败！');
		}
	});
}
