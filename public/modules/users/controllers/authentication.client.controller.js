'use strict';

var app=angular.module('users', [] );
app.controller('AuthenticationController',['$scope', '$http', '$window','$location', 'Authentication','sharedProperties','Users','$stateParams','licenseProperties','rolesProperties',
	function($scope, $http, $window, $location, Authentication,sharedProperties,Users,$stateParams,licenseProperties,rolesProperties)
	 {
		$scope.authentication = Authentication;
		$scope.GlobalRoles = rolesProperties.all();
		$scope.GlobalCompany = sharedProperties.orgLength();
		$scope.GlobalUsers = Users.query();
	    $scope.GlobalOrganizations = sharedProperties.orgLength();
		$scope.mySelections = [];
        //Load list of Users
		$scope.find = function() {
		$scope.OnlyAdmnUsers = Users.get({ 
				userorgId: $scope.authentication.user.orgId
			});	
			 console.log(' 	$scope.OnlyAdmnUsers-->', 	$scope.OnlyAdmnUsers); 
		    $scope.allnames=$scope.Globalname;
			$scope.allCompanies= $scope.GlobalCompany;
		
			$scope.allRoles= $scope.GlobalRoles;
			$scope.onlyUsers=[];
			$scope.onlyUsers = Users.query();
              console.log(" $scope.onlyUsers11--", $scope.onlyUsers);
			angular.forEach($scope.users , function(value , key) {
			      angular.forEach(value, function(value1 , key1) {
                        if(key1 == 'orgId' && value1 == $scope.authentication.user.orgId){
						 $scope.onlyUsers.push(value);
						}
					});   		
				}); 
				console.log(" $scope.onlyUsers22--", $scope.onlyUsers);
			$scope.gridOptions = 
			{
				data: 'onlyUsers',
				enablePaging: true,
				showFooter: true,
			    selectedItems: $scope.mySelections,
      			multiSelect: false,
				columnDefs: [{field: 'orgId', displayName: 'Company'}, 
                     		 {field:'firstName', displayName:'First Name'},
                     		 {field: 'lastName', displayName: 'Last Name'},
                     		 {field: 'email', displayName: 'Email'},
                     		 {field: 'role', displayName: 'Role'}]
		};
	    };
		//if ($scope.authentication.user) $location.path('/accounts/create');
		
		$scope.signup = function() {
		     
		  $scope.credentials.role = $scope.credentials.newrole._id;
		  $scope.credentials.companyName = $scope.credentials.newcompany._id;
			if($scope.credentials.companyName != null && $scope.credentials.companyName != ''){
				if($scope.credentials.licenses != null && $scope.credentials.licenses != ''){
				  console.log(' if $scope.credentials-->'+  $scope.credentials);
				//console.log("value123--"+ $scope.credentials.licenses);
				licenseProperties.create($scope.credentials.licenses,function(result){
				angular.forEach(result, function(value, key) 
				    {
					      //console.log("value+--"+ value );
					});
					}
				);
				}
				sharedProperties.create($scope.credentials.companyName,function(result){
				angular.forEach(result, function(value , key) {
						if(key == '_id')
						{
						   //console.log("id+--"+ value );
							$scope.assingValue(value);	  
						}
					});
					}
				);
			}
			else {

				$scope.credentials.orgId = $scope.authentication.user.orgId;
				$scope.length = 0;
				
				angular.forEach($scope.GlobalUsers, function(value , key) {
			      angular.forEach(value, function(value1 , key1) {
					 if(key1 == 'orgId'){
					    if(value1 == $scope.authentication.user.orgId){
						   $scope.length ++;
						}
					 }
					});   		
				}); 
				//console.log("$scope.length = "+ $scope.length);
				if($scope.authentication.user.licenses > $scope.length ){
					$http.post('/auth/signup', $scope.credentials).success(function(response) {
						// If successful we assign the response to the global user model
						//$scope.authentication.user = response;
						// And redirect to the index page
						$location.path('/adminindexpage');
					}).error(function(response) {
						$scope.error = response.message;
					});
			    }
				else{
				  alert('sorry!. Your Licenses are over');
				  $scope.credentials ='';
				  
				}
				
			}
		};
			
		
		$scope.signupforUser = function() 
		{
		 // var sample = [];
	      $scope.credentials.role = $scope.credentials.newrole._id;
		  $scope.credentials.orgId = $scope.credentials.company._id;
		  $scope.credentials.displayName = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.username = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.password = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.org=[{name: $scope.credentials.company.name, id: $scope.credentials.company._id}]
		  var username=$scope.credentials.username;
          var toaddress=$scope.credentials.email;
		  //sample.push({ username,toaddress});
		  $http.post('/auth/signup', $scope.credentials).success(function(response) {
					$scope.onlyUsers = Users.query();
					$http.post('/auth/sendmailnewuser',sample).success(function(response) {
						       	
				    }).error(function(response){
					    		
				    });
					$scope.credentials ='';	
				}).error(function(response) {
					$scope.error = response.message;
			}); 
			
			
		} ;

		$scope.assingValue = function(value) {
			$scope.credentials.orgId = value;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;
					$location.path('/superadminindexpage');
				}).error(function(response) {
					$scope.error = response.message;
			});
		};

		
		
		$scope.findOnebyIdtoEdit = function() {
			//console.log("$scope.mySelections---->"+$scope.mySelections);
			//console.log("$scope.mySelections00---->"+$scope.mySelections[0]);
			
		   angular.forEach($scope.mySelections[0] , function(value , key) 
		   {
			     
              //console.log(value +"value11-->>" +key);      
          
              $('#firstName').val($scope.mySelections[0]['firstName']); 
              $('#lastName').val($scope.mySelections[0]['lastName']); 
              $('#email').val($scope.mySelections[0]['email']); 
           }); 
			//$scope.credentials.company =  $scope.mySelections[0]['orgId'];
			//$scope.credentials.firstName = $scope.mySelections[0]['credentials.firstName'];
			//$scope.lastName = $scope.mySelections[0]['lastName'];
			//$scope.email = $scope.mySelections[0]['email'];

			
		}
   
		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				$scope.authentication.user = response;
				$scope.signinuser=$scope.authentication.user;
				$scope.userRole = $scope.authentication.user.role;
				
				angular.forEach($scope.GlobalRoles, function(value , key) {
				angular.forEach(value, function(value1 , key1) {
					if(key1 == '_id' && value1 == $scope.userRole){
					     if(value['name'] == 'superAdmin'){  
							   //$location.path('/superadminindexpage');
							   window.location.href = '/#!/superadminindexpage';
							    window.location.reload();
							   //route.reload();
						 }
						 else if(value['name'] == 'Admin'){
						       window.location.href = '/#!/adminindexpage';
							    window.location.reload();
						 } 
						 else if(value['name'] == 'admin'){
						       window.location.href = '/#!/adminindexpage';
							    window.location.reload();
						 } 
						else if(value['name'] == 'ADMIN'){
						       window.location.href = '/#!/adminindexpage';
							    window.location.reload();
						 }
						 else if(value['name'] == 'user'){
						        window.location.href = '/#!/userhome';
							    window.location.reload();
						 } 
						 else{
						        window.location.href = '/#!/userhome';
							    window.location.reload();
						 }
						}
					});	
				 });
				 
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
