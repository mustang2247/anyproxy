require("../lib/jstree");

function init(React){
	function fetchTree(root,cb){
		if(!root || root == "#"){
			root = "";
		}

		$.getJSON("/filetree?root=" + root,function(resObj){
			var ret = [];
			try{
				$.each(resObj.directory, function(k,item){
					if(item.name.indexOf(".") == 0) return;
					ret.push({
						text : item.name,
						id   : item.fullPath,
						icon : "uk-icon-folder",
						children : true
					});
				});

				$.each(resObj.file, function(k,item){
					if(item.name.indexOf(".") == 0) return;
					ret.push({
						text     : item.name,
						id       : item.fullPath,
						icon     : 'uk-icon-file-o',
						children : false
					});
				});
			}catch(e){}
			cb && cb.call(null,ret);
		});
	}

	var MapForm = React.createClass({

		submitData:function(){
			var self   = this,
				result = {};

			var	filePathInput = React.findDOMNode(self.refs.localFilePath),
			   	filePath      = filePathInput.value,
				keywordInput  = React.findDOMNode(self.refs.keywordInput),
				keyword       = keywordInput.value;

			if(filePath && keyword){
				self.props.onSubmit.call(null,{
					keyword : keyword,
					local   : filePath
				});

				filePathInput.value = "";
				keywordInput.value = "";
			}
		},
		
		render:function(){
			var self = this;
			return (
				<div>
					<form className="uk-form uk-form-stacked mapAddNewForm">
					    <fieldset>
					        <div className="uk-form-row">
				                <label className="uk-form-label" htmlFor="map_keywordInput">keyword</label>
				                <div className="uk-form-controls">
				                    <input className="mapConfigInputs" type="text" id="map_keywordInput" ref="keywordInput" placeholder="keyword" />
				                </div>
				            </div>

					        <div className="uk-form-row">
				                <label className="uk-form-label" htmlFor="map_localFilePath">local file</label>
				                <div className="uk-form-controls">
				                    <input className="mapConfigInputs pathInput" type="text" id="map_localFilePath" ref="localFilePath" placeholder="local file path" />
				                </div>
		            	        <div ref="treeWrapper" className="treeWrapper"></div>
				            </div>

	            	        <div className="uk-form-row">
		            	        <button type="button" className="uk-button" onClick={self.submitData}>Add</button>
	                        </div>

					    </fieldset>
					</form>

				</div>
			);
		},

		componentDidMount :function(){
			var self = this;
			var wrapperEl     = $(React.findDOMNode(self.refs.treeWrapper)),
				filePathInput = React.findDOMNode(self.refs.localFilePath);

			wrapperEl.jstree({
			  	'core' : {
				    'data' : function (node, cb) {
				    	fetchTree(node.id,cb);
					}
				}
			});

			wrapperEl.on("changed.jstree", function (e, data) {
				if(data && data.selected && data.selected.length){
					//is folder
					if(/folder/.test(data.node.icon)) return;

					var item = data.selected[0];
					filePathInput.value = item;
				}
			});

		},
		componentDidUpdate:function(){}
	});

	return MapForm;
}

module.exports.init = init;