/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(['../accUtils', "knockout", "exports", "ojs/ojbootstrap", "ojs/ojarraytreedataprovider", 'ojs/ojcollectiondataprovider', "ojs/ojknockout-model", "ojs/ojkeyset", "comorbLookup",
    "searchFactory", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojselectcombobox", "ojs/ojselectsingle", "ojs/ojknockout", "ojs/ojlistview", "ojs/ojradioset",
    "ojs/ojformlayout", "ojs/ojslider", "ojs/ojbutton", "ojs/ojaccordion", "ojs/ojdatetimepicker", "ojs/ojlabel", "ojs/ojpopup"],
        function (accUtils, ko, exports, ojbootstrap_1, ArrayTreeDataProvider, CollectionDataProvider, KnockoutUtils, ojkeyset_1, ComorbLookup, searchFactory, ArrayDataProvider, ListDataProviderView) {
            function CustomerViewModel() {
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
                
                var self = this;
                
                this.connected = () => {
                    accUtils.announce('Such - Seite geladen.');
                    document.title = "Suche";
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

                this.expanded = new ojkeyset_1.AllKeySetImpl();

                this.suchtyp = ko.observable("lokal");
                this.suchestart = ko.observable("Suche starten");
                this.suchestatus = ko.observable("");
                this.suchergebnis = ko.observable("");

                this.kisIdentifier = ko.observable("");
                this.gender = ko.observable("");
                this.smokingStatus = ko.observable("");
                this.preName = ko.observable("");
                this.sureName = ko.observable("");
                this.birthName = ko.observable("");
                this.birthDate = ko.observable("");
                this.birthPlace = ko.observable("");

                this.medDatasource = ko.observable();


                this.morbs = ko.observableArray();
                this.morbsProvider = new ArrayDataProvider(this.morbs, {
                    keyAttributes: 'id'
                });

                this.comorbData = ComorbLookup;
                this.comorbsource = new ArrayDataProvider(this.comorbData, {keyAttributes: 'komid'});

                this.theras = ko.observableArray([
                ]);


                this.medCollection = searchFactory.createMedCollection();
                this.medCollection.fetch();
                this.medDataArr = KnockoutUtils.map(this.medCollection, null, true);
                //console.log(this.medDataArr());
                this.medDataSource = new ArrayDataProvider(this.medDataArr, {keyAttributes: 'medId'});
                //this.medDatasource = new CollectionDataProvider(this.medCollection, {keyAttributes: 'medId'});

                this.mapMedFields = (item) => {
                    const data = item.data;
                    const mappedItem = {
                        data: {label: data.medName(), value: data.medId()},
                        metadata: {key: data.medName()},
                    };
                    return mappedItem;
                };
                this.medMapping = {mapFields: this.mapMedFields};
                this.medListProvider = new ListDataProviderView(this.medDataSource, {
                    dataMapping: this.medMapping,
                });

                this.mapMorbFields = (item) => {
                    const data = item.data;
                    const mappedItem = {
                        data: {label: data.label, value: data.komid},
                        metadata: {key: data.komid},
                    };
                    return mappedItem;
                };
                this.morbsMapping = {mapFields: this.mapMorbFields};
                this.morbsListProvider = new ListDataProviderView(this.comorbsource, {
                    dataMapping: this.morbsMapping,
                });


                this.resetButtonClicked = function (event, data) {
                    data.kisIdentifier("");
                    data.gender("");
                    data.smokingStatus("");
                    data.preName("");
                    data.sureName("");
                    data.birthName("");
                    data.birthDate("");
                    data.birthPlace("");
                }

                this.searchButtonClicked = function (event, data) {
                    //console.log (event);
                    //console.log (data);
                    enteredSomething = false;
                    qbeString = '{';
                    if (!data.kisIdentifier() == "") {
                        //data.search.identifyingData.kisIdentifier = data.kisIdentifier();
                        qbeString = qbeString + '"identifyingData": {"kisIdentifier": ' + data.kisIdentifier();
                        enteredSomething = true;
                    }
                    if (!data.preName() == "") {
                        //data.search.identifyingData.preName = data.preName();
                        if (!enteredSomething) {
                            qbeString = qbeString + '"identifyingData": {';
                        } else {
                            qbeString = qbeString + ',';
                        }
                        qbeString = qbeString + '"preName": "' + data.preName() + '"'
                        enteredSomething = true;
                    }
                    if (!data.sureName() == "") {
                        //data.search.identifyingData.name = data.sureName();
                        if (!enteredSomething) {
                            qbeString = qbeString + '"identifyingData": {';
                        } else {
                            qbeString = qbeString + ',';
                        }
                        qbeString = qbeString + '"name": "' + data.sureName() + '"'
                        enteredSomething = true;
                    }
                    if (!data.birthName() == "") {
                        //data.search.identifyingData.birthName = data.birthName();
                        if (!enteredSomething) {
                            qbeString = qbeString + '"identifyingData": {';
                        } else {
                            qbeString = qbeString + ',';
                        }
                        qbeString = qbeString + '"maidenName": "' + data.birthName() + '"'
                        enteredSomething = true;
                    }
                    if (!data.birthDate() == "") {
                        if (!enteredSomething) {
                            qbeString = qbeString + '"identifyingData": {';
                        } else {
                            qbeString = qbeString + ',';
                        }
                        qbeString = qbeString + '"dateOfBirth": "' + data.birthDate() + '"'
                        //data.search.identifyingData.dateOfBirth = data.birthDate();
                        enteredSomething = true;
                    }
                    if (!data.birthPlace() == "") {
                        //data.search.identifyingData.birthPlace = data.birthPlace();
                        if (!enteredSomething) {
                            qbeString = qbeString + '"identifyingData": {';
                        } else {
                            qbeString = qbeString + ',';
                        }
                        qbeString = qbeString + '"birthPlace": "' + data.birthPlace() + '"'
                        enteredSomething = true;
                    }

                    if (enteredSomething) {
                        qbeString = qbeString + '}'; //end of identifyingData section
                    }

                    enteredBasisData = false;
                    if (!data.gender() == "") {
                        //data.search.basisData.gender = data.gender();
                        if (enteredSomething) {
                            qbeString = qbeString + ','; //end of identifyingData section
                        }
                        qbeString = qbeString + '"basisData": {"gender" :' + data.gender();
                        enteredSomething = true;
                        enteredBasisData = true;
                    }

                    if (!data.smokingStatus() == "") {
                        //data.search.basisData.gender = data.gender();
                        if (enteredSomething) {
                            qbeString = qbeString + ','; //end of identifyingData section
                        }
                        if (!enteredBasisData) {
                            qbeString = qbeString + '"basisData": {';
                        }
                        qbeString = qbeString + '"smokingStatus" : {"smokingStatus": ' + data.smokingStatus() + '}}';
                        enteredSomething = true;
                        enteredBasisData = true;
                    }

                    if (enteredBasisData) {
                        qbeString = qbeString + '}'; //end of basisData section
                    }

                    qbeString = qbeString + '}'; //close JSON document

                    if (!enteredSomething) {
                        let popup = document.getElementById("searchpopup1");
                        popup.open("#btnSearch");
                    }
                    

                    console.log(qbeString);
                    if (enteredSomething) {
                        //this.qbeCount = searchFactory.createqbeCountModel(qbeString);
                        //this.qbeCount.fetch();
                        //console.log(this.qbeCount);
                        let popup = document.getElementById("searchcountpopup1");
                        popup.open("#btnSearch");
                        self.suchergebnis("Führe Query aus & zähle Ergebnisse");
                        
                        $.ajax({
                            url: "https://edge-appconf.edge1.130.162.210.16.nip.io/edge/psaq/patient/qbe/count",
                            type: "PUT",
                            data: qbeString,
                            contentType: "application/json",
                            //crossDomain: true,
                            async: true,
                            cache: false,
                            //dataType: "jsonp", 
                            //headers: {
                            //    accept: "application/json",
                            //    "Access-Control-Allow-Origin": "*"
                            //},
                            success: function (result) {
                                console.log(result);
                                tmp = self.suchergebnis();
                                self.suchergebnis(tmp + "\nDatensätze gefunden: " + result.numFound);
                            }
                        });
                    }

                }

                this.cancelListener = function () {
                    let popup = document.getElementById("searchpopup1");
                    popup.close();
                }
                this.cancelCountListener = function () {
                    let popup = document.getElementById("searchcountpopup1");
                    popup.close();
                }
                this.continueCountListener = function () {
                    let popup = document.getElementById("searchcountpopup1");
                    popup.close();
                }

                //document.getElementById("searchpanel").style.color = searchcol();
            }

            /*
             * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
             * return a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.
             */
            return CustomerViewModel;
        }
);