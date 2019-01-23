window.isPracticing = window.location.host.indexOf('hightopo') >= 0;

window.hteditor_config = {
	container : "containerId",
    // color_select: '#FF7733',
    color_dark: '#535353',
    explorerMode: 'accordion',
    leftSplitViewPosition: '265',
    locale: 'zh',
    // importDataBindingsButtonVisible: false,
    // scenesVisible: true,
    // modelsVisible: true,
    componentsVisible: !isPracticing,
    displaysEditable: !isPracticing,
    symbolsEditable: !isPracticing,
    componentsEditable: !isPracticing,
    assetsEditable: !isPracticing,
    locateFileEnabled: !isPracticing,
    fontPreview: '图扑软件 - Hightopo',
   	dataSetUrl: 'http://192.168.7.47:5888/database/',
   	detailedDataSetUrl: 'symbols/icon-ht/图纸.json',
    expandedTitles: {
        TitleExtension: false
    },
    subConfigs: [
        //'custom/configs/config-points.js',
        'custom/configs/config-createDataSource.js',
        'custom/configs/config-createDataSet.js',
        'custom/configs/config-dataSet.js',
        'custom/configs/config-handleEvent.js',
        //'custom/configs/config-valueTypes.js',
        'custom/configs/config-dataSetValue.js',
        'custom/configs/config-dataBindings.js',
        'custom/configs/config-connectActions.js',
        'custom/configs/config-inspectorFilter.js',
        'custom/configs/config-customProperties.js',
        'custom/configs/config-onTitleCreating.js',
        'custom/configs/config-onTitleCreated.js',
        'custom/configs/config-onMainToolbarCreated.js',
        'custom/configs/config-onMainMenuCreated.js',
        'custom/configs/config-onRightToolbarCreated.js'
    ],
    libs: [
        'custom/libs/echarts.js',
        'custom/libs/jquery-1.11.0.js'
    ],
    drawAccordionTitle: function(g, rect, data, view, option) {
        var isHover = option.isHover,
            isExpanded = option.isExpanded,
            hoverColor = option.hoverColor,
            selectColor = option.selectColor,
            label = view.getLabel(data);
		
		var fontColor = 'rgb(61,61,61)',
			itemCloseBg = '#f1f1f1';
		
        var x = rect.x,
            y = rect.y,
            width = rect.width,
            height = rect.height;
        
        g.beginPath();
        if (isExpanded) {  //展开
        	g.strokeStyle = '#fff';
        	fontColor = '#fff'
           	g.moveTo(x + 16, y + height / 2 + 3);
           	g.lineTo(x + 22, y + height / 2 - 3);
           	g.lineTo(x + 28, y + height / 2 + 3);
           
           	g.fillStyle = selectColor;
           	g.fillRect(x+5, y+3, width-10, height-3);
           	
        }
        else {   //合并
        	g.strokeStyle = 'rgb(61,61,61)';
        	fontColor = 'rgb(61,61,61)',
            g.lineWidth = 2;
            g.moveTo(x + 16, y + height / 2 - 3);
            g.lineTo(x + 22, y + height / 2 + 3);
            g.lineTo(x + 28, y + height / 2 - 3);
            
            g.fillStyle = itemCloseBg;
           	g.fillRect(x+5, y+3, width-10, height-3);
        }
        
        if (isHover) {
            g.fillStyle = hoverColor;
            g.fillRect(x+5, y+3, width-10, height-3);
        }
        g.stroke();
        if (label) {
            ht.Default.drawText(g, label, 'bold 14px Arial', fontColor, x + 32, y, width - 32, height, 'left', 'middle');
        }
    },
    accordionMutex: true,
    handleInsertSceneFileToGraphView: function(displayView, fileNode, point) {
        const node = new ht.Node();
        node.a('sceneURL', fileNode.url);
        node.setImage('symbols/html/scene.json')
        if (point) {
            node.p(point.x, point.y);
        }
        else {
            const rect = displayView.graphView.getViewRect();
            if (rect) {
                node.p(rect.x + rect.width/2, rect.y + rect.height/2);
            }
        }
        node.setDisplayName(hteditor.fileNameToDisplayName(fileNode.url));
        displayView.addData(node);
    },
    handleInsertModelFileToGraphView: function(displayView, fileNode, point) {
        const node = new ht.Node();
        node.a('modelURL', fileNode.url);
        node.setImage('symbols/html/obj.json')
        if (point) {
            node.p(point.x, point.y);
        }
        else {
            const rect = displayView.graphView.getViewRect();
            if (rect) {
                node.p(rect.x + rect.width/2, rect.y + rect.height/2);
            }
        }
        node.setDisplayName(hteditor.fileNameToDisplayName(fileNode.url));
        displayView.addData(node);
    }
};
