/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['../accUtils', 'ojs/ojcorerouter', 'knockout', 'ojs/ojbootstrap', "ojs/ojarraytreedataprovider", "ojs/ojarraydataprovider", "ojs/ojknockouttemplateutils", 
    "ojs/ojtimeline", "ojs/ojcollapsible", "ojs/ojslider", "ojs/ojformlayout", "ojs/ojbutton", "ojs/ojlabel", "ojs/ojdrawerlayout", "ojs/ojknockout", "ojs/ojtreeview"],
        function (accUtils, CoreRouter, ko, Bootstrap, ArrayTreeDataProvider, ArrayDataProvider, KnockoutTemplateUtils) {
            function DarstellungViewModel() {
                var self = this;
                // Below are a set of the ViewModel methods invoked by the oj-module component.
                // Please reference the oj-module jsDoc for additional information.

                /**
                 * Optional ViewModel method invoked after the View is inserted into the
                 * document DOM.  The application can put logic that requires the DOM being
                 * attached here.
                 * This method might be called multiple times - after the View is created
                 * and inserted into the DOM and after the View is reconnected
                 * after being disconnected.
                 */
                this.connected = () => {
                    accUtils.announce('Seite geladen.');
                    document.title = "Darstellung";
                    // Implement further logic if needed
                };

                /**
                 * Optional ViewModel method invoked after the View is disconnected from the DOM.
                 */
                this.disconnected = () => {
                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after transition to the new View is complete.
                 * That includes any possible animation between the old and the new View.
                 */
                this.transitionCompleted = () => {
                    // Implement if needed
                };

                this.rootViewModel = ko.dataFor(document.getElementById('globalBody'));

                this.currentArrayPosition = ko.observable(0);
                this.currentPatient = ko.observable(this.rootViewModel.foundHist()[this.currentArrayPosition()]);
		this.suchtyp = ko.observable(this.rootViewModel.searchType());
		console.log(this.currentPatient());
                this.currentMorbs = ko.observableArray(this.currentPatient().comorbidity);
                this.currentTreatment = ko.observableArray(this.currentPatient().treatment);
		this.comorbCollection = ko.observableArray([]);
	
		this.timelineProvider = new ArrayDataProvider(this.rootViewModel.foundHist(), {
                  keyAttributes: "version"
                });

		this.endDate = new Date();
		this.endDate.setDate(this.endDate.getDate()+1);
		this.startDate = new Date(this.currentPatient().modifiedAt);
		this.startDate.setDate(this.startDate.getDate()-1);
		this.calStartDate = ko.observable(this.startDate.toISOString());
		this.calEndDate = ko.observable(this.endDate.toISOString());

		this.currentDate = new Date().toISOString();
		this.referenceObjects = [
                  {
                      value: this.currentDate,
                  },
                ];

		$.ajax({
                      url: "/edge/fpa/lookup/comorbidities",
                      type: "GET",
                      contentType: "application/json",
                      //crossDomain: true,
                      async: false,
                      cache: false,
                      success: function (result) {
                          self.comorbCollection(result);
                          ko.utils.arrayForEach(self.currentMorbs(), function(morb) {
                            var found = result.find (item => item.comId == morb.comId);
                            morb.comName = ko.observable (found.comName);
                          });
                      }
                });

		this.hashme = function (obj) {
                   var hc = 0;
                   var chars = JSON.stringify(obj).replace(/\{|\"|\}|\:|,/g, '');
                   var len = chars.length;
                   for (var i = 0; i < len; i++) {
                       // Bump 7 to larger prime number to increase uniqueness
                       hc += (chars.charCodeAt(i) * 7);
                   }
                   return hc;
                }

                this.changed = function (object1, object2) {
                   if (self.hashme(object1) === self.hashme(object2)) {
			   return "";
                   } else {
	                   return "oj-bg-warning-10";
	           }
	        }
		
                this.forward = function (event, data) {
                    data.currentArrayPosition(data.currentArrayPosition()+1);
                    if (data.currentArrayPosition() == data.rootViewModel.foundHist().length) {
                        data.currentArrayPosition(0);
                    }

                    data.currentPatient(data.rootViewModel.foundHist()[data.currentArrayPosition()]);
                    data.currentTreatment(data.currentPatient().treatment);
		    
	       	    ko.utils.arrayForEach(data.currentPatient().comorbidity, function(morb) {
                      var found = self.comorbCollection().find (item => item.comId == morb.comId);
                      morb.comName = ko.observable (found.comName);
                    });
                    
		    data.currentMorbs(data.currentPatient().comorbidity);
                }
                
                this.backward = function (event, data) {
                    data.currentArrayPosition(data.currentArrayPosition()-1);
                    if (data.currentArrayPosition() < 0 ) {
                        data.currentArrayPosition(data.rootViewModel.foundHist().length-1);
                    }
                    data.currentPatient(data.rootViewModel.foundHist()[data.currentArrayPosition()]);
                    data.currentTreatment(data.currentPatient().treatment);

		    ko.utils.arrayForEach(data.currentPatient().comorbidity, function(morb) {
                      var found = self.comorbCollection().find (item => item.comId == morb.comId);
                      morb.comName = ko.observable (found.comName);
                    });

                    data.currentMorbs(data.currentPatient().comorbidity);
                }

		this.zurueck = function (event,data){
	           data.rootViewModel.foundHist([]);
		   data.rootViewModel.router.go({path: 'darstellung'});
                }
                

            }

            /*
             * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
             * return a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.
             */
            return DarstellungViewModel;
        }
);
