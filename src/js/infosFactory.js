define(['ojs/ojcore'], function (oj) {
    var InfosFactory = {
        resourceUrl : 'https://core-appconf.core.130.162.210.16.nip.io/core/radiq/patient/dist/count', 
        // Single Partner Model
        createPartnerModel : function () {
            var partner = oj.Model.extend( {
                urlRoot : this.resourceUrl, 
                idAttribute : "partnerName"
            });
            return new partner();
        },
        // Departments Collection
        createPartnerCollection : function () {
            var partners = oj.Collection.extend( {
                url : this.resourceUrl, 
                model : this.createPartnerModel(), 
                comparator : "partnerName"
            });
            return new partners();
        }
    };
    return InfosFactory;
});
