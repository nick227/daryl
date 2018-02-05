"use strict";

var ui = (function(){

	var ui = {
		buttons:{},
		listeners:{},
		socketListeners:{},
		datatransform:{},
		socket: io()
	};
	
	/*******************************/
	ui.init = function(){
		ui.transform.start();
		ui.listeners.start();
		ui.socketListeners.start();
	}
	/*******************************/
	ui.socketListeners.start = function(){
		  ui.socket.on('msg', ui.transform['console']);
		  ui.socket.on('update', ui.transform['row']);
		  ui.socket.on('response', ui.transform['history']);
	}
	/*******************************/
	ui.listeners.start = function(){
		  $('.tbl-edit').on('click', '.edittable', ui.actions['edit']);
	}
	ui.listeners.off = function(){
		  $('.tbl-edit').off('click', '.edittable', ui.actions['edit']);
	}
	/*******************************/
	ui.actions = {
		edit:function(e){
			addHandler();
			function addHandler(){
				var input = $(e.target);
				var actions = ui.actions;
				var savedval = input.val();
				input.on('focusout blur', function(e){
					input.off('focusout blur');
					actions.save(e, savedval);
					setTimeout(function(){
						addHandler();
						ui.transform.mask();
					}, 250)
				});
			}
		},
		save:function(e, oldVal){
				var elm = $(e.target);
				var val = elm.val();
				if(oldVal !== val){
					var id = elm.parents('.row').attr('id'),
						key = elm.attr('name'),
						d = {};
						d[key]=val;
					var payload = {
						type:'localfu',
						name:'Jobs',
						id:id,
						query:{$set:d}
					};
		    		var op = ui.socket.emit('update', payload);
		    		return true;
				}else{
					return false;
				}
		}
	}
	/*******************************/
	ui.transform = {
		start:function(){
			this.mask();
		},
		row:function(obj){
			if(typeof obj.id === 'string'){
			  	var row = $("#"+obj.id);
				for(var key in obj.params){
					var val = obj.params[key];
			    	row.find('.'+key).html(val);
				}
			}
		    ui.transform.mask();
		},
		console:function(msg){
			if(typeof msg.id === 'string'){
				var params = JSON.parse(msg.params);
				var key = Object.keys(params)[0];
				var html = '<p title="'+key+'">'+params[key]+'</p>'
		  		$('#'+msg.id).find('.console').append(html);
		  		$('#'+msg.id).find('.clear').show();
			}
		},
		history:function(list){
			var table = '<table class="tbl tbl-full"><tr><th>date</th><th>status</th><th>duration</th></tr>';
			for(var i=0;i<list.length;i++){
				var row = list[i];
				var id = row.object_id;
				var log = row.log;
				var duration = row.duration;
				var status = row.status;
				var user = row.user_id;
				var date = moment(parseInt(row.timestamp)).format("LLL");

				table +=  '<td class="cell">'+date+'</td>'+
								'<td class="cell">'+status+'</td>'+
								'<td class="cell">'+duration+'</td>'+
								'</tr>';
			}
				table += '</table>';
				$('#'+id).find('.history').append(table);
		},
		mask:function(){
			var masks = this.masks;
			var items = [{key:'duration', selector:'.convert.duration'},{key:'timestamp', selector:'.convert.timestamp'}];
			for(var i in items){
				attach(items[i].key, items[i].selector);
			}
			function attach(key, selector){
				$(selector).each(function(){
					var elm = $(this);
					addMask(elm,key);
					elm.on('click', removeMask);
					elm.show();
				});
			}
			function addMask(elm, name){
				masks[name](elm);
			}
			function removeMask(e){
				var elm = $(e.target);
				var ms = elm.attr('data-ms');
				var mask = elm.val();
				elm.off('click');
				elm.val(ms);
			}
		},
		masks:{
			timestamp:function(elm){
				var ts = elm.val();
				if(!isNaN(ts)){
					var date = moment(parseInt(ts)).format("LLL");
					elm.attr('data-ms', ts);
					elm.val(date);
				}
			},
			duration:function(elm){
				var ms = elm.val();
				if(!isNaN(ms)){
					var dur = moment.duration(parseInt(ms));
					var v = dur['_data'].days + ' days | ' + dur.hours() +' hours | ' + dur.minutes() +' minutes';
					elm.attr('data-ms', ms);
					elm.val(v);
				}
			}
		}
	};
	/*******************************/
	ui.buttons = {
		run:function(jobID){
		  	event.preventDefault();
		    ui.socket.emit('run', jobID);
		},
		clear:function(jobID){
			$('#'+jobID).find('.console').html("");
		},
		history:function(jobID){
			ui.socket.emit('request', {type:'job-history', query:{object_id:jobID}});
		}
	};
	/*******************************/
	/*******************************/

	$(document).ready(function(){
		ui.init();
	});

	return {
		buttons:ui.buttons
	};

})();