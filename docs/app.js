var css = require('./app.scss');
var $ = require("jquery");

var Thamesmead = (function () {
    var init,
        callAjax,
        displayData,
        displayMap,
        body = document.getElementById('app');
        init = function (event) {
           callAjax(event);
        };
        callAjax = function (event) {
          $.ajax({
            type: "GET",
            url: 'https://play.geokey.org.uk/api/projects/77/?format=json',
            dataType: "json",
            crossDomain: true,
            success: function(ajaxData){
                    var data = ajaxData;
                    displayData(data);
                    displayMap(data);
                    document.getElementById('show').addEventListener('click', showFunction);
               },
            error: function(xhr, textStatus, errorThrown){
                      alert('request failed');
                    }
           });
        }
        displayData = function (data) {
          var header = document.createElement('header');
          body.appendChild(header)

          var mainProjectTitle = document.createElement('h1');
          mainProjectTitle.innerHTML = data.name;
          header.appendChild(mainProjectTitle);

          var contributionsNum = document.createElement('p');
          contributionsNum.innerHTML = 'Total of contributions:  <span>'+ data.contribution_info.total +'</span>';
          header.appendChild(contributionsNum);

          var showContribution = document.createElement('button');
          showContribution.innerHTML = 'Show Contributions';
          showContribution.setAttribute('id', 'show')
          header.appendChild(showContribution);

          var main = document.createElement('main');
          body.appendChild(main);

          var article = document.createElement('article');
          main.appendChild(article);

          var projectsList = document.createElement('ul');
          projectsList.setAttribute('id', 'list')
          article.appendChild(projectsList);

          var categories = data.categories;
          categories.map(function(o){
            var project = document.createElement('li');

            var projectName = document.createElement('h2');
            projectName.innerHTML = o.name;
            project.appendChild(projectName);

            var projectDate = document.createElement('p');
            projectDate.innerHTML = '<span>Created on </span>' + new Date(o.created_at).toUTCString();
            project.appendChild(projectDate);

            projectsList.appendChild(project)
          })
        };
        showFunction = function(event){
          $.ajax({
            type: "GET",
            url: 'https://play.geokey.org.uk/api/projects/77/contributions',
            dataType: "json",
            crossDomain: true,
            success: function(ajaxData){
                    var data = ajaxData;
                    var contributions = [];
                    data.features.map(function(o){
                    contributions.push(o.geometry.coordinates);

                    });
                    updateMap(contributions);
               },
            error: function(xhr, textStatus, errorThrown){
                      alert('request failed');
                    }
           });
        };
        updateMap = function(obj, x){
          var map = new google.maps.Map(document.getElementById('map'));
          google.maps.event.addDomListener(window, "resize", function() {
             var center = map.getCenter();
             google.maps.event.trigger(map, "resize");
             map.setCenter(center);
          });
          var markers = [];
          var bounds = new google.maps.LatLngBounds();
          obj.map(function(x){
              var data =x;
              var lat = x[1];
              var lng = x[0];

              var latLng = new google.maps.LatLng(lat, lng);
              var marker = new google.maps.Marker({
                  map: map,
                  position: latLng
              });
              markers.push(marker);
              bounds.extend(latLng);
          })
            map.fitBounds(bounds);
            var centerBounds = new google.maps.Marker({
                map: map,
                position: bounds.getCenter(),
                zoom: 14,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=C|FF0000|000000'
              });

        };

        displayMap = function (data) {
          var figure = document.createElement('figure');
          document.getElementsByTagName('main')[0].insertBefore(figure, document.getElementsByTagName('article')[0]);
          var mapDiv = document.createElement('div');
          mapDiv.setAttribute('id', 'map');
          figure.appendChild(mapDiv);
          var places = [];
          data.geographic_extent.coordinates.map(function(o){
            o.map(function(c){
                places.push(c)
              })
          });
        updateMap(places);
          };
        return {
            init: init
        };
    })();

    Thamesmead.init();
