//Using XMLHttpRequest 2
//IE10+ fully support, IE9 don't support Object FormData

var ajax = (function(document, window) {
	'use strict';
	
	function gId(id) { return document.getElementById(id); }
	function gTag(tag, root) { return (root || document).getElementsByTagName(tag); }
	function extend(def, usr) { for(var p in usr) { def[p] = usr[p]; } }
  
  function handleLink(usrProps, isForm, fid) {
    var xhr = new XMLHttpRequest(),        
        props = {
          method: null,
          url: null,
          async : true,
          data: null,
          header: 'application/x-www-form-urlencoded',
          success: function(data) {},
          error: function(status) {},
          timeout : 10000,          
          timeoutEmit: function() {},
          progressUtilize : function(e) {},
          uploadFrom : function() {}
        };   
    
    extend(props, usrProps);
    xhr.timeout = props.timeout;
    xhr.ontimeout = props.timeoutEmit;
    xhr.onprogress = xhr.upload.onprogress = props.progressUtilize;
        
    xhr.open(props.method, props.url, props.async);
    
    if (isForm) {
      if (fid) {
        var form = document.getElementById(fid);
        var formData = new FormData(form);
        props.uploadFrom();
        xhr.send(formData);	
      } else {
        if (!props.uploadFrom) throw('Need form upload handling');
        var formData = new FormData();
        props.uploadFrom();
        xhr.send(formData);
      }      　
    } else if (props.method.toLowerCase() === 'post') {
        xhr.setRequestHeader('Content-Type', props.header);
        xhr.send(props.data);      
    } else xhr.send();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          var text = xhr.responseText;
          props.success(text);
          //props.success.call(xhr, xhr.responseText);
          return result;
        }
        else {
          props.error(xhr.status);
        } 
      }
    };    
  }  	
	
	return {
		init: function(usrProps) {
      var data = usrProps.method && usrProps.url ? handleLink(usrProps) : alert('Please input method or url');     
      return {
        jsonParse : function() {
          if(data) return JSON.parse(data); 				
        }        
      }  
		},
    
    formUpload: function(usrProps, isForm, fid) {
      handleLink(userProps, isForm, fid);
    }
	}	
})(document, window);