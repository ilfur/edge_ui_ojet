/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['../accUtils', 'ojs/ojcorerouter', 'knockout', 'ojs/ojbootstrap', "ojs/ojarraytreedataprovider", "ojs/ojarraydataprovider", "ojs/ojknockouttemplateutils", 
    "ojs/ojcollapsible", "ojs/ojslider", "ojs/ojformlayout", "ojs/ojbutton", "ojs/ojlabel", "ojs/ojdrawerlayout", "ojs/ojknockout", "ojs/ojtreeview"],
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
                this.currentPatient = ko.observable(this.rootViewModel.foundData()[this.currentArrayPosition()]);
                this.currentMorbs = ko.observableArray(this.currentPatient().comorbidity);
                this.currentTreatment = ko.observableArray(this.currentPatient().treatment);

		this.comorbCollection = ko.observableArray([]);

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

                                
                this.forward = function (event, data) {
                    data.currentArrayPosition(data.currentArrayPosition()+1);
                    if (data.currentArrayPosition() == data.rootViewModel.foundData().length) {
                        data.currentArrayPosition(0);
                    }

                    data.currentPatient(data.rootViewModel.foundData()[data.currentArrayPosition()]);
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
                        data.currentArrayPosition(data.rootViewModel.foundData().length-1);
                    }
                    data.currentPatient(data.rootViewModel.foundData()[data.currentArrayPosition()]);
                    data.currentTreatment(data.currentPatient().treatment);

		    ko.utils.arrayForEach(data.currentPatient().comorbidity, function(morb) {
                      var found = self.comorbCollection().find (item => item.comId == morb.comId);
                      morb.comName = ko.observable (found.comName);
                    });

                    data.currentMorbs(data.currentPatient().comorbidity);
                }
                
                
                //this.KnockoutTemplateUtils = KnockoutTemplateUtils;

            }

            /*
             * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
             * return a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.
             */
            return DarstellungViewModel;
        }
);
