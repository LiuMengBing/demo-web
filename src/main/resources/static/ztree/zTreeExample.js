/**
 * Created by Administrator on 2018/8/29.
 */
var zTreeObj;

var  highlightNodeList={};//高亮显示的树节点集合

var rootNodes = [{id:88,name:'面板管理',isParent:true,open:true}];

$(function(){
    zTreeObj = $.fn.zTree.init($("#ztreeExample"), setting, rootNodes);//初始化示例树根节点
    ztreeHandler.initExampleTree();
});

var ztreeHandler = {

    //初始化示例树根节点下的第一层节点
    initExampleTree:function(){
        var exampleTree = [
            {id:0,name:"表格面板",click:ztreeHandler.initExampleData('id')},
            {id:1,name:"表单面板",click:ztreeHandler.initExampleData('id')},
            {id:2,name:"多页签面板",click:ztreeHandler.initExampleData('id')},
            {id:3,name:"定制面板",click:ztreeHandler.initExampleData('id')},
            {id:4,name:"图表面板",click:ztreeHandler.initExampleData('id')}];//点击每一个节点时触发事件继续加载下一层子节点
        /**动态增加树节点
        var exampleTree = new Array;
        var example1={id:0,name:"****"};
         example1 = {
                    "click":"ztreeHandler.initExampleData(id)"
                };
        exampleTree.push(example1);
         */
        var root = zTreeObj.getNodeByParam("id",88,null);//通过id获取示例树的根节点
        zTreeObj.addNodes(root,exampleTree,false);//向root根节点下增加子节点exampleTree，增加完成后展开根节点
    },

    //初始化示例树根节点下第一层节点的子节点
    initExampleData:function(treeId){
        var firstRoot = zTreeObj.getNodeByParam("id",treeId,null);//获取第一层子节点做为要添加子节点的根节点
        zTreeObj.removeChildNodes(firstRoot);//每次加载子节点树之前先清空该子节点树，防止多次点击时重复加载显示子节点树
        var firstRootNodes = {
            {id:00,name:"子节点1",click:ztreeHandler.initifreamGrid('id')},
            {id:11,name:"子节点2",click:ztreeHandler.initifreamGrid('id')},
            {id:22,name:"子节点3",click:ztreeHandler.initifreamGrid('id')},
            {id:33,name:"子节点4",click:ztreeHandler.initifreamGrid('id')},
            {id:44,name:"子节点5",click:ztreeHandler.initifreamGrid('id')}};
        zTreeObj.addNodes(firstRoot,firstRootNodes,false);//向firstRoot根节点下增加子节点firstRootNodes，增加完成后展开根节点
    },

    //初始化树右侧的ifream页面
    initifreamGrid:function(treeId){
        if(treeId==00){
            document.getElementById("iframeGrid").src = "/ztree/iframeGrid1.html?treeId="+treeId;
            document.getElementById("iframeGrid").value = treeId;
        }else {
            document.getElementById("iframeGrid").src = "/ztree/iframeGrid2.html?treeId="+treeId;
            document.getElementById("iframeGrid").value = treeId;
        }
    },

    //操作（增加、修改）树节点
    updateTreeNode:function(updateType,treeId){
        if(updateType=="editTreeNode"){
            //修改树节点
        }else if(updateType=="addTreeNode"){
            //增加树节点
        }
    },

    //当鼠标移动到节点上时，显示用户自定义控件(显示增加、删除、修改等图标)
    addHoverDom:function(treeId,treeNode){
        //ztreeExample_1为根节点的tId，过滤只有子节点有鼠标移上事件
        if(treeNode.parentTId!="ztreeExample_1" && treeNode.tId!="ztreeExample_1"){
            var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
            //判断节点后的图表按钮是否存在，不存在增加，存在就返回
            if (treeNode.editNameFlag || $("#editBtn_"+treeNode.tId).length>0|| $("#removeBtn_"+treeNode.tId).length>0) return;
            var addStr = "&nbsp;&nbsp;<span class='h-icon-edit hand' id='editBtn_" + treeNode.tId + "' title='修改' >" +
                "</span>&nbsp;<span class='h-icon-remove hand' id='removeBtn_" + treeNode.tId + "' title='删除' onfocus='this.blur(); '></span>"; //定义添加按钮
            sObj.after(addStr); //加载添加按钮
            //修改
            var editBtn_ = $("#editBtn_"+treeNode.tId);
            //绑定添加事件，并定义添加操作
            if (editBtn_) editBtn_.bind("click", function(){
                //将新节点添加到数据库中
                hoverTree.updateTreeNode("editTreeNode",treeNode.id);
            });
            //删除
            var removeBtn_ = $("#removeBtn_"+treeNode.tId);
            if (removeBtn_) removeBtn_.bind("click", function(){
                var nodes = zTreeObj.getSelectedNodes();//获取当前选中的节点
                top.Dialog.confirm("您确定删除吗?", function () {
                    //删除之后重新加载当前树节点
                    // ztreeHandler.initExampleTree(treeNode.pId);
                    zTreeObj.reAsyncChildNodes(nodes[0],"refresh");
                })
            });
        }else{
            return;
        }

    },

    //当鼠标离开节点时的操作（增加、删除、修改按钮不显示）
    removeHoverDom:function(treeId,treeNode){
        $("#editBtn_"+treeNode.tId).unbind().remove();
        $("#removeBtn_"+treeNode.tId).unbind().remove();
    },

    //根据节点名称模糊搜索树节点
    selectTreeNodeByNameLike:function(){
        var selectValue = document.getElementById("selectTreeNode").value;
        ztreeHandler.getNodesByFuzzy("name", selectValue);
    },

    //根据某一条件查找节点 模糊查询（key为查找节点的条件，value为查找节点的值，如果按照名称[name]搜索，则key为name，value为具体要搜索的name值）
    getNodesByFuzzy:function (key, value){
        var leafNodes = zTreeObj.getNodes();//获取树的所有一级节点
        for(var i=0;i<leafNodes.length;i++) {
            var nodes = zTreeObj.getNodesByParamFuzzy(key, value, leafNodes[i]);//ztree自带方法，遍历获取每个一级节点下匹配查找条件的叶子节点
            //取消之前的高亮显示
            ztreeHandler.highlightNodes(zTreeObj, highlightNodeList, false);
            //高亮显示当前匹配到的叶子节点
            ztreeHandler.highlightNodes(zTreeObj, nodes, true);
            highlightNodeList = nodes;
            if (null != nodes && nodes.length > 0) {
                zTreeObj.selectNode(nodes[0]);//默认选中匹配到的叶子节点中的第一个
            }
        }
    },

    //高亮显示
    highlightNodes:function (zTreeObj, nodes, highlight) {
        if(null == nodes)  return;
        for( var i = 0, l = nodes.length; i < l; i++) {
            nodes[i].highlight = highlight;
            zTreeObj.updateNode(nodes[i]);
        }
    },

    //用于树节点搜索，将查出的树节点高亮显示
    getFontCss:function(treeId, node){
        return (!!node.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    },

    zTreeOnClick:function (eventjs,treeId,treeNode,clickFlag){
        if(treeNode.level==1){
            //给第一级子节点绑定鼠标点击事件
        }
    }
}

var setting = {
    //页面上的显示效果
    view: {
        addHoverDom: ztreeHandler.addHoverDom,
        removeHoverDom: ztreeHandler.removeHoverDom,
        fontCss: ztreeHandler.getFontCss
    },
    edit: {
        enable: true, //单独设置为true时，可加载修改、删除图标
        editNameSelectAll: true,
        showRemoveBtn: false,
        showRenameBtn: false
    },
    data: {
        simpleData: {
            enable:true,
            idKey: "id",
            pIdKey: "pId",
            system:"system",
            rootPId: ""
        }
    },
    callback: {
        /** onClick: hoverTree.zTreeOnClick, //此处可以在setting的时候给zTree节点绑定鼠标点击事件，在事件内部定义点击操作
         onRemove: onRemove, //移除事件
         onRename: onRename //修改事件**/
    }
}