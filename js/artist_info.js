// *********
// Artists
// *********

// Input: Artist name (from facebook)
// Return: Artist URI
function replace_space(str){
	var updated_str = str.replace(/\ /g,"_");  
	return updated_str;
}

/*
function artist_info(artist_uri){
    var query   = "SELECT ?name ?abstract ?activeStart WHERE "
                + "{ <" + artist_uri + ">   dbpprop:name ?name ;"
                                        + " dbpedia-owl:abstract ?abstract;"
                                        + " dbpedia-owl:activeYearsStartYear ?activeStart"
                + " . FILTER langMatches(lang(?abstract), 'en')"
                + " . FILTER langMatches(lang(?name), 'en')}"
                + "LIMIT 1"
    console.log(query)
    var properties = ['name','abstract', 'activeStart']
    var displayName = dbpedia_query_json(query,properties);
    return displayName;
}*/



// Requires: Array of artist uris
// Effects: Returns 
function artists_info(artist_uri_array){
    var artist_list = ""
    for(var i = 0; i <  artist_uri_array.length; i++) {
        artist_list += "<"+artist_uri_array[i] + ">"
        if (i != artist_uri_array.length - 1){
            artist_list += ","
        }
    }

    var query   = "SELECT distinct ?name ?abstract (substr(str(?activeStart),1,10) AS ?activeStart) ?depiction "
                + "WHERE { "
                + " ?artist_uri  dbpprop:name ?name;"
                            + " dbpedia-owl:abstract ?abstract;"
                            + " dbpedia-owl:activeYearsStartYear ?activeStart;"
                            + " foaf:depiction ?depiction"
                + " . FILTER langMatches(lang(?abstract), 'en')"
                + " . FILTER langMatches(lang(?name), 'en')"
                + " . FILTER (?artist_uri in ("+artist_list+"))}"
    var properties = ['name','abstract', 'activeStart', 'depiction']
    console.log(query);
    var artistsInfo = dbpedia_query_json(query,properties);
    return artistsInfo;
}

// Returns delimited string of albums
function artist_albums_info(artist_uri_array){
    var artist_list = ""
    for(var i = 0; i <  artist_uri_array.length; i++) {
        artist_list += "<"+artist_uri_array[i] + ">"
        if (i != artist_uri_array.length - 1){
            artist_list += ","
        }
    }

    var query   = "SELECT distinct ?album ?name (substr(str(?releaseDate),1,10) AS ?releaseDate) ?abstract" 
                + " WHERE {"
                + " ?album dbpedia-owl:artist ?artist_uri" 
                + " . { ?album rdf:type dbpedia-owl:Album}"
                + "UNION" 
                + "{ ?album rdf:type dbpedia-owl:album}"
                + " . ?album dbpprop:name ?name"
                + " . ?album dbpedia-owl:releaseDate ?releaseDate "
                + " . ?album dbpedia-owl:abstract ?abstract"
                + " . FILTER (?artist_uri in ("+artist_list+"))}"
    var properties = ['album','name','releaseDate','abstract'];
    var albumsInfo = dbpedia_query_json(query,properties);
    return albumsInfo;
}

// individual artist URI
function artist_URI(artist){
    var query   = "SELECT ?uri WHERE {"
                + "?uri rdf:type ?type;"
                + "rdfs:label ?artist"
                + ".FILTER (?type in (dbpedia-owl:Band, dbpedia-owl:Artist))"
                + ".FILTER (?artist in ('" + artist + "'@en, '" + artist + " (band)'@en, '" + artist + " (Band)'@en))"
                + ".FILTER langMatches(lang(?artist), 'en')"
                + "}"
    console.log(query);
    var artist_URI = dbpedia_query(query,'uri');
    return artist_URI;
}

function artist_URI2(artist){
    var query   = "SELECT ?uri WHERE {"
                + "?uri rdf:type ?type;"
                + "rdfs:label ?artist"
                + ".FILTER (?type in (dbpedia-owl:Band, dbpedia-owl:Artist))"
                + ".FILTER (?artist in ('" + artist + "'@en, '" + artist + " (band)'@en, '" + artist + " (Band)'@en))"
                + "}"
    console.log(query);
    var artist_URI = dbpedia_query(query,'uri');
    return artist_URI;
}

function artist_URI_old(artist){
    var query   = "SELECT ?uri WHERE {"
                + "{{?uri rdf:type dbpedia-owl:Band} UNION {?uri rdf:type dbpedia-owl:Artist}}"
                + " . ?uri rdfs:label ?artist"
                + " . FILTER (?artist in ('" + artist + "'@en, '" + artist + " (band)'@en, '" + artist + " (Band)'@en))}"
    console.log(query);
    var artist_URI = dbpedia_query(query,'uri');
    return artist_URI;
}

// Requires: Array of artists
// Returns: Array of artist URIs
function artist_list_URI(artist_array){
    //var time1 = new Date();
    var artist_list = ""
    for(var i = 0; i <  artist_array.length; i++) {
        artist_list += "'" + artist_array[i] + "'@en, '" + artist_array[i] + " (band)'@en, '" + artist_array[i] + " (Band)'@en"
        if (i != artist_array.length - 1){
            artist_list += ","
        }
    }
    var query   = "SELECT ?uri WHERE {"
                + "?uri rdf:type ?type;"
                + "rdfs:label ?artist"
                + ".FILTER (?type in (dbpedia-owl:Band, dbpedia-owl:Artist))"
                + ".FILTER langMatches(lang(?artist), 'en')"
                + ".FILTER (?artist in ("+artist_list+"))}"
    //console.log(query);
    var artist_URI = dbpedia_query_array(query,'uri')
    //var time2 = new Date();
    //console.log(time2.getTime() - time1.getTime());
    return artist_URI;
}

// Input: artist URI
// Output: Artist Display Name
function artist_displayName(artist_uri){
    var query 	= "PREFIX dbp: <http://dbpedia.org/resource/>"
            	+ "PREFIX dbpprop: <http://dbpedia.org/property/>"
            	+ "SELECT ?name WHERE "
            	+ "{ <" + artist_uri + "> dbpprop:name ?name}";
    var displayName = dbpedia_query(query,'name');
    return displayName;
}

// Returns wikipedia abstract as string (source is dbpedia)
function artist_abstract(artist_uri) {
    var query 	= "PREFIX dbp: <http://dbpedia.org/resource/>"
            	+ "PREFIX dbp2: <http://dbpedia.org/ontology/>"
            	+ "SELECT ?abstract WHERE "
            	+ "{ <" + artist_uri + "> dbp2:abstract ?abstract"
            	+ " . FILTER langMatches(lang(?abstract), 'en')}";	
    var abstract = dbpedia_query(query,'abstract');
    return abstract;
};

// Returns artist start date
function artist_activeStart(artist_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "SELECT ?activeStart WHERE "
                +"{ <" + artist_uri + "> dbp2:activeYearsStartYear ?activeStart }";
    var activeStart = dbpedia_query(query,'activeStart');
	return activeStart;

};

// Returns artist start date
function artist_activeEnd(artist_uri){
	var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "SELECT ?activeEnd WHERE "
                +"{ <" + artist_uri + "> dbp2:activeYearsEndYear ?activeEnd }";
    var activeEnd = dbpedia_query(query,'activeEnd');
	return activeEnd;
};

//Returns photo location from depiction field in dbpedia (note - most use outdated photo)
//no need to replace common (generally not localized)
function artist_photo(artist_uri) {
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX  foaf: <http://xmlns.com/foaf/0.1/>"
                + "SELECT ?depiction WHERE {"
                + " <" + artist_uri + "> foaf:depiction ?depiction}";
    var photo = dbpedia_query(query,'depiction');
    return photo;
};

// Returns delimited string of artists
function artist_related_list(artist_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "SELECT ?associatedBand WHERE { "
                + "<" + artist_uri + "> dbp2:associatedBand ?associatedBand}";
    var artistList = dbpedia_query_list(query,'associatedBand');
    return artistList;
}

// Returns delimited string of albums
function artist_album_list(artist_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?album WHERE {"
                + " ?album dbp2:artist <" + artist_uri + "> ." 
                + "{ ?album rdf:type dbp2:Album}"
                + "UNION" 
                + "{ ?album rdf:type dbp2:album}"
                + "  }";
    var artistList = dbpedia_query_list(query,'album');
    return artistList;
}

// Returns delimited string of albums
function artist_single_list(artist_uri){
    var query = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?single WHERE {"
                + " ?single dbp2:musicalArtist <" + artist_uri + "> ." 
                + " ?single rdf:type dbp2:Single }";
    var singleList = dbpedia_query_list(query,'single');
    return singleList;
}


// *********
// Albums
// *********

function album_displayName(album_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?name WHERE "
                + "{ <" + album_uri + "> dbpprop:name ?name}";
    var displayName = dbpedia_query(query,'name');
    return displayName;
}

// Returns album artist
function album_artist(album_uri) {
    var query   = "PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>"
                + "SELECT ?artist WHERE "
                + "{ <" + album_uri + "> dbpedia-owl:artist ?artist}";
    var artist = dbpedia_query(query,'artist');
    return artist;
}

//Returns photo location from depiction field in dbpedia (note - most use outdated photo)
//dbpedia - depiciton of - replace "commons" with location data in url
function album_photo(album_uri) {
    query = "PREFIX  foaf: <http://xmlns.com/foaf/0.1/>"
            + "SELECT ?depiction WHERE {"
            + " <" + album_uri + "> foaf:depiction ?depiction}";
    var photo = dbpedia_query(query,'depiction');
    
    //Replace album photo w/ 'en'
    if (photo) {
        photo = photo.replace('commons','en');
    }
    else {
            return false;
    }
    return photo;
}

// Returns wikipedia abstract as string (source is dbpedia)
function album_abstract(album_uri) {
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?abstract WHERE "
                + "{ <" + album_uri + "> dbp2:abstract ?abstract"
                + " . FILTER langMatches(lang(?abstract), 'en')}";  
    var abstract = dbpedia_query(query,'abstract');
    return abstract;
}

// Returns album start date
function album_releaseDate(album_uri){
	var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?releaseDate WHERE "
                +"{ <" + album_uri + "> dbp2:releaseDate ?releaseDate }";
    var releaseDate = dbpedia_query(query,'releaseDate');
	return releaseDate;
}

// Returns delimited string of albums
function album_single_list(album_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?single WHERE {"
                + " ?single dbpprop:fromAlbum <" + album_uri + "> ." 
                + " ?single rdf:type dbp2:Single }";
    var singleList = dbpedia_query_list(query,'single');
    return singleList;
}


// *********
// Singles
// *********
function single_displayName(single_uri){
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbpprop: <http://dbpedia.org/property/>"
                + "SELECT ?name WHERE "
                + "{ <" + single_uri + "> dbpprop:name ?name}";
    var displayName = dbpedia_query(query,'name');
    return displayName;
}

function single_abstract(single_uri){
	var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?abstract WHERE "
                + "{ <" + single_uri + "> dbp2:abstract ?abstract"
                + " . FILTER langMatches(lang(?abstract), 'en')}";  
    var abstract = dbpedia_query(query,'abstract');
    return abstract;
}

function single_releaseDate(single_uri){
// Returns artist start date
    var query   = "PREFIX dbp: <http://dbpedia.org/resource/>"
                + "PREFIX dbp2: <http://dbpedia.org/ontology/>"
                + "SELECT ?releaseDate WHERE "
                + "{ <" + single_uri + "> dbp2:releaseDate ?releaseDate}";  
	activeStart = dbpedia_query(query,'releaseDate');
	return activeStart;
}