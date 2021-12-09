var province_arr = new Array("Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon");

// cities
var s_a = new Array();
s_a[0] = "";
s_a[1] = "Calgary|Edmonton|Red Deer|Strathcona County|Lethbridge|Airdrie|Wood Buffalo|Grande Prairie|St. Albert|Medicine Hat";
s_a[2] = "Vancouver|Surrey|Burnaby|Richmond|Abbotsford|Langley|Coquitlam|North Vancouver|Kelowna|Saanich";
s_a[3] = "Winnipeg|Brandon|Steinbach|Portage la Prairie|Winkler|Thompson|Selkirk|Morden|Dauphin";
s_a[4] = "Moncton|Saint John|Fredericton|Dieppe|Riverview|Quispamsis|Miramichi|Edmundston";
s_a[5] = "St. John's|Conception Bay South|Mount Pearl|Paradise|Corner Brook|Grand Falls - Windsor|Gander|Portugal Cove - St. Philip's|Happy Valley - Goose Bay|Torbay";
s_a[6] = "Aklavik	Ham|Behchokǫ̀ (Rae-Edzo)|Délı̨nę (Fort Franklin)|Fort Good Hope|Fort Liard|Fort McPherson|Fort Providence|Fort Resolution|Fort Simpson|Fort Smith	Town|Hay River|Inuvik|Norman Wells|Tuktoyaktuk|Tulita (Fort Norman)|Whatì (Lac La Martre)|Yellowknife";
s_a[7] = "Halifax|Cape Breton|Truro|Amherst|New Glasgow|Bridgewater|Yarmouth|Kentville";
s_a[8] = "Arviat|Baker Lake|Cambridge Bay|Iqaluit|Kugluktuk|Pangnirtung|Rankin Inlet";
s_a[9] = "Toronto|Ottawa|Mississauga|Brampton|Hamilton|London|Markham|Vaughan|Kitchener|Scarborough";
s_a[10] = "Kensington|Souris|Montague|Alberton";
s_a[11] = "Montréal|Québec|Laval|Gatineau|Longueuil|Sherbrooke|Lévis|Saguenay|Trois-Rivières|Terrebonne";
s_a[12] = "Saskatoon|Regina|Prince Albert|Moose Jaw|Swift Current|Yorkton|North Battleford|Warman|Estevan|Martensville";
s_a[13] = "Whitehorse|Dawson City|Watson Lake|Haines Junction";


function populateCities(provinceElementId, cityElementId) {

    var selectedProvinceIndex = document.getElementById(provinceElementId).selectedIndex;

    var cityElement = document.getElementById(cityElementId);

    cityElement.length = 0; // Fixed by Julian Woods
    cityElement.options[0] = new Option('Select City', '');
    cityElement.selectedIndex = 0;

    var city_arr = s_a[selectedProvinceIndex].split("|");

    for (var i = 0; i < city_arr.length; i++) {
        cityElement.options[cityElement.length] = new Option(city_arr[i], city_arr[i]);
    }
}

function populateCountries(provinceElementId, cityElementId) {
    // given the id of the <select> tag as function argument, it inserts <option> tags
    var provinceElement = document.getElementById(provinceElementId);
    provinceElement.length = 0;
    provinceElement.options[0] = new Option('Select Province', "");
    provinceElement.selectedIndex = 0;
    for (var i = 0; i < province_arr.length; i++) {
        provinceElement.options[provinceElement.length] = new Option(province_arr[i], province_arr[i]);
    }

    // Assigned all countries. Now assign event listener for the cities.

    if (cityElementId) {
        provinceElement.onchange = function () {
            populateCities(provinceElementId, cityElementId);
        };
    }
}



populateCountries("province", "city");