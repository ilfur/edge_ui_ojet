/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['../accUtils', 'ojs/ojcorerouter', 'knockout', 'ojs/ojbootstrap', "ojs/ojarraytreedataprovider", "ojs/ojarraydataprovider", "ojs/ojknockouttemplateutils",
    "ojs/ojcollapsible", "ojs/ojslider", "ojs/ojformlayout", "ojs/ojbutton", "ojs/ojlabel", "ojs/ojdrawerlayout", "ojs/ojknockout", "ojs/ojtreeview"],
        function (accUtils, CoreRouter, ko, Bootstrap, ArrayTreeDataProvider, ArrayDataProvider, KnockoutTemplateUtils) {
            function DarstellungViewModel() {
                 "use strict";
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

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                //this.foundData = rootViewModel.foundData;
                //console.log(this.foundData());

                this.dataProvider = new ArrayDataProvider(rootViewModel.foundData(), {
                    keyAttributes: "initialTxnId",
                });

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
