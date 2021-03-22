var mainapp = angular.module('MainCtrl', []);
// File Upload 
function validateFile(fileName) {
	var validFilesTypes = ["png", "jpg", "jpeg"],
		ext = fileName.split('.').pop().toLowerCase();

	var isValidFile = false;
	for (var i = 0; i < validFilesTypes.length; i++) {
		if (ext == validFilesTypes[i]) {
			isValidFile = true;
			break;
		}
	}
	return isValidFile;
}
//base64
function readFile(inputElement) {
	var deferred = $.Deferred();
	if (inputElement) {
		var fr = new FileReader();
		fr.onload = function (e) {
			deferred.resolve(e.target.result);
		};
		fr.readAsDataURL(inputElement);
	} else {
		deferred.reject({
			success: false,
			error: 'FILE_NOT_LOAD'
		});
	}
	return deferred.promise();
}

mainapp.controller('loginCtrl', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
	var vm = this;
	//vm.loginmsg = "This is login page....";
	$scope.login = function () {
		$rootScope.token = null;
		var loginObj = {
			Email: $scope.emailId,
			Password: $scope.password
		};
		$http.post('/api/signin/login', loginObj).
			then(function (data) {
				console.log(data);
				console.log(data.data.success);
				if (data.data.success === true) {
					//$rootScope.token = data.data.token;
					localStorage.setItem('token', data.data.token);
					//$state.go("form");

					$http({
						method: 'GET',
						url: '/api/form/isApplied',
						headers: {
							"Content-Type": "application/json",
							"Authorization": 'Bearer ',
							'x-access-token': localStorage.getItem('token')
						}
					}).
						then(function (appliedData) {
							console.log(appliedData);
							if(appliedData.data.applied == true){
								$state.go("success");
							}else{
								$state.go("form");
							}
						}).catch(function (err) {
							alert("Something went wrong.");
						});

				}
			}).catch(function (err) {
				console.log(err);
				$scope.emailId = "";
				$scope.password = "";
				if (err.data.success === false) {
					alert("You entered wrong Email or Password");
				}
			});
	};


}])
	.controller('signupCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
		var vm = this;
		$scope.password = null;
		$scope.passwordConfirmation = null;
		//phone number validation
		vm.phoneNumbr = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
		$scope.countries = {
			'USA': {
				'Alabama': ['Montgomery', 'Birmingham'],
				'California': ['Sacramento', 'Fremont'],
				'Illinois': ['Springfield', 'Chicago']
			},
			'India': {
				'Maharashtra': ['Pune', 'Mumbai', 'Nagpur', 'Akola'],
				'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur'],
				'Rajasthan': ['Jaipur', 'Ajmer', 'Jodhpur']
			},
			'Australia': {
				'New South Wales': ['Sydney'],
				'Victoria': ['Melbourne']
			}
		};
		$scope.GetSelectedCountry = function () {
			$scope.strCountry = $scope.countrySrc;
		};
		$scope.GetSelectedState = function () {
			$scope.strState = $scope.stateSrc;
		};

		//datetaken: $("#datepicker #date-id").val(),
		$scope.register = function () {
			var stdObj = {
				fullname: $scope.fullname,
				email: $scope.emailId,
				phone: $scope.phone,
				address: $scope.address,
				gender: $('#gender option:selected').text(),
				country: $('#country option:selected').text(),
				state: $('#state option:selected').text(),
				city: $('#city option:selected').text(),
				dob: $("#datepicker #date-id").val(),
				password: $scope.confirm_password
			};
			console.log(stdObj);
			$http.post('/api/reg/registration', stdObj).
				then(function (data) {
					if (data.data.status == 'added') {
						alert("Registration successfull!");
						$scope.fullname = "";
						$scope.address = "";
						$scope.emailId = "";
						$scope.phone = "";
						$state.go("login");
					} else if (data.data.status == 'exists') {
						alert("Email is already exists!");
					}
				});

		};

	}])
	.controller('formCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
		var vm = this;
		$scope.schoolYears = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
			'2009', '2010', '2011', '2012', '2013', '2014',
			'2015', '2016', '2017', '2018', '2019', '2020', '2021'];

		var photoList = [];
		$(document).on("change", "#photofiles", function () {
			if ($("#photofiles")[0].files.length > 1) {
				$("#photofiles").val(null);
				alert("you can upload maximum 1 photo");
			} else {
				for (var i = 0; i < $("#photofiles")[0].files.length; i++) {
					var imgName = $("#photofiles")[0].files[i].name;

					if (!validateFile(imgName)) {
						$("#photofiles").val(null);
						alert("Please upload a valid file, supported formats are .jpeg, .png and .jpg");
						return;
					}
					if (photoList.length > 0) {
						$("#photofiles").val(null);
						alert("you can upload maximum 1 photo");
						return;
					}

					readFile($("#photofiles")[0].files[i]).then(function (b64Str) {
						//console.log(b64Str)
						photoList.push({ 'imgName': imgName, 'b64Str': b64Str });
					}).catch(function (err) {

					});
				}
			}
		});
		$scope.submitApplication = function () {
			if (photoList[0] == undefined) {
				alert("Please upload your photo");
				return;
			}
			var base64Image = photoList[0].b64Str.split(';base64,').pop();
			var imgName = photoList[0].imgName;
			var formDetails = {
				fullname: $scope.app_name,
				address: $scope.app_address,
				gender: $('#app_gender option:selected').text(),
				nationality: $('#app_nationality option:selected').text(),
				religion: $('#app_religion option:selected').text(),
				caste: $('#app_caste option:selected').text(),
				dob: $("#datepicker #date-id").val(),
				schoolYear: $('#app_schyear option:selected').text(),
				standard: $('#app_standard option:selected').val(),
				imgName: imgName,
				imageData: base64Image
			};
			// console.log(formDetails);
			// console.log(imgName);
			// console.log(base64Image);
			$http({
				method: 'POST',
				url: '/api/form/applicationForm',
				headers: {
					"Content-Type": "application/json",
					"Authorization": 'Bearer ',
					'x-access-token': localStorage.getItem('token')
				},
				data: JSON.stringify(formDetails)
			}).then(function (response) {
				alert("Application submitted successfully!");
				$state.go("success");
			}).catch(function (err) {
				console.log(err);
				alert("Application failed.Please try again.");
			});

		};


	}]);



