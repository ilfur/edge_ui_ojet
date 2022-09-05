define(['ojs/ojcore'], function (oj) {
    var SearchFactory = {
        resourceUrl : 'https://edge-appconf.edge1.130.162.210.16.nip.io/edge/fpa/lookup', 
        qbeUrl : 'https://edge-appconf.edge1.130.162.210.16.nip.io/edge/psaq/patient/qbe',
        createMedModel : function () {
            var med = oj.Model.extend( {
                urlRoot : this.resourceUrl+"/medications", 
                idAttribute : "medId"
            });
            return new med();
        },
        createMedCollection : function () {
            var meds = oj.Collection.extend( {
                url : this.resourceUrl+"/medications", 
                model : this.createMedModel(), 
                comparator : "medName"
            });
            return new meds();
        },
        /*type: 'POST',
      contentType: 'application/json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ...something...');
      },
      data: JSON.stringify(requestBody)*/
        createqbeCountModel : function (qbestr) {
            var qbecount = oj.Model.extend( {
                urlRoot : this.qbeUrl+"/count", 
                idAttribute : "numFound",
                type: 'PUT',
                cache: false,
                contentType: 'application/json',
                data: qbestr
            });
            return new qbecount();
        },
    };
    return SearchFactory;
});


