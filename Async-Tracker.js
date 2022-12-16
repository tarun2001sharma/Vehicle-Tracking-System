//Function to send a http request and return the response from the site.
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

let map;
let markers = [];
var curr;
var lati;
var longi;
var prev;
var obj;
var response;

async function initMap(){
    curr = {lat: 23.2115, lng: 72.6842 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: curr,
        mapTypeId: "terrain",
    });    

    var client = new HttpClient();
    response = await client.get('https://api.thingspeak.com/channels/1271022/feeds.json?results=2');

    console.log(response);
    obj = JSON.parse(response);
    lati = parseFloat(obj.feeds[1].field1);
    longi = parseFloat(obj.feeds[1].field2);
    curr = {lat: lati, lng: longi};
    prev = curr;

    addMarker(curr);

    var i = 0; 

    setInterval(async function(){ 
        console.log("************");
        console.log("New Response")
        console.log("************");
        obj = await client.get('https://api.thingspeak.com/channels/1271022/feeds.json?results=2', async function(response) {
            return JSON.parse(response);
        });
    
        lati = parseFloat(obj.feeds[1].field1);
        longi = parseFloat(obj.feeds[1].field2);
        curr = {lat: lati, lng: longi};
        prev = curr;

        if (curr != prev){
            addMarker(curr);
            deletemarker(i);
            i++;
            map.setCenter(curr);
            prev = curr;
        }
    }, 10000); 

}

//Function to add marker to the map at location.
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

//Function to remove marker from the map present at the ith index of the markers array.
function deletemarker(i){
    markers[i].setMap(null);
}