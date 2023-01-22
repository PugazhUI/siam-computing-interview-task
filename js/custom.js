// DOM ready function
$(document).ready(function () {    
    loadImages('plant');
});

// Load images
function loadImages(category, elem) {
    $(elem).addClass('active');
    $.ajax({
        type: 'get',
        url: 'https://api.unsplash.com/search/photos?client_id=m8SK2lmN0qKjHSu9yO0CqJUNfuJo6cW0AjlZmcRmeaI&per_page=10&query=' + category,
        beforeSend: function (data) {showLoader('true');},
        success: function (response) {
            processImages(response, category);
            showLoader('false');
        }
    });
    if($('.active').length > 1) {
        $('.gallery-filter-list-item a').removeClass("active");
        $(elem).addClass('active');
    }
    
}

// Get image details
function getImageDetails(imageId) {
    $.ajax({
        type: 'get',
        url: 'https://api.unsplash.com/photos/' + imageId + '?client_id=m8SK2lmN0qKjHSu9yO0CqJUNfuJo6cW0AjlZmcRmeaI',
        beforeSend: function (data) {showLoader('true');},
        success: function (response) {
            lightBox(response.urls.regular, response.views, response.downloads, response.links.download, response.user.username, response.user.profile_image.small, response.id); 
            showLoader('false');           
        }
    });
}

// Process images
function processImages(images, category) {
    images = images.results;
    saveImageIds(images);
    var imageData = '';
    for (var i = 0; i < images.length; i++) {
        imageId = "'" + images[i].id + "'";
        if (imageData == "") {
            imageData = '<li class="gallery-images-list-item"><a><img src="' + images[i].urls.regular + '" alt="' + category + '" onclick="getImageDetails(' + imageId + ')"/></a></li>';
        }
        else {
            imageData += '<li class="gallery-images-list-item"><a><img src="' + images[i].urls.regular + '" alt="' + category + '" onclick="getImageDetails(' + imageId + ')"/></a></li>';
        }
    }       
    $('#imageDiv').html("").html(imageData);
}

// loader
function showLoader(param) {
    if(param == "true"){
        $('#loader').removeClass('hide');
    } 
    if(param == "false"){
        $('#loader').addClass('hide');
    }    
}

// ImageIds
function saveImageIds(images){
    var imageIds = [];
    for (var i = 0; i < images.length; i++) {        
        imageIds.push(images[i].id);              
    }
    localStorage.removeItem('imageIds');
    localStorage.setItem('imageIds', JSON.stringify(imageIds));
}

// Lightbox
function lightBox(lightBoxImg, noOfViews, noOfDownloads, downloadLink, userName, userImg, imageId){    
    $('body').addClass('ov-hidden');
    $('#lightbox').fadeIn();  
    $('#lightboxImg').attr('src', lightBoxImg).attr('imageId', imageId);
    $('#avatarImg').attr('src', userImg);
    $('#noOfViews').html(noOfViews);
    $('#noOfDownloads').html(noOfDownloads);
    $('#download').attr('href', downloadLink);
    var imageIds = JSON.parse(localStorage.getItem('imageIds'));
    $('#leftArw, #rightArw').show();
    console.log(imageIds);
    console.log(imageId);
    var currentImageIndex = imageIds.indexOf(imageId);
    if(currentImageIndex == 0){
        $('#leftArw').hide();
    } 
    else {
        // debugger
        $('#leftArw').attr('onClick', "getImageDetails('"+imageIds[currentImageIndex-1]+"')");
    }
    if(currentImageIndex == imageIds.length -1){
        $('#rightArw').hide();
    } else {
        // debugger
        $('#rightArw').attr('onClick', "getImageDetails('"+imageIds[currentImageIndex+1]+"')");
    }
    
}

// closeLightBox
function closeLightBox(){
    $('body').removeClass('ov-hidden');
    $('#lightbox').fadeOut(); 
}