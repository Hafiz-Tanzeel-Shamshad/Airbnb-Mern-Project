mapboxgl.accessToken = mapToken;
console.log(mapToken); //restart server again 

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12", //change style  "dark-v11"
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

//access coordinates indirectly ejs file
//console.log(listing.geometry.coordinates);//store array like [73.0519064,33.5913373]

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4> <p>Exact Location will be provided after booking</p> `))
    .addTo(map);