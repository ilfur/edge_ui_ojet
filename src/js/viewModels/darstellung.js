/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['../accUtils', 'ojs/ojcorerouter', 'knockout', 'ojs/ojbootstrap', "ojs/ojarraytreedataprovider", "ojs/ojarraydataprovider", "ojs/ojknockouttemplateutils", "ojs/ojanimation",
    "ojs/ojcollapsible", "ojs/ojslider", "ojs/ojformlayout", "ojs/ojbutton", "ojs/ojlabel", "ojs/ojdrawerlayout", "ojs/ojknockout", "ojs/ojtreeview", "ojs/ojchart"],
        function (accUtils, CoreRouter, ko, Bootstrap, ArrayTreeDataProvider, ArrayDataProvider, KnockoutTemplateUtils, AnimationUtils) {
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

		this.animate = function (selector, open, delay) {
                    const el = document.querySelector(selector);
                    el.style.transitionDelay = delay;
                    if (open) {
                      el.classList.remove("fold-closed");
                    }
                    else {
                      el.classList.add("fold-closed");
                    }
                  };

                this.toggle = function () {
	          console.log("called toggle function...");
                  const rootElement = document.querySelector(".fold-panel1");
                  const parentElement = document.querySelector(".fold-panels-parent");
                  if (rootElement.classList.contains("fold-closed")) {
                    parentElement.classList.remove("fold-panels-parent-closed");
                    //var self = this;
                    var show = function () {
                      self.animate(".fold-panel1", true, "0ms");
                      self.animate(".fold-panel2", true, "217ms");
                      self.animate(".fold-panel3", true, "467ms");
                      self.animate(".fold-panel4", true, "700ms");
                    };
                    setTimeout(() => {
                      // wait for animation of "fold-panels-parent-closed" to be finished
                      // and then unfold action panels:
                      show();
                      }, 300);
                  }
                  else {
                    self.animate(".fold-panel4", false, "0ms");
                    self.animate(".fold-panel3", false, "217ms");
                    self.animate(".fold-panel2", false, "467ms");
                    self.animate(".fold-panel1", false, "700ms");
                    setTimeout(() => {
                      // wait for action panels to get folded and then
                      // hide the top bar using "fold-panels-parent-closed" animation
                      parentElement.classList.add("fold-panels-parent-closed");
                      }, 700);

                  }
		}

                this.rootViewModel = ko.dataFor(document.getElementById('globalBody'));

                this.currentArrayPosition = ko.observable(0);
                this.currentPatient = ko.observable(this.rootViewModel.foundData()[this.currentArrayPosition()]);
		this.suchtyp = ko.observable(this.rootViewModel.searchType());
                this.currentMorbs = ko.observableArray(this.currentPatient().comorbidity);
                this.currentTreatment = ko.observableArray(this.currentPatient().treatment);
	        this.suchergebnis = ko.observable("");
		this.comorbCollection = ko.observableArray([]);
	        this.bloodPressureCollection = ko.observableArray([]);
                this.bloodChartProvider = new ArrayDataProvider(this.bloodPressureCollection , { keyAttributes: "datOfCollection" });

		this.pageBusyContext = oj.Context.getPageContext().getBusyContext();
                this.pageBusyContext.whenReady().then(function () {
	            self.toggle();
                });

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
	            data.rootViewModel.foundPosition(data.currentArrayPosition());
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
	            data.rootViewModel.foundPosition(data.currentArrayPosition());
                    data.currentTreatment(data.currentPatient().treatment);

		    ko.utils.arrayForEach(data.currentPatient().comorbidity, function(morb) {
                      var found = self.comorbCollection().find (item => item.comId == morb.comId);
                      morb.comName = ko.observable (found.comName);
                    });

                    data.currentMorbs(data.currentPatient().comorbidity);
                }


                this.cancelHistory = function () {
                    let popup = document.getElementById("searchcountpopup1");
                    popup.close();
                }


		this.bloodpressures = function (event,data){
			let popup = document.getElementById("bloodpressurepopup");
			self.bloodPressureCollection(self.currentPatient().basisData.bloodPressures);
                        popup.open();
		}

		this.bloodpressuresClose = function (event,data){
			let popup = document.getElementById("bloodpressurepopup");
                        popup.close();
		}

		this.history = function (event,data){
			let popup = document.getElementById("searchcountpopup1");
                        popup.open("#btnSearch");
                        self.suchergebnis("Führe Query aus & zähle Ergebnisse\n");

                        self.localCountUrl = "/edge/psaq/patient/qbe/history/count";
                        self.distCountUrl = "/core/radiq/patients/distqbe/history/count";
                        if (self.suchtyp() == "lokal") {
                            self.countUrl = self.localCountUrl;
                        } else {
                            self.countUrl = self.distCountUrl;
                        }

			let qbeString = '{"identifyingData":{"patientPseudonym":"'+data.currentPatient().identifyingData.patientPseudonym+'"}}';
			console.log (qbeString);
                        $.ajax({
                            url: self.countUrl,
                            type: "POST",
                            data: qbeString,
                            contentType: "application/json",
                            async: true,
                            cache: false,
                            success: function (result) {
                                console.log(result);
                                tmp = self.suchergebnis();
                                rows = ko.observable(0);
                                if (self.suchtyp() == "lokal") {
                                    self.suchergebnis(tmp + "\nDatensätze in Historie gefunden: " + result.numFound);
                                } else {
                                    result.forEach(function (element) {
                                        self.suchergebnis(self.suchergebnis() + "\nPartner: " + element.partnerName + " - " + element.status );
                                        rows(rows() + element.numTotal);
                                    })
                                    self.suchergebnis(self.suchergebnis() + "\nDatensätze gefunden: " + rows());
                                }
                            }
                        });
                }
                

                this.historyCont = function (event,data) {
                    self.localqbeUrl = "/edge/psaq/patient/qbe/history/search";
                    self.distqbeUrl = "/core/radiq/patients/distqbe/history/search";
                    if (self.suchtyp() == "lokal") {
                        self.countUrl = self.localqbeUrl;
                    } else {
                        self.countUrl = self.distqbeUrl;
                    }

                    self.suchergebnis("Lade gefundene Daten herunter");
		    let qbeString = '{"identifyingData":{"patientPseudonym":"'+data.currentPatient().identifyingData.patientPseudonym+'"}}';
                    console.log(qbeString);

                    $.ajax({
                        url: self.countUrl,
                        type: "POST",
                        data: qbeString,
                        contentType: "application/json",
                        async: false,
                        cache: false,
                        success: function (result) {

                            console.log(result);
                            var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                            if (self.suchtyp() == "lokal") {
                                rootViewModel.foundHist(result);
                                rootViewModel.searchType("lokal");
                            } else {
                                rootViewModel.foundHist(result.results);
                                rootViewModel.searchType("dist");
                            }
                            let popup = document.getElementById("searchcountpopup1");
                            popup.close();
                            rootViewModel.router.go({path: 'historie'});
                        }
                    });
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
