/**
 * 
 */
	$(document).ready(function(){
	
	$(window).on("load", function(){
		
		//load saved factories
		var savedFactories = sessionStorage.getItem("savedFactories");
		if(savedFactories){
			savedFactories = JSON.parse(savedFactories);
			
			var rootArray = savedFactories.rootArray;
			console.log("factory size after save: "+ rootArray.length);
			
			for(var i=0; i<rootArray.length;i++){
				$("#root").append(rootArray[i]);
			}
			
			$("#tree_dir_item").children("img").addClass("ui-icon ui-icon-triangle-1-e ui-icon-triangle-1-se");
			
			//tooltip
			addToolTips();
		}
		
	});
		
	function addToolTips(){
		//edit text and tooltip
		
		var boundTip = "Click off number to keep change. Do not click enter";
		var factoryTip = "Click off factory to keep change. Do not click enter";
		
		$(".upperBound")
			.click(enableEdit)
			.tooltip({
				content:boundTip
			});
			
		$(".lowerBound")
			.click(enableEdit)
			.tooltip({
				content:boundTip
			});
			
			$(".factory_name").tooltip({
			content:factoryTip
		});
	}
	
	//queryUI widget creations
	$("#gen_button").button({
		icons:{primary:"ui-icon-refresh"}
	});
	$("#delete_button").button({
		icons:{primary:"ui-icon-circle-minus"}
	});
	$("button").button();
	$("#count").spinner({
		min: 1,
		max: 15,
		value: 1
	});
	
	$(document).on("click", "img",function(){
		$this = $(this);
		$this.toggleClass("ui-icon-triangle-1-se");
		$this.parent().children("ul").toggle();
	});
	
	//add new factories -- start
	$("#addFactory").click(addNewFactory);
	
	function addNewFactory(){
	//removed this from the append to factory in order to test the new piece for expand/collapse
	//.append('<image class="ui-icon ui-icon-triangle-1-e img"/><span contenteditable="true" class="factory_name">New Factory</span>')
		var $root = $("#root");
		
		$root.append(
			$('<li>').addClass('factory')
				.append('<img class="img" /><span contenteditable="true" class="factory_name" title="">New Factory</span>')
					.append('<span class="bound"><span class="upperBound" title="">10</span>:<span class="lowerBound" title="">2</span></span>').hide(".img")
		);
		
		var $image = $("#tree_dir_item").children("img");
		if(!$image.hasClass("ui-icon")){
			$image.addClass("ui-icon ui-icon-triangle-1-e ui-icon-triangle-1-se")
		}
		
		addToolTips();
	}
	//add new factories -- end
	
	function enableEdit(){
	
	//save current value of contenteditable attribute
	 var editable = $(this).prop("contenteditable");
	 var edit_string = String(editable);
	 var className = $(this).attr('class');
	 
	 console.log("editable state: " + editable);
	 
	 //if the element is not editable, allow change of upper/lower bound
	 if(!editable || edit_string == "inherit"){
	 
		//add contenteditable and set value to true
		$(this).attr("contenteditable", "true");
	 }
	 
	 
	 //once focus is off the bound
	 $(this).blur(disableEdit);
	 
	}
	function disableEdit(){
		
		var className = $(this).attr('class');
		var changedBound = $(this).html();
		console.log(className + " changed to: " + changedBound);
		
		//validate max and min bounds
		var $parent = $(this).parent();
		var $upperBound = $parent.children(".upperBound").html();
		var $lowerBound = $parent.children(".lowerBound").html();
		console.log($upperBound +":"+ $lowerBound);
		
		if(isNaN($upperBound) || isNaN($lowerBound)){
			alert("Please use numbers only");
		}else if(parseInt($upperBound) < parseInt($lowerBound)){
	 	alert("the max number must be greater then the min number")
	 }
	}
	
	//functions related to dialog form --start
	//method add alert time for dialog form
	function updateTips( t ) {
      $(".tips")
      	.empty()
        .addClass( "ui-state-highlight" )
        .append("<span class='ui-icon ui-icon-alert'/>")
        .append("<span>" + t + "</span>");
     setTimeout(function() {
        $(".tips").removeClass( "ui-state-highlight", 1500 );
        
      }, 500 );
        $(".tips span:first-child").css({"float": "left", "margin-right":".3em"})
      
    }
	
	//wrapper method for generating random number and adding them to the tree
	function generate(){
		
		var bound = genDialog.data("bounds");
		console.log(bound);
		var max= bound.upperBound,
			min= bound.lowerBound,
			countMax = 15,
			count= $("#count").val();
		console.log("max: " +max);
		console.log("min: " + min);
		console.log("count: "+ count);
		
		//validate input
		var success = validate(count, countMax, min, max);
		
		/*if validation was successfull, then generate 
		 * random numbers and add them to the tree
		 * */
		if(success){
		
			var numArray = generateNumber(parseInt(max), parseInt(min), count);
			addRandomNodes(numArray);
		}
	}
	
	//method to validate form input
	function validate(count, countMax, min, max){
	
		var result = false;
		
		if(isNaN(count)){
			updateTips("count must be a number");
			$("#count").addClass( "ui-state-error" );
		}else if(count > countMax){
			updateTips("count must be between 1 and 15");
			$("#count").addClass( "ui-state-error" );
		}else if(isNaN(min) || isNaN(max)){
			updateTips("upper or lower bound must be a number")
			$("#count").addClass( "ui-state-error" );
		}else{
			result = true;
		}
		
		return result;
	}
	
	//generates list of numbers to be added to the tree view
	function generateNumber(max, min, limit){
		
		var randomArray = [];
		for(var i=0;i<limit;i++){
			var number = Math.floor(Math.random()*(max-min+1)+min);
			randomArray.push(number);
		}
		return randomArray;
	}
	
	//method to add random generated numbers to factory
	function addRandomNodes(numArray){
		//add check for
		var list_item = genDialog.data("factory");
		var factory_len = list_item.find(".factory_dir").children().length;
		console.log(".factory_dir class children: "+factory_len );
		
		console.log(".factory children: " + list_item.children().length);
		if(factory_len == 0){
			list_item.append("<ul class='factory_dir'>");
			list_item.find(".img").addClass("ui-icon ui-icon-triangle-1-e ui-icon-triangle-1-se");
		}
		
		
		var factory_dir = list_item.find(".factory_dir");
		for(var i=0; i<numArray.length; i++){
			factory_dir.append("<li class='random_num'><img class='ui-icon ui-icon-arrowthick-1-e img'/><span>"+numArray[i]+"</span></li>");
		}
		
	}
	
	//reset the dialog form to original state
	function resetDialog(){
		$(".tips").find("span").remove().text("Positive Numbers Only. Limit 15 Generated Numbers");
		$("form")[0].reset();
		$("#count").removeClass( "ui-state-error" );
	}
	
	
	
	$("#delete_button").click(function(e){
		console.log("button clicked");
		e.preventDefault();
		deleteFactory();
		
	});
	
	$("#gen_button").click(function(e){
		console.log("gen clicked");
		e.preventDefault();
		generate();
	});
	
	//method to delete selected factory
	function deleteFactory(){
		
		//remove factory
		var $factory = genDialog.data("factory");
		$factory.remove();
		
		//remove expand/collapse if all factories are deleted
		var $treeDir = $("#tree_dir_item");
		var $root = $("#root");
		console.log("number of children in root: "+ $root.children().length );
		if($root.children().length == 0){
			$treeDir.children(".img").removeClass("ui-icon ui-icon-triangle-1-e ui-icon-triangle-1-se");
		}
	}
	
	//initializing dialog box form
	var genDialog = $( "#generate-form" ).dialog({
      autoOpen: false,
      height: 270,
      width: 217,
      modal: true,
      resizable: false,
      buttons: {
        //"Generate": generate,
        Cancel: function() {
        	resetDialog();
          genDialog.dialog( "close" );
        },
		Close: function(){
			resetDialog();
			genDialog.dialog("close");
		}
      },
      close: function() {
    	  resetDialog();
      }
    });
	//functions related to dialog form -- end
	
	//dialog box form will be opened on a right click
	$(document).on("contextmenu", ".factory_name", function(e){
		
		$this = $(this);
		var parent = $this.parent();
		var upperbound = parent.find(".upperBound").text();
		var lowerbound = parent.find(".lowerBound").text();
		console.log("bounds passed on context menu upperbound: "+upperbound+", lowerbound: "+lowerbound);
		
		//store data into dialog element to be used for generating random numbers
		genDialog.dialog( "open" ).data("bounds", {upperBound: upperbound, lowerBound:lowerbound, });
		genDialog.data("factory", parent);
		console.log("data factory:" + genDialog.data("factory").prop("className"));

	return false;
    });
    
	
	//persist tree view state before reload
	$(window).on("unload", function(){
		
		var factoryListObject = populateSessionData();
		sessionStorage.setItem("savedFactories", JSON.stringify(factoryListObject));
	});
	
	//populates data into an object to be saved in sesionStorage
	function populateSessionData(){
	
	var rootArray=[];
	rootArray=$("#root").html();
	console.log("rootArray Length: "+rootArray.length);
	
	var factoryListArray=[];
	var rootListArray=[];
	var factoryArr=[];
	
	
	$(".factory").each(function(index){
		var $this =$(this); 
		
		factoryArr.push($this.html());
		console.log($this.html());
		var randomNumArr = [];
		
		//add random generated number to array
		$this.find(".random_num").each(function(){
			randomNumArr.push($(this).html());
		});
		console.log(randomNumArr);
		console.log(factoryArr);
		
		//create factory obj
		var factoryObj={
			name: $this.find(".factory_name").html(),
			upperbound: $this.find(".upperBound").html(),
			lowerbound: $this.find(".lowerBound").html(),
			isExpanded: $this.hasClass("ui-icon-triangle-1-se")?true:false,
			factoryDir: {
				numOfChildren:$this.find(".factory_dir").children().length,
				randomNum: randomNumArr
				},
			factory: factoryArr
			}
		
		//add factory obj to factory array	
		factoryListArray.push(factoryObj);
		
		});
	
		rootListArray.push(rootArray);
		
		var factoryListObject={
			factoryListArray: factoryListArray,
			rootArray: rootListArray
		};
		
		return factoryListObject;
	  }

});