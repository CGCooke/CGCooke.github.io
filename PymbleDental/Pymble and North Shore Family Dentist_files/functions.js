// JavaScript Document

function handle_selected_action(modeobj,obj,action)
{
	var mode = modeobj.value;		
	switch(mode)
	{
		case 'mass_delete':
			confirm_delete_sel(obj,action);
		break;
		
		case 'mass_restore':
			confirm_restore_sel(obj,action);
		break;
	}
	
	modeobj.selectedIndex="";
}

function handle_submit(formname,action,id)
{


	var obj = document.getElementById(formname);

	if(obj != "" || obj != "undefined")
	{
		obj.action = action;
		
		if(isNaN(id) == false)
		{
			obj.id.value = id;
		}
			
		obj.submit();
	}
}

function handle_submit_by_mode(formname,action,id)
{	
	var obj = document.getElementById(formname);	
	
	if(obj != "" || obj != "undefined")
	{
		obj.mode.value = action;
		if(isNaN(id) == false)
		{
			obj.id.value = id;
		}
			
		obj.submit();
	}
}

// --------------------------------------------------------------------------

/**
 * Handle Redirect
 *
 * @access public
 * @param  string
 * @return void
 */
function handle_redirect(url)
{
	if(url != "")
	{
		var browser_type=navigator.appName
		var browser_version=parseInt(navigator.appVersion)
		if (browser_type=="Netscape"&&browser_version>=4)
		{
			//if NS 4+	
			window.location.replace(url);
		}		
		else if (browser_type=="Microsoft Internet Explorer"&&browser_version>=4)
		{
			//if IE 4+	
			window.location.replace(url);
		}		
		else
		{
			//Default goto page (NOT NS 4+ and NOT IE 4+)	
			window.location=url;	
		}
	}
}

function confirm_delete(url){
var msg = "[ WARNING : Sending Record/s to Trash] \n\n Are you sure you want to send this item to trash?";
var conf = confirm(msg);

	if(conf)
	{
		handle_redirect(url);		
	}
}

function delete_perm(url){
var msg = "[ WARNING : Deleting Record/s Permanently] \n\n Are you sure you want to delete this record permanently?";
var conf = confirm(msg);

	if(conf)
	{
		handle_redirect(url);		
	}
}


function confirm_approve(obj,action)
{
	var id_arr = new Array();
	var allInputs = document.getElementsByTagName("input");
	for (var i = 0; i < allInputs.length; i++) 
	{
		if (allInputs[i].type == 'checkbox' && allInputs[i].name.substring(0,11) == "tablechoice") 
		{
			id_arr.push(allInputs[i]);
		}
	}
	if (isOneChecked(id_arr) == true)
	{
		var msg = "[ WARNING : Approving Record/s ] \n\n Are you sure you want to approve the Record/s?";
		var conf = confirm(msg);
		if(conf) 
		{
			handle_submit(obj, action);
		}
		else 
		{
			return false;
		}
	}
	else
	{
		alert("Please select the record to approve");
		return false;
	}
}

function confirm_delete_submit(formname,action,id){
var msg = "[ WARNING : Sending Record/s to Trash] \n\n Are you sure you want to send this item to trash?";
var conf = confirm(msg);

	if(conf)
	{
		handle_submit(formname,action,id);
	}
}


function confirm_send_new_password(formname,action,id){
var msg = "[ WARNING : Sending New Password ] \n\n Are you sure you want to send a new password?";
var conf = confirm(msg);
	if(conf)
	{
		handle_submit(formname,action,id);	
	}
}

function confirm_restore(url)
{
  
	var msg = "[WARNING] Are you sure you want to restore the record?";
	//var msg = "[ WARNING : Deleting Record/s ] \n\n Are you sure you want to Restore the selected Record/s?";
	var conf = confirm(msg);

	if(conf)
	{
		handle_redirect(url);
	}
}


function confirm_restore_submit(formname,action,id)
{
	var msg = "[WARNING] Are you sure you want to restore the record?";
	//var msg = "[ WARNING : Deleting Record/s ] \n\n Are you sure you want to Restore the selected Record/s?";
	var conf = confirm(msg);

	if(conf)
	{
		handle_submit(formname,action,id);
	}
}

function confirm_restore_sel(obj,action)
{
	var id_arr = new Array();
	var allInputs = document.getElementsByTagName("input");
	for (var i = 0; i < allInputs.length; i++) 
	{
		if (allInputs[i].type == 'checkbox' && allInputs[i].name.substring(0,11) == "tablechoice") 
		{
			id_arr.push(allInputs[i]);
		}
	}
	if (isOneChecked(id_arr) == true)
	{
		var msg = "[ WARNING : Restoring Record/s ] \n\n Are you sure you want to retore the selected Record/s?";
		var conf = confirm(msg);
		if(conf) 
		{			
			handle_submit(obj, action);
		}
		else 
		{
			return false;
		}
	}
	else
	{
		alert("Please select the record to restore");
		return false;
	}
}

function confirm_delete_sel(obj,action)
{
	var id_arr = new Array();
	var allInputs = document.getElementsByTagName("input");
	for (var i = 0; i < allInputs.length; i++) 
	{
		if (allInputs[i].type == 'checkbox' && allInputs[i].name.substring(0,11) == "tablechoice") 
		{
			id_arr.push(allInputs[i]);
		}
	}
	if (isOneChecked(id_arr) == true)
	{
		var msg = "[ WARNING : Deleting Record/s ] \n\n Are you sure you want to send the selected Record/s to trash?";
		var conf = confirm(msg);
		if(conf) 
		{
			handle_submit(obj, action);
		}
		else 
		{
			return false;
		}
	}
	else
	{
		alert("Please select the record to delete");
		return false;
	}
}


function confirm_update_sel(obj,action)
{
	var id_arr = new Array();
	var allInputs = document.getElementsByTagName("input");
	for (var i = 0; i < allInputs.length; i++) 
	{
		if (allInputs[i].type == 'checkbox' && allInputs[i].name.substring(0,11) == "tablechoice") 
		{
			id_arr.push(allInputs[i]);
		}
	}
	if (isOneChecked(id_arr) == true)
	{
		var msg = "[ WARNING : Updating Record/s ] \n\n Are you sure you want to update the selected Record/s?";
		var conf = confirm(msg);
		if(conf) 
		{
			handle_submit(obj, action);
		}
		else 
		{
			return false;
		}
	}
	else
	{
		alert("Please select the record to update");
		return false;
	}
}

function isOneChecked(CheckboxArray) 
{
	for (var i = 0; i < CheckboxArray.length; i++) 
	{
		if (CheckboxArray[i].checked)
		{
			return true;
		}
	}
	return false;
}

// Active/Inactive record
function change_active(url ,value)
{
        
	    if( value == 0 )
		{ 
        var msg = "[WARNING] Are you sure you want to make this record inactive?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to make this record active?";
		}
		
		
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}


/*
| @param string
|
*/
function make_featured(url)
{
      
		var msg = "[WARNING] Are you sure you want to make this record As a cover page?";
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}

function make_featured_catalogue(url ,value)
{
       if( value == 0 )
		{ 
		var msg = "[WARNING] Are you sure you want to Remove this Catalogue From Featured?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to make this Catalogue Featured?";
		}
		
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}

// Active/Inactive record
function change_hide_client(url ,value)
{
        
	    if( value == 0 )
		{ 
        var msg = "[WARNING] Are you sure you want to make this page visible to client?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to make this page invisible to client?";
		}
		
		
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}

// Active/Inactive record
function display_footer(url ,value)
{
        
	    if( value == 0 )
		{ 
        var msg = "[WARNING] Are you sure you dont want to display on footer?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to display on footer?";
		}
		
		
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}
// featured / remove featured
function change_featured(url ,value)
{
        
	    if( value == 0 )
		{ 
        var msg = "[WARNING] Are you sure you want to make this record non featured?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to make this record featured?";
		}
		
		
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}

// featured / remove featured
function change_approved(url ,value)
{
        
	    if( value == 0 )
		{ 
        var msg = "[WARNING] Are you sure you want to make this record unapproved?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to make this record approved?";
		}
		
		
		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}



// Change the status
function change_tstatus(url)
{
		var msg = "[WARNING] Are you sure you want to change the status?";

		if( confirm(msg) )
		{
			handle_redirect(url);		 
		}
}

function change_active_submit(formname,action,id,value)
{
        
	    if( value == 0 )
		{ 
        var msg = "[WARNING] Are you sure you want to make this record inactive?";
		}
		else
		{
		var msg = "[WARNING] Are you sure you want to make this record active?";
		}
		
		
		if( confirm(msg) )
		{
			handle_submit(formname,action,id);	 
		}
}

// fade in & fade out
function show_div_info_slow()
{
	//window.onload = function()
	//{
		//options: slow, fast and time
		$("div#div_info").show("slow");
	//}	
	setTimeout("hide_div_info_slow()",20000);
}
function hide_div_info_slow()
{
	$("div#div_info").hide("slow");	
}

function show_div_msg_slow()
{	
	$("div#div_msg").show("slow");	
	setTimeout("hide_div_msg_slow()",20000);
}

function hide_div_msg_slow()
{
	$("div#div_msg").hide("slow");	
}

function show_div_error_slow()
{
	//window.onload = function()
	//{
		//options: slow, fast and time	
		$("div#div_error").show("slow");
	//}
	setTimeout("hide_div_error_slow()",200000);
}

function hide_div_error_slow()
{
	$("div#div_error").hide("slow");	
}
/*********************************************************************************/
//This functions are used for changing the rank
function change_rank(id,crank,total,formname,action) 
{ 		
	var form_obj = document.getElementById(formname);
	if(form_obj != "" || form_obj != "undefined")
	{
		if(total > 1)
		{
			var nrank = prompt("Please Enter Rank Value [ 1 - "+total+" ] ",""); 
			if(ver_rank(nrank,crank,total))
			{ 
				if(nrank > crank)
				{ 			
				   form_obj.r_mode.value='decrease'; 
				} 
				else
				{ 
				   form_obj.r_mode.value='increase'; 
				}
				form_obj.mode.value='change_rank'; 
				form_obj.new_rank.value=nrank; 
				form_obj.curr_rank.value=crank; 					
				form_obj.id.value=id; 
				form_obj.action = action;
				form_obj.submit(); 
			}
			
		} 
		else
		{ 
			alert("Only 1 Record Present Can't change rank."); 
		} 
	}
}

function ver_rank(nr,cr,tr)
{    
   if(isNaN(nr))
   { 
      alert("Please enter only numbers"); 
      return false; 
   }
   else
   {
   		var str = new String(nr);
		arr = str.split(".");
		
		if( arr.length > 1 )
		{
			alert("Only integer values supported");
			return false;
		}
   }
   if(nr == '')
   { 
      alert("Please enter rank"); 
      return false; 
   } 
   if(nr == cr)
   { 
      alert("Current & New rank is same"); 
      return false; 
   } 
   if(nr == null){
   		return false; 
   }
   if(nr<1)
   {
	  alert("New rank cannot be less than one"); 
      return false; 
   }
   
   if(Number(nr)>Number(tr))
   {
	  alert("New rank cannot be more than total rank"); 
      return false; 
   } 
   
   return true; 
}




/*********************************************************************************/
/**
	AJAX function
	@author  - Dhaval K 16th Jan, 2009
	@param   - processing script URL
	@param   - form name to be posted
	@param   - div id where contents loaded
	@example - ajaxCall("includes/searchProcessor.php", "frmName", "divid");
 */
function ajaxCall(ajax_url, frm, div, data_values)
{
		
   var formValues = "";
   formValues = $('form#'+frm).serializeArray();
   $.ajax({
   type: "POST",
   url: ajax_url,
   data: formValues,
   beforeSend: function(){ 
			{    
//			 document.getElementById(div).innerHTML = '<img src="'+base_url+'images/ajax-loader.gif" />';
			}
		},
   success: function(msg){ 
			 $('#'+div).html(msg);
		   }	
	   });
}

function update_click(ajax_url, data_values, url)
{

    var formValues = "";
   	formValues = data_values;
	$.ajax({		
		type: "POST",
		url: ajax_url,
		data: formValues ,
		 success: function(url){ 
			 	window.location = url;
		   }	
   });
}
 
 
 
 
/**
	AJAX function pass data
	@author  - Dhaval K 16th Jan, 2009
	@param   - processing script URL
	@param   - form name to be posted
	@param   - div id where contents loaded
	@example - ajaxCall("includes/searchProcessor.php", "frmName", "divid");
 */
function ajaxCallPassData(ajax_url, div, data_values)
{
		
   var formValues = "";
   formValues = data_values;
   
   $.ajax({
   type: "POST",   
   url: ajax_url,
   cache:false,
   data: formValues,
   cache: false,
   beforeSend: function(){ 
			{    
			 document.getElementById(div).innerHTML = '<img src="images/ajax-loader.gif" />';
			}
		},
   success: function(msg){ 
			 $('#'+div).html(msg);
		   }	
	   });
}


		
/**		
function confirm_send_reply(url){
var msg = "[ WARNING : Sending New Password ] \n\n Are you sure you want to send a reply?";
var conf = confirm(msg);
	if(conf)
	{
		handle_redirect(url);		
	}
}**/

function confirm_send_reply(module,submit_name){
var msg = "[ WARNING : Sending Reply ] \n\n Are you sure you want to send a reply?";
var conf = confirm(msg);
	if(conf)
	{
		handle_submit(module,submit_name);			
	}
}

function dropDownSelect(selectID,optionValue)
{
   selObj = document.getElementById(selectID);
   for(i=0;i<selObj.length;i++)
   {
        if(selObj.options[i].value == optionValue) selObj.options[i].selected = true;
   } 
}//dropDownSelect()


/*
Function To create the Drop down Select Box dynamically
@ AUTHOR : Vishal Agarwal
*/

function create_dropdown(data_array,id,label,name_id,selected_value)
{	
	var str ='<select name=\"'+name_id+'\" id=\"'+name_id+'\" >';
	str +='<option value=\"\">Select '+label+'</option>';
	
	for(x in data_array)		
	{
		if(x == selected_value)
			str +='<option value=\"'+data_array[x]+'\" selected=\"selected\">'+ data_array[x]+'</option>';
		else
			str +='<option value=\"'+data_array[x]+'\">'+ data_array[x]+'</option>';
	}	
	str +='</select>';							
	$("#"+id).append(str);				
	//console.log(str);
}

/*
FUNCTION TO GET ELEMENT BY CLASS NAME
@ AUTHOR : Vishal Agarwal
*/

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\\\s)'+searchClass+'(\\\\s|$)');
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

/*
* Function To get tHe opacity Across all the browser
*/

function setOpacity(obj, opacity) {
	opacity = (opacity == 100)?99.999:opacity;
	if (obj.style.opacity) {
		// CSS3 - Safari 1.2, newer Firefox and Mozilla
		obj.style.opacity = opacity/100;
	} else if (obj.style.filter) {
		// IE/Win
		obj.style.filter = "alpha(opacity:"+opacity+")";
	} else if (obj.style.MozOpacity) {
		// Older Mozilla and Firefox
		obj.style.MozOpacity = opacity/100;
	} else if (obj.style.KHTMLOpacity) {
		// Safari<1.2, Konqueror
		obj.style.KHTMLOpacity = opacity/100;
	} else {
		// opacity not supported
		return false;
	}
}

/*
| FUNTION TO GET WINDOW HEIGHT 
|
*/

function getWindowHeight() {
	var windowHeight=0;
	if ( typeof( window.innerHeight ) == 'number' ) {
		windowHeight=window.innerHeight;
	}
	else {
		if ( document.documentElement && document.documentElement.clientHeight) {
			windowHeight = document.documentElement.clientHeight;
		}
		else {
			if (document.body&&document.body.clientHeight) {
				windowHeight=document.body.clientHeight;
			}
		}
	}
	
	return windowHeight;
}

/*
* Function to TRIM the data 
* Pass the set of characters as a string seperated by commas
*/

function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/*
| Function that workd like Php in_array
*/

function in_array(needle, haystack)
{
	 var key = '';
	 for (key in haystack) 
	 {
        if (haystack[key] == needle) 
		{
              return true;
        }
      }
	   return false;
}	  

//----------------------------------------------------------------------------------------------------

function readCookie(name) 
{
	var cookiename = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(cookiename) == 0) return c.substring(cookiename.length,c.length);
	}
	return null;
}

function change_rank_customized(id,crank,total,formname,action,category_id) 
{ 		
	
	var form_obj = document.getElementById(formname);
	if(form_obj != "" || form_obj != "undefined")
	{
		if(total > 1)
		{
			var nrank = prompt("Please Enter Rank Value [ 1 - "+total+" ] ",""); 
			if(ver_rank(nrank,crank,total))
			{ 
				if(nrank > crank)
				{ 			
				   form_obj.r_mode.value='decrease'; 
				} 
				else
				{ 
				   form_obj.r_mode.value='increase'; 
				}
				form_obj.mode.value='change_rank'; 
				form_obj.new_rank.value=nrank; 
				form_obj.curr_rank.value=crank; 					
				form_obj.category_id_rank.value=category_id; 					
				form_obj.id.value=id; 
				form_obj.action = action;
				form_obj.submit(); 
			}
			
		} 
		else
		{ 
			alert("Only 1 Record Present Can't change rank."); 
		} 
	}
}
//---------------------------------------------------------------------------------------------
function hide_div_message_product(divid)
{
	$("div#"+divid).hide("slow");	
}
//------------------------------------------------------------------------------------------
// fade in & fade out
function show_div_message_product(divid)
{
		$("div#"+divid).show("slow");
		setTimeout("hide_div_message_product('"+divid+"')",20000);
}

//-----------------------------------------------------------------------------------------
function confirm_resend_email(obj,action)
{
	var id_arr = new Array();
	var allInputs = document.getElementsByTagName("input");
	for (var i = 0; i < allInputs.length; i++) 
	{
		if (allInputs[i].type == 'checkbox' && allInputs[i].name.substring(0,11) == "tablechoice") 
		{
			id_arr.push(allInputs[i]);
		}
	}
	if (isOneChecked(id_arr) == true)
	{
		var msg = "[ WARNING : Approving Record/s ] \n\n Are you sure you want to resend email(s) to Admin?";
		var conf = confirm(msg);
		if(conf) 
		{
			handle_submit(obj, action);
		}
		else 
		{
			return false;
		}
	}
	else
	{
		alert("Please select the record to resend email to Admin");
		return false;
	}
}


//-----------------------------------------------------------------------------------------
function trimAll(sString)
{
	while (sString.substring(0, 1) == ' ') 
	{
		sString = sString.substring(1, sString.length);
	}
	while (sString.substring(sString.length - 1, sString.length) == ' ') 
	{
		sString = sString.substring(0, sString.length - 1);
	}
	return sString;
}


function alert_box(html_string)
{
 csscody.error(html_string);
 return false;
 
}

function info_message(html_string)
{
 csscody.alert(html_string);
 return false;
}

function prompt_message(html_string)
{
 csscody.prompt(html_string);
 return false;
}

function confirm_message(html_string)
{
 csscody.confirm(html_string);
 return false;
}