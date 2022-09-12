/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'keycloak', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, keycloak, Context, moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ArrayDataProvider, KnockoutTemplateUtils) {

     function ControllerViewModel() {

        this.KnockoutTemplateUtils = KnockoutTemplateUtils;

        // Handle announcements sent when pages change, for Accessibility.
        this.manner = ko.observable('polite');
        this.message = ko.observable();

        announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      let navData = [
        { path: '', redirect: 'ueber' },
        { path: 'darstellung', detail: { label: 'Forschungsdaten darstellen', iconClass: 'oj-ux-ico-information-s' } },
        { path: 'ueber', detail: { label: 'Über', iconClass: 'oj-ux-ico-information-s' } },
        { path: 'infos', detail: { label: 'Infos', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'registrierung', detail: { label: 'Forschungsdaten freigeben', iconClass: 'oj-ux-ico-fire' } },
        { path: 'suche', detail: { label: 'Forschungsdaten abfragen', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'admin', detail: { label: 'Admin', iconClass: 'oj-ux-ico-build' } }
      ];
      // Router setup
      this.router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      this.router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(this.router);

      this.selection = new KnockoutRouterAdapter(this.router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(2), {keyAttributes: "path"});

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("Rheuma und Lupus Forschungs POC");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("anonymous");
      this.statusTxt = ko.observable("");
      this.foundData = ko.observableArray("");


	     this.keycloak = Keycloak();
	     this.keycloak.onAuthSuccess = function () {
		             this.statusTxt = ko.observable("Auth Success");
		         };

	         this.keycloak.onAuthError = function (errorData) {
			         this.statusTxt = ko.observable("Auth Error: " + JSON.stringify(errorData) );
			     };

	     var initOptions = {
		             responseMode: 'fragment',
		             onLoad: 'login-required',
		             flow: 'standard'
		         };
	     this.keycloak.init({onLoad: 'login-required', checkLoginIframe: false} ).success((auth) => {
                this.statusTxt (auth ? 'Authenticated' : 'Not Authenticated'); 
                this.userLogin(this.keycloak.tokenParsed.name);
		this.groupNames = ko.observableArray (this.keycloak.tokenParsed.groups) ;
                this.userToken = ko.observable (this.keycloak.token);
	     });

      // Footer
      this.footerLinks = [
        {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
     }

     // release the application bootstrap busy state
     Context.getPageContext().getBusyContext().applicationBootstrapComplete();

     return new ControllerViewModel();
  }
);
