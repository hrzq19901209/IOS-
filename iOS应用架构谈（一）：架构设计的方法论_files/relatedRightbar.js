var relatedRightbar = {

	recommendations : null,
	whitepaperVcrItems : null,
	topicSponsorship : null,
	contentHeight : null,
	mediumHeight: 2000,
	largeHeight: 4000,
	whitepaperWidgetDisplayed: false,
	
	parseRecommendationsJson : function() {
		// since the json is encoded as hrml, we need to decode it(jquery way,
		// create a div with a text and get the text)
		this.recommendations = $.parseJSON($("<div/>").html(recomJson).text());
	},

	parseWhitepareVcrJson : function() {
		// since the json is encoded as hrml, we need to decode it(jquery way,
		// create a div with a text and get the text)
		this.whitepaperVcrItems = $.parseJSON($("<div/>").html(whitepaperVcrsJson).text());
	},

	parseSponsorshipJson : function() {
		// since the json is encoded as hrml, we need to decode it(jquery way,
		// create a div with a text and get the text)
		this.topicSponsorship = $.parseJSON($("<div/>").html(topicSponsorshipJson).text());
	},
	
	addRecommendationItem : function(recommendation) {
		authorUrl = InfoQConstants.countryCode+"/author/"+recommendation.author.replace(/\s+/g,"-");
		if(recommendation.contentType=="news"){
			recommendationResult = "<li class=\"news\">";
		}else{
			recommendationResult = "<li>";
		}
		recommendationResult += "<a href=\""+recommendation.url+this.addRelatedSectionGATracking(recommendation.contentType, "text")+"\" class=\"rhs_b_rc__link\">"+recommendation.title+"</a><br> ";
		recommendationResult +="<span class=\"rhs_b_rc__strapline\"><a href=\""+authorUrl+this.addRelatedSectionGATracking("author")+"\">"+recommendation.author+"</a> - "+this.formatDate(recommendation.date)+"</span>";
		if(recommendation.imageStoragePath!=null){
			recommendationResult+=" <a href=\""+recommendation.url+this.addRelatedSectionGATracking(recommendation.contentType, "image")+"\" class=\"rhs_b_rc__img\"><img src=\""+recommendation.imageStoragePath+"\"></a>";
		}
		recommendationResult+="</li>";
		return recommendationResult;
		// for date format see commentsHandler.js and moment.js
	},
	
	addRecommendationSection : function(nrItems, index) {
		recommendationSection = '<div id="reco_div_'+index+'" class="rhs_b rhs_b_rc"><div class="rhs_b__title">'+JSi18n.relatedRightbar_relatedContent+'</div><ul id="reco_ul_'+index+'"class="rhs_b_rc__list"></ul></div>';
		$('.article_page_right').append(recommendationSection);
		itemCount = 0;
		$.each(this.recommendations, function(i,recommendation) {
		      if(itemCount<nrItems && typeof recommendation.used === 'undefined'){
		    	  $( "#reco_ul_"+index ).append( relatedRightbar.addRecommendationItem(recommendation) );
		    	  recommendation.used=true;
		    	  itemCount++;
		      }	      
		  });
	},

	addWidgetVcrItem : function(vcrItem, trackerClass) {
		// tvi = tracked vcr id, tvl = tracked vcr label used for impression tracking, see tracker.js (called on document ready)
		vcrUrl=InfoQConstants.countryCode+"/vendorcontent/show.action?vcr="+vcrItem.id;
		vcrResult="<li> <a href=\""+vcrUrl+this.addWhitepaperSectionGATracking()+"\" class=\"rhs_b_s__cover\"><img src=\""+vcrItem.coverImagePath+"\" ></a>";
		vcrResult+="<a href=\""+vcrUrl+this.addWhitepaperSectionGATracking()+"\" class=\"rhs_b_s__title "+trackerClass+"\" tvi=\""+vcrItem.id+"\" tvl=\"rightbar\">"+vcrItem.title+"</a><br>";
		vcrResult+="<p class=\"rhs_b_s__desc\">"+vcrItem.shortSummary+"</p>";
		vcrResult+="</li>";
		
		return vcrResult;
	},

	addWidgetSponsorship : function(index) {
		sponsorshipResult="<div class=\"rhs_b_s__sponsor\"><span class=\"rhs_b_s__sponsor_by\">"+JSi18n.relatedRightbar_sponsoredBy+"</span>";
		sponsorshipResult+="<a href=\""+this.topicSponsorship.iconLink+"\"><img src=\""+this.topicSponsorship.iconHref+"\"></a></div>";
		$( "#widget_"+index ).append(sponsorshipResult);
	},

	addWhitePaperWidget : function(index) {
		$('.article_page_right').append("<div id=\"widget_"+index+"\" class=\"rhs_b rhs_b_s rhs_b_s--single\"><div class=\"rhs_b__title\">"+JSi18n.relatedRightbar_sponsoredContent+"</div><ul id=\"widget_ul_"+index+"\" class=\"rhs_b_s__books\"> </ul></div>");
		if(this.whitepaperVcrItems!=null && this.whitepaperVcrItems.length>0){
			if(this.whitepaperVcrItems.length>2){
				// take 2 random 
				first = Math.floor(Math.random() * this.whitepaperVcrItems.length);
				second = Math.floor(Math.random() * this.whitepaperVcrItems.length);
				while (first == second) {
				    second = Math.floor(Math.random() * this.whitepaperVcrItems.length);
				}
				// f_vcrrightbar_sponsorship is used for impression tracking
				$( "#widget_ul_"+index ).append(this.addWidgetVcrItem(this.whitepaperVcrItems[first],"f_vcrrightbar_sponsorship"));
				$( "#widget_ul_"+index ).append(this.addWidgetVcrItem(this.whitepaperVcrItems[second],"f_vcrrightbar_sponsorship"));				
			}else{
				$.each(this.whitepaperVcrItems, function(i,vcrItem) {
					// f_vcrrightbar_sponsorship is used for impression tracking
					$( "#widget_ul_"+index ).append(relatedRightbar.addWidgetVcrItem(vcrItem,"f_vcrrightbar_sponsorship"));
				});
			}
			// only display the sponsorship if we have white-papers to show
			this.addWidgetSponsorship(index);
			this.whitepaperWidgetDisplayed= true;
		}
	},
	
	addBanner : function(type){
		bannerResult="<div class=\"banner_type3\" id=\"id_300x250_banner_"+type+"\"><script type='text/javascript'>googletag.cmd.push(function() { googletag.display('id_300x250_banner_"+type+"'); });</script></div> <div class=\"clear\"></div>";
		$('.article_page_right').append(bannerResult);
		
	},
	
	addWhitespace : function(){
		$('.article_page_right').append("<div class=\"rhs_b_s__whitespace\"></div>");
	},
	
	addRelatedSectionGATracking: function(linkType, clickSource){
		trackingResult="?utm_campaign=rightbar_v2&utm_source=infoq&utm_medium="+linkType+"_link";
		if(linkType!="author"){
			trackingResult+="&utm_content=link_"+clickSource;
		}
		return trackingResult;
	},
	
	addWhitepaperSectionGATracking: function(){		
		return "&utm_source=infoq&utm_medium=related_content_sponsored_link&utm_campaign=relatedContent_sponsored_"+contentUriMapping+"_clk";	
	},
	
	formatDate : function(timeInMilliseconds) {
		// create a new date with the browser locale
        var date = new Date();
        // set the milliseconds to this localized date
        date.setTime(timeInMilliseconds);
        // get the relative time
        moment.lang(InfoQConstants.language);
        var momentDate = moment(date);        
      	// moment.js needs upper case for date format to work as we have for content.
      	return momentDate.format(contentDatetimeFormat.toUpperCase());
	},
	
	rightbarDisplay : function(){
		this.parseRecommendationsJson();
		this.parseWhitepareVcrJson();
		this.parseSponsorshipJson();
		this.contentHeight = $('.article_page_left').height()- $('.comments').height()-$('.all_comments').height() ;
		
		hasWhitepaper = this.whitepaperVcrItems!=null && this.whitepaperVcrItems.length>0;
		
		// rightbar algo for short medium and large pages
		if(this.contentHeight < this.mediumHeight){
			this.addRecommendationSection(9,1);
			if(hasWhitepaper){
				this.addWhitePaperWidget(1);
			}else{
				// TODO: see about native stuff here
				this.addBanner("top");
			}
			
		}else if(this.contentHeight < this.largeHeight){
			this.addRecommendationSection(9,1);
			if(hasWhitepaper){
				this.addWhitePaperWidget(1);
			}else{
				this.addBanner("top");
			}
			this.addRecommendationSection(6,2);			
			if(!hasWhitepaper){
				this.addBanner("bottom");
			}
		}else{
			if(hasWhitepaper){
				// sponsored with whitepaper
				this.addRecommendationSection(11,1);
				this.addWhitePaperWidget(1);
				this.addRecommendationSection(11,2);
				this.addBanner("top");
				this.addRecommendationSection(11,3);
			}else{
				this.addRecommendationSection(11,1);
				this.addBanner("top");
				this.addRecommendationSection(11,2);
				this.addBanner("bottom");
				this.addRecommendationSection(11,3);
			}
		}
		
		// the following code is to make the whitespace computation of elements in the right bar to have them spread in the rightbar
		if($('.article_page_right').height() < relatedRightbar.contentHeight){
			
			$('.article_page_right').height(relatedRightbar.contentHeight);
			
			// for whitespace computation: Convert .article_page_right to a flex container and apply some styles
			$(".article_page_right").css("display", "flex" );
			$(".article_page_right").css("flex-direction", "column");
			$(".article_page_right").css("justify-content", "space-between");
		}
	}
};

relatedRightbar.rightbarDisplay();

$(function(){
	// track the impression
	// f_vcrrightbar_sponsorship is available at document ready 
	Tracker.doTrackVcrRightbarImpressions("f_vcrrightbar_sponsorship");
	
	// only do the tracking here so that all GA vars are initialized
	if(relatedRightbar.whitepaperWidgetDisplayed){
		_gaq.push(['_setCustomVar', 1, 'Whitepaper widget Related Rightbar', "Display", 3]);
	}
	
}); 