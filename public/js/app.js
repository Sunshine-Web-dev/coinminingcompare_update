// ===========================================================================================
// File Name: app.js
// Description: This is the main client side file for CoinMiningCompare.com
// Platform: AngularJs
// ===========================================================================================
// Force HTTPS
if (location.protocol != 'https:') {
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length); // force https
}
var api = ""; // use for production
// var api = "http://localhost:8080"; // use for localhost
angular.module("cmcApp", ['ngRoute', 'ngStorage', 'base64', 'socialLogin', 'ckeditor', 'ui-notification', 'ngSanitize'])
    //===========================================================================================
    // DIRECTIVES: Directives are called from the HTML pages
    //===========================================================================================
    // Round off numbers
    .directive('roundConverter2', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attrs, ngModelCtrl) {
                function roundNumber(val) {
                    var parsed = parseFloat(val, 10);
                    if (parsed !== parsed) {
                        return null;
                    } // check for NaN
                    var rounded = Math.round(parsed);
                    return rounded;
                }
                ngModelCtrl.$parsers.push(roundNumber); // Parsers take the view value and convert it to a model value.
            }
        };
    })
    // File Reader for CSVs
    .directive("fileread", [function() {
        return {
            scope: {
                fileread: "="
            },
            link: function(scope, element, attributes) {
                element.bind("change", function(changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }])
    // File Reader for Images
    .directive('fileInput', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                elm.bind('change', function() {
                    $parse(attrs.fileInput).assign(scope, elm[0].files);
                    scope.$apply();
                })
            }
        }
    }])
    // File Reader for CSVs
    .directive('fileReader', function() {
        return {
            scope: {
                fileReader: "="
            },
            link: function(scope, element) {
                $(element).on('change', function(changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            scope.$apply(function() {
                                scope.fileReader = contents;
                                scope.testing = contents;
                            });
                        };
                        r.readAsText(files[0]);
                    }
                });
            }
        };
    })
    // This is a JS alternative to HREF links
    .directive('goClick', function($location) {
        return function(scope, element, attrs) {
            var path;
            attrs.$observe('goClick', function(val) {
                path = val;
            });
            element.bind('click', function() {
                scope.$apply(function() {
                    $location.path(path);
                });
            });
        };
    })
    //===========================================================================================
    // BIND PAGES TO CONTROLLERS
    //===========================================================================================
    .config(function($routeProvider, $locationProvider, socialProvider, NotificationProvider) {
        // Notifications options can be set here
        NotificationProvider.setOptions({
            delay: 3000, // Show notification for 3 second 
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
        // This removes hashbang from URLs
        $locationProvider.html5Mode(true);
        // This is our FB App Key
        socialProvider.setFbKey({
            appId: "2008991356093988",
            apiVersion: "v2.8"
        });
        // Routes bind pages to controllers
        $routeProvider.when("/api/v1", {
                controller: "apiCtrl",
                templateUrl: "api.html"
            }).when("/about", {
                controller: "aboutCtrl",
                templateUrl: "about.html"
            }).when("/articles", {
                controller: "blogCtrl",
                templateUrl: "blog.html"
            }).when("/article/:id", {
                controller: "blogPostCtrl",
                templateUrl: "blog-post.html"
            }).when("/news", {
                controller: "newsCtrl",
                templateUrl: "news.html"
            }).when("/news/:id", {
                controller: "newsPostCtrl",
                templateUrl: "news-post.html"
            }).when("/contact", {
                controller: "contactCtrl",
                templateUrl: "contact.html"
            }).when("/terms", {
                controller: "termsCtrl",
                templateUrl: "terms.html"
            }).when("/sitemap", {
                controller: "sitemapCtrl",
                templateUrl: "sitemap.html"
            }).when("/sitemap/generator", {
                controller: "sitemapGenCtrl",
                templateUrl: "sitemap-gen.html"
            }).when("/privacy", {
                controller: "privacyCtrl",
                templateUrl: "privacy.html"
            }).when("/disclaimer", {
                controller: "disclaimerCtrl",
                templateUrl: "disclaimer.html"
            }).when("/profitability-calculator", {
                controller: "calCtrl",
                templateUrl: "cal.html"
            }).when("/compare", {
                controller: "compareCtrl",
                templateUrl: "compare.html"
            }).when("/plans", {
                controller: "plansCtrl",
                templateUrl: "plans.html"
            }).when("/plan/:id", {
                controller: "planCtrl",
                templateUrl: "plan.html"
            }).when("/plan-finder-step-1", {
                controller: "wizard1Ctrl",
                templateUrl: "wizard_1.html"
            }).when("/plan-finder-step-2", {
                controller: "wizard2Ctrl",
                templateUrl: "wizard_2.html"
            }).when("/plan-finder-step-3", {
                controller: "wizard3Ctrl",
                templateUrl: "wizard_3.html"
            }).when("/plan-finder-step-4", {
                controller: "wizard4Ctrl",
                templateUrl: "wizard_4.html"
            }).when("/plan-finder-step-5", {
                controller: "wizard5Ctrl",
                templateUrl: "wizard_5.html"
            }).when("/cpanel", {
                controller: "adminLoginCtrl",
                templateUrl: "admin-login.html"
            }).when("/cpanel/home", {
                controller: "adminHomeCtrl",
                templateUrl: "admin-home.html"
            }).when("/cpanel/admins", {
                controller: "adminAdminsCtrl",
                templateUrl: "admin-admins.html"
            }).when("/cpanel/admins/new", {
                controller: "adminAdminsNewCtrl",
                templateUrl: "admin-admins-new.html"
            }).when("/cpanel/companies", {
                controller: "adminCompaniesCtrl",
                templateUrl: "admin-companies.html"
            }).when("/cpanel/companies/new", {
                controller: "adminCompaniesNewCtrl",
                templateUrl: "admin-companies-new.html"
            }).when("/cpanel/contracts", {
                controller: "adminContractsCtrl",
                templateUrl: "admin-contracts.html"
            }).when("/cpanel/massupload", {
                controller: "adminMassuploadCtrl",
                templateUrl: "admin-massupload.html"
            }).when("/cpanel/contracts/new", {
                controller: "adminContractsNewCtrl",
                templateUrl: "admin-contracts-new.html"
            }).when("/cpanel/contracts/edit/:id", {
                controller: "adminContractsEditCtrl",
                templateUrl: "admin-contracts-edit.html"
            }).when("/cpanel/reviews", {
                controller: "adminReviewsCtrl",
                templateUrl: "admin-reviews.html"
            }).when("/cpanel/users", {
                controller: "adminUsersCtrl",
                templateUrl: "admin-users.html"
            }).when("/cpanel/blog-authors", {
                controller: "adminBlogAuthorsCtrl",
                templateUrl: "admin-blog-authors.html"
            }).when("/cpanel/blog-authors/new", {
                controller: "adminBlogAuthorsNewCtrl",
                templateUrl: "admin-blog-authors-new.html"
            })
            .when("/cpanel/news", {
                controller: "adminNewsCtrl",
                templateUrl: "admin-news.html"
            })
            .when("/cpanel/news/edit/:id", {
                controller: "adminNewsEditCtrl",
                templateUrl: "admin-news-edit.html"
            })
            .when("/cpanel/blogs", {
                controller: "adminBlogsCtrl",
                templateUrl: "admin-blogs.html"
            }).when("/cpanel/blogs/new", {
                controller: "adminBlogsNewCtrl",
                templateUrl: "admin-blogs-new.html"
            }).when("/cpanel/blogs/edit/:id", {
                controller: "adminBlogsEditCtrl",
                templateUrl: "admin-blogs-edit.html"
            })
            .when("/", {
                controller: "landingCtrl",
                templateUrl: "landing.html"
            }).otherwise({
                redirectTo: "/"
            })
    })
    //===========================================================================================
    // PAGE CONTROLLER: API
    //===========================================================================================
    .controller("apiCtrl", function($http, $scope, $localStorage, $location, $rootScope, Notification) {
        $scope.keyShow = false;
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | API | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        $scope.menu = 0;
        // Show Key upon Successful Login
        $scope.key = function() {
            $scope.keyShow = true;
        }
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Call social login and show key upon successful login
        $rootScope.$on('event:social-sign-in-success', function(event, userDetails) {
            $scope.key = hashCode(userDetails.name);
        })
        // Create key using User's name
        function hashCode(s) {
            return s.split("").reduce(function(a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0);
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Mass Contract Upload using CSV
    //===========================================================================================
    .controller("adminMassuploadCtrl", function($http, $scope, $localStorage, $location, $rootScope, Notification) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.error = false;
        var item = {}
        var items = []
        // Mass Upload Contracts
        $scope.update = function() {
            $http({
                url: api + '/contracts/massupload',
                method: "POST",
                data: items
            }).then(function(response) {
                // success
                // console.log(response.data)
                $scope.success1 = 2;
                Notification.success('Contracts Database Updated!');
                // alert("Contracts Updated!")
            }, function(response) {
                // failed
                console.log(response.data)
            });
        }
        // Parse CSV File Content using Papa Parse! - This creates JSON
        $scope.upload = function() {
            var data = Papa.parse($scope.fileContent);
            $scope.success1 = 1;
            data.data.shift();
            // Loop through contracts and add Companies
            for (var i = 0; i < data.data.length; i++) {
                item = {}
                if (data.data[i][0] == "Genesis Mining") {
                    item.company = {
                        "_id": "5a86267160bf14473ad47c68",
                        "name": "Genesis Mining",
                        "website": "https://www.genesis-mining.com/",
                        "description": "Bitcoin is the currency of the future & Genesis Mining is the largest cloud mining company on the market. Mine bitcoin through the cloud, get started today!",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1518741095/zddppcfaegfevizqxdzo.jpg"
                        }],
                        "createDate": "2018-02-16T00:31:45.503Z"
                    }
                    item.companies = "5a86267160bf14473ad47c68";
                } else if (data.data[i][0] == "Hashflare") {
                    item.company = {
                        "_id": "5a8e36be08bf6fbf5e9b5f2c",
                        "name": "Hashflare",
                        "website": "https://hashflare.io/",
                        "description": "HashFlare.io offers cryptocurrency cloud mining services on modern, high-efficiency equipment.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1519269488/u9ruzav3h0luooi9sc8s.jpg"
                        }],
                        "createDate": "2018-02-22T03:19:26.509Z"
                    }
                    item.companies = "5a8e36be08bf6fbf5e9b5f2c";
                } else if (data.data[i][0] == "Nuvoo Mining") {
                    item.company = {
                        "_id": "5a9f05894d08315fbfc82423",
                        "name": "Nuvoo Mining",
                        "website": "https://nuvoo.io/",
                        "description": "NuVoo offers many options to begin or sustain your growth in the cryptocurrency industry. You can choose from our Cloud mining solutions, collocation miners services or dedicated miners hosting options. We can even work on a dedicated program to build your own farm.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371036/ebyo5pquhq9yygrbzvxy.png"
                        }],
                        "createDate": "2018-03-06T21:18:01.190Z"
                    }
                    item.companies = "5a9f05894d08315fbfc82423";
                } else if (data.data[i][0] == "MyCoinCloud") {
                    item.company = {
                        "_id": "5a9f06864d08315fbfc82425",
                        "name": "MyCoinCloud",
                        "website": "https://www.mycoincloud.com/",
                        "description": "We are cryptocurrency cloud mining service situated in the capital of Bulgaria, Sofia. MyCoinCloud was founded at the end of 2015 by group of cryptocurrency enthusiasts and specialists. We strongly believe that we can make mining affordable and profitable for everyone willing to join cryptocurrency revolution.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371285/kqhdfbjmzffvrgydf1jm.jpg"
                        }],
                        "createDate": "2018-03-06T21:22:14.074Z"
                    }
                    item.companies = "5a9f06864d08315fbfc82425";
                } else if (data.data[i][0] == "Minergate") {
                    item.company = {
                        "_id": "5a9f070c4d08315fbfc82426",
                        "name": "Minergate",
                        "website": "https://minergate.com/",
                        "description": "Create your first cloud mining contract here! The most advanced mining hardware and only freshly mined Bitcoins, Ethereum and Monero directly from the block rewards are a couple of clicks away.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371435/fwifivtftgihj4bsukwu.png"
                        }],
                        "createDate": "2018-03-06T21:24:28.819Z"
                    }
                    item.companies = "5a9f070c4d08315fbfc82426";
                } else if (data.data[i][0] == "Costa Nord Mine") {
                    item.company = {
                        "_id": "5a9f07f54d08315fbfc82428",
                        "website": "https://costanordmine.com/",
                        "name": "Costa Nord Mine",
                        "description": "Costa Nord Mine offers you a smart and easy way to invest your money. Our Ethereum extraction system is suited for those who are new to the world of crypto-coins, as well as for encryption experts and large-scale investors. Costa Nord Mine is an Ethereum extraction service that is an easy and secure way to purchase.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371683/imnep5x1itwg9ymutvgk.png"
                        }],
                        "createDate": "2018-03-06T21:28:21.430Z"
                    }
                    item.companies = "5a9f07f54d08315fbfc82428";
                } else if (data.data[i][0] == "ViaBTC") {
                    item.company = {
                        "_id": "5a9f085f4d08315fbfc82429",
                        "name": "ViaBTC",
                        "website": "https://www.viabtc.com/",
                        "description": "A world's TOP Bitcoin, Litecoin, Ethereum, Zcash and Dashcoin mining pool who provides professional & stable mining services with very low fees. An advanced PPS+ method guarantees much higher yields.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371760/rymeoi6dsvo2hsu0tojc.jpg"
                        }],
                        "createDate": "2018-03-06T21:30:07.883Z"
                    }
                    item.companies = "5a9f085f4d08315fbfc82429";
                } else if (data.data[i][0] == "Eobot") {
                    item.company = {
                        "_id": "5a9f06134d08315fbfc82424",
                        "description": "Let us mine for you with our hardware in the cloud - Immediate results, mining updates every 60 seconds - Can own fractions of cloud instances, if desired - No heat or hardware to maintain - Choose payout in any displayed cryptocurrency - 5 year and 24 hour rental lengths available - No returns/exchanges",
                        "website": "https://www.eobot.com/",
                        "name": "Eobot",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371212/l65o7hp34ala4wiqz0vc.jpg"
                        }],
                        "createDate": "2018-03-06T21:20:19.793Z"
                    }
                    item.companies = "5a9f06134d08315fbfc82424";
                } else if (data.data[i][0] == "Hashcan") {
                    item.company = {
                        "_id": "5a9f078b4d08315fbfc82427",
                        "website": "https://hash.wagecan.com/",
                        "name": "Hashcan",
                        "description": "HashCan is a cloud mining app built for mobile. Cloud mining is just like cloud computing, but for Bitcoin mining. As a user, all you need to do is to pay for the hash power you want, and our dedicated hardware ninjas and software geniuses will take care the rest for you.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1520371592/ctwnexpdiuwnmzldhlsm.jpg"
                        }],
                        "createDate": "2018-03-06T21:26:35.115Z"
                    }
                    item.companies = "5a9f078b4d08315fbfc82427";
                } else if (data.data[i][0] == "CCG Mining") {
                    item.company = {
                        "_id": "5b80998b3777370014111cb7",
                        "name": "CCG Mining",
                        "website": "https://www.ccgmining.com/",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1535154569/iiwynpsh2q3rf8llbhss.jpg"
                        }],
                        "createDate": "2018-08-24T23:49:31.561Z"
                    }
                    item.companies = "5b80998b3777370014111cb7";
                } else if (data.data[i][0] == "Hashing24") {
                    item.company = {
                        "_id": "5b8099af3777370014111cb8",
                        "name": "Hashing24",
                        "website": "https://hashing24.com/",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1535154605/rbpbc4yzdqgjmrcml918.jpg"
                        }],
                        "createDate": "2018-08-24T23:50:07.280Z"
                    }
                    item.companies = "5b8099af3777370014111cb8";
                } else if (data.data[i][0] == "IQ Mining") {
                    item.company = {
                        "_id": "5b8149cf4f698e0014f39a5f",
                        "website": "https://www.iqmining.com",
                        "name": "IQ Mining",
                        "description": "IQ mining was founded at the end of 2016 by the team of experts in blockchain programming and IT engineers. The current members of our altcoins mining team come from different scientific disciplines, but our common faith in cryptocurrencies has brought us together.",
                        "photo": [{
                            "url": "https://res.cloudinary.com/tashfeen/image/upload/v1535199691/ma0broel3t2dujkyb2kq.png"
                        }],
                        "createDate": "2018-08-25T12:21:35.891Z"
                    }
                    item.companies = "5b8149cf4f698e0014f39a5f";
                }
                // Get data from the JSON that we got
                item.createDate = new Date();
                item.name = data.data[i][1];
                item.slug = item.name.replace(/[^a-zA-Z ]/g, "") + item.company.name.replace(/[^a-zA-Z ]/g, "");
                item.slug = item.slug.replace(/\s+/g, '-').toLowerCase() + "-" + makeid(); // Generate Slug based on contract and company name
                item.coin = data.data[i][2];
                item.algo = data.data[i][3];
                item.hashrate = data.data[i][4];
                item.hashrateUnits = data.data[i][5];
                item.period = data.data[i][6];
                item.payout = data.data[i][7];
                item.maintenance = data.data[i][8];
                item.priceUSD = data.data[i][9];
                item.priceOther = data.data[i][10];
                item.f1 = data.data[i][11];
                item.f2 = data.data[i][12];
                item.f3 = data.data[i][13];
                item.f4 = data.data[i][14];
                item.location = data.data[i][15];
                item.paymentmethods = data.data[i][16];
                item.refURL = data.data[i][17];
                item.refCode = data.data[i][18];
                item.promotion = data.data[i][19];
                item.dateUpdated = data.data[i][20];
                items.push(item);
                // console.log(items)
            }
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Login
    //===========================================================================================
    .controller("adminLoginCtrl", function($http, $scope, $localStorage, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.error = false;
        // check username and password and login admin
        $scope.login = function(data) {
            $http({
                url: api + '/admin/login',
                method: "POST",
                data: data
            }).then(function(response) {
                // success
                $localStorage.admin = response.data // add admin data to cookies
                $location.path('/cpanel/home')
            }, function(response) {
                // failed
                $scope.error = true
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Home
    //===========================================================================================
    .controller("adminHomeCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.data = {}
        // Get total number of reviews
        $http({
            url: api + '/reviewsTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.reviews = response.data
            console.log(response.data)
        }, function(response) {
            console.log(response.data)
        });
        // Get total number of companies
        $http({
            url: api + '/companiesTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.companies = response.data
            console.log(response.data)
        }, function(response) {
            console.log(response.data)
        });
        // Get total number of users
        $http({
            url: api + '/usersTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.users = response.data
        }, function(response) {
            console.log(response.data)
        });
        // Get total number of admins
        $http({
            url: api + '/adminsTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.admins = response.data
        }, function(response) {
            console.log(response.data)
        });
        // Get total number of authors
        $http({
            url: api + '/authorsTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.authors = response.data
        }, function(response) {
            console.log(response.data)
        });
        // Get total number of blogs
        $http({
            url: api + '/blogsTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.blogs = response.data
        }, function(response) {
            console.log(response.data)
        });
        // Get total number of contracts
        $http({
            url: api + '/contractsTotal',
            method: "GET"
        }).then(function(response) {
            $scope.data.contracts = response.data
        }, function(response) {
            console.log(response.data)
        });
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Admins
    //===========================================================================================
    .controller("adminAdminsCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.admins = {}
        // Get all admins from database
        function getAdmins() {
            $http({
                url: api + '/admins/all',
                method: "GET"
            }).then(function(response) {
                $scope.admins = response.data
            }, function(response) {
                console.log(response.data)
            });
        }
        getAdmins()
        // Add a new admin
        $scope.newAdmin = function() {
            $location.path('/cpanel/admins/new')
        }
        // Delete an admin
        $scope.delete = function(id) {
            $http({
                url: api + '/admins/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getAdmins()
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: New Admin
    //===========================================================================================
    .controller("adminAdminsNewCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0;
        // Go Back to Admins Page
        $scope.back = function() {
            $location.path('/cpanel/admins')
        }
        // Add a new admin to DB
        $scope.create = function(admin) {
            $http({
                url: api + '/admins/create',
                method: "POST",
                data: admin
            }).then(function(response) {
                // success
                $scope.success = 1
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Companies
    //===========================================================================================
    .controller("adminCompaniesCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.companies = {}
        // Get all Companies
        function getCompanies() {
            $http({
                url: api + '/companies/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.companies = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCompanies()
        $scope.newCompany = function() {
            $location.path('/cpanel/companies/new')
        }
        // Delete a company
        $scope.delete = function(id) {
            $http({
                url: api + '/companies/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getCompanies()
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Add a New Company
    //===========================================================================================
    .controller("adminCompaniesNewCtrl", function($scope, $http, $location, $base64, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0
        $scope.photos = [];
        // Upload Image File and get URL
        $scope.uploadFile = function(file) {
                var fd = new FormData();
                fd.append('myfile', file[0]);
                $http.post(api + '/api/fileupload/secure', fd, {
                    // this cancels AngularJS normal serialization of request
                    transformRequest: angular.identity,
                    // this lets browser set `Content-Type: multipart/form-data` 
                    // header and proper data boundary
                        headers: {
                            'Content-Type': undefined
                        }
                })
                .success(function(response){
                    // Handle uploaded file
                    var photo = {}
                    photo.url = response.secure_url;
                    $scope.photos.push(photo);
                })

                .error(function(err){
                    //something went wrong 
                    console.log(err)
                });
        }
        $scope.back = function() {
            $location.path('/cpanel/companies')
        }
        // Add Company to DB
        $scope.create = function(datt) {
            datt.photo = $scope.photos;
            $http({
                url: api + '/companies/create',
                method: "POST",
                data: datt
            }).then(function(response) {
                // success
                $scope.success = 1
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Edit a Contract
    //===========================================================================================
    .controller("adminContractsEditCtrl", function($scope, $http, $location, $base64, $routeParams, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0
        $scope.data = {}
        $scope.companies = {}
        // Get all companies
        function getCompanies() {
            $http({
                url: api + '/companies/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.companies = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCompanies()
        // Get this contract
        function getCon() {
            $http({
                url: api + '/contracts/' + $routeParams.id,
                method: "GET"
            }).then(function(response) {
                // success
                $scope.data = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCon()
        $scope.back = function() {
            $location.path('/cpanel/contracts')
        }
        // Update this contract and save new information in DB
        $scope.update = function(data) {
            $http({
                url: api + '/contracts/update/' + $routeParams.id,
                method: "POST",
                data: data
            }).then(function(response) {
                // console.log(response)
                $scope.success = 1;
            }, function(response) {
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Edit Blog
    //===========================================================================================
    .controller("adminBlogsEditCtrl", function($scope, $http, $location, $base64, $routeParams, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0
        $scope.data = {}
        $scope.authors = {}
        // Editor options.
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false,
            height: '65vh'
        };
        // Called when the editor is completely ready.
        $scope.onReady = function() {
            // ...
        };
        $scope.photos = []
        // Clear Photos
        $scope.clearPhotos = function() {
            $scope.photos = []
        }
        // Upload Image File and get URL
        $scope.uploadFile = function(file) {
                var fd = new FormData();
                fd.append('myfile', file[0]);
                $http.post(api + '/api/fileupload/secure', fd, {
                    // this cancels AngularJS normal serialization of request
                    transformRequest: angular.identity,
                    // this lets browser set `Content-Type: multipart/form-data` 
                    // header and proper data boundary
                        headers: {
                            'Content-Type': undefined,
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                })
                .success(function(response){
                    // Handle uploaded file
                    var photo = {}
                    photo.url = response.secure_url;
                    $scope.photos.push(photo);
                })

                .error(function(err){
                    //something went wrong 
                    console.log(err)
                });
        }
        // Get all Authors
        function getAuthors() {
            $http({
                url: api + '/authors/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.authors = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getAuthors()
        // Get this blog by URL ID
        function getBlog() {
            $http({
                url: api + '/blogs/' + $routeParams.id,
                method: "GET"
            }).then(function(response) {
                // success
                $scope.blog = response.data
                $scope.photos = $scope.blog.photo;
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getBlog()
        $scope.back = function() {
            $location.path('/cpanel/blogs')
        }
        // Add new blog data to DB
        $scope.update = function(data) {
            $http({
                url: api + '/blogs/update/' + $routeParams.id,
                method: "POST",
                data: data
            }).then(function(response) {
                // console.log(response)
                $scope.success = 1;
            }, function(response) {
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Users
    //===========================================================================================
    .controller("adminUsersCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.users = {}
        // Get All Users
        function getUsers() {
            $http({
                url: api + '/users/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.users = response.data
                // console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getUsers()
        // Delete a User by ID
        $scope.delete = function(id) {
            $http({
                url: api + '/users/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getUsers()
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Reviews
    //===========================================================================================
    .controller("adminReviewsCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.reviews = {}
        // Get All Reviews
        function getRev() {
            $http({
                url: api + '/reviews/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.reviews = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getRev()
        // Delete a Review
        $scope.delete = function(id) {
            $http({
                url: api + '/reviews/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getRev()
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Contracts
    //===========================================================================================
    .controller("adminContractsCtrl", function($scope, $http, $location, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.contracts = [];
        // Get all contracts from Database
        function getCon() {
            $http({
                url: api + '/contracts/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.contracts = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        };
        getCon();
        // Mass Delete Contracts
        $scope.deleteAll = function() {
            $http({
                url: api + '/contracts/massdelete',
                method: "DELETE"
            }).then(function(response) {
                // success
                // getCon()
                Notification.success('All contracts have been removed. Please upload the new database.');
            }, function(response) { // failed
                console.log(response)
            });
        }
        // Link: New Contract
        $scope.newContract = function() {
            $location.path('/cpanel/contracts/new')
        }
        // Delete a Single Contract
        $scope.delete = function(id) {
            $http({
                url: api + '/contracts/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getCon()
            }, function(response) { // failed
                console.log(response)
            });
        }
        // Feature Contract on Landing Page
        $scope.feature = function(data) {
            for (var i = 0; i < $scope.contracts.length; i++) {
                if ($scope.contracts[i]._id == data) {
                    $scope.contracts[i].featured = true;
                    $http({
                        url: api + '/contracts/update/' + data,
                        method: "POST",
                        data: $scope.contracts[i]
                    }).then(function(response) {
                        Notification.success('Contract featured on landing page');
                    }, function(response) {
                        console.log(response.data)
                    });
                }
            }
        }
        // Unfeature Contract
        $scope.unfeature = function(data) {
            for (var i = 0; i < $scope.contracts.length; i++) {
                if ($scope.contracts[i]._id == data) {
                    $scope.contracts[i].featured = false;
                    $http({
                        url: api + '/contracts/update/' + data,
                        method: "POST",
                        data: $scope.contracts[i]
                    }).then(function(response) {
                        Notification.success('Contract removed from landing page');
                    }, function(response) {
                        console.log(response.data)
                    });
                }
            }
        }
        // Mark it as Deal
        $scope.deal = function(data) {
            for (var i = 0; i < $scope.contracts.length; i++) {
                if ($scope.contracts[i]._id == data) {
                    $scope.contracts[i].deal = true;
                    $http({
                        url: api + '/contracts/update/' + data,
                        method: "POST",
                        data: $scope.contracts[i]
                    }).then(function(response) {
                        Notification.success('Contract is on Exclusive deal');
                    }, function(response) {
                        console.log(response.data)
                    });
                }
            }
        }
        // Unmark it as Deal
        $scope.undeal = function(data) {
            for (var i = 0; i < $scope.contracts.length; i++) {
                if ($scope.contracts[i]._id == data) {
                    $scope.contracts[i].deal = false;
                    $http({
                        url: api + '/contracts/update/' + data,
                        method: "POST",
                        data: $scope.contracts[i]
                    }).then(function(response) {
                        Notification.success('Contract removed from Exclusive deal');
                    }, function(response) {
                        console.log(response.data)
                    });
                }
            }
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Create New Contract
    //===========================================================================================
    .controller("adminContractsNewCtrl", function($scope, $http, $location, $base64, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0;
        $scope.companies = {}
        // Get companies
        function getCompanies() {
            $http({
                url: api + '/companies/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.companies = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCompanies()
        $scope.back = function() {
            $location.path('/cpanel/contracts')
        }
        // get data from form and set it to the API
        $scope.create = function(datt) {
            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i]._id == datt.companies) {
                    datt.company = $scope.companies[i];
                    $http({
                        url: api + '/contracts/create',
                        method: "POST",
                        data: datt
                    }).then(function(response) {
                        // success
                        $scope.success = 1; // show success message
                    }, function(response) { // failed
                        console.log(response.data)
                    });
                }
            }
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Blog Authors
    //===========================================================================================
    .controller("adminBlogAuthorsCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.authors = {}
        // Get all blog authors
        function getAuthors() {
            $http({
                url: api + '/authors/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.authors = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getAuthors()
        // Link: Create New Author
        $scope.newAuthor = function() {
            $location.path('/cpanel/blog-authors/new')
        }
        // Delete Blog Author by ID
        $scope.delete = function(id) {
            $http({
                url: api + '/authors/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getAuthors()
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Create New Blog Author
    //===========================================================================================
    .controller("adminBlogAuthorsNewCtrl", function($scope, $http, $location, $base64, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0
        $scope.photos = []
        // Upload file and get URL
        $scope.uploadFile = function(file) {
                var fd = new FormData();
                fd.append('myfile', file[0]);
                $http.post(api + '/api/fileupload/secure', fd, {
                    // this cancels AngularJS normal serialization of request
                    transformRequest: angular.identity,
                    // this lets browser set `Content-Type: multipart/form-data` 
                    // header and proper data boundary
                        headers: {
                            'Content-Type': undefined
                        }
                })
                .success(function(response){
                    // Handle uploaded file
                    var photo = {}
                    photo.url = response.secure_url;
                    $scope.photos.push(photo);
                })

                .error(function(err){
                    //something went wrong 
                    console.log(err)
                });
        }
        // Link: Go Back
        $scope.back = function() {
            $location.path('/cpanel/blog-authors')
        }
        // Get form data and send it to API to create a new author
        $scope.create = function(datt) {
            datt.photo = $scope.photos;
            $http({
                url: api + '/authors/create',
                method: "POST",
                data: datt
            }).then(function(response) {
                // success
                $scope.success = 1
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: News
    //===========================================================================================
    .controller("adminNewsCtrl", function($scope, $http, $location, $rootScope, Notification) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.news = []
        // Get all news items from database
        function getNews() {
            $http({
                url: api + '/news/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.news = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getNews();
        $scope.fetched = [];
        // Publish News Item
        $scope.publish = function(i) {
            console.log(i)
            $http({
                url: api + '/news/create',
                method: "POST",
                data: i
            }).then(function(response) {
                // success
                Notification.success(i.title + ' has been published to News Section');
                getNews();
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        // Get news from Cryptocurrency News and convert it to JSON
        $scope.cryptonews = function() {
            $http({
                url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcryptocurrencynews.com%2Ffeed%2F',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.fetched = response.data;
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        // Delete News Item by ID
        $scope.delete = function(id) {
            $http({
                url: api + '/news/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getNews()
                console.log(response)
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Edit News Item
    //===========================================================================================
    .controller("adminNewsEditCtrl", function($scope, $http, $location, $base64, $routeParams, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0
        $scope.data = {}
        $scope.authors = {}
        // Editor options.
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false,
            height: '65vh'
        };
        // Called when the editor is completely ready.
        $scope.onReady = function() {
            // ...
        };
        $scope.photos = []
        // delete photos
        $scope.clearPhotos = function() {
            $scope.photos = []
        }
        // upload file and get URL
        $scope.uploadFile = function(file) {
                var fd = new FormData();
                fd.append('myfile', file[0]);
                $http.post(api + '/api/fileupload/secure', fd, {
                    // this cancels AngularJS normal serialization of request
                    transformRequest: angular.identity,
                    // this lets browser set `Content-Type: multipart/form-data` 
                    // header and proper data boundary
                        headers: {
                            'Content-Type': undefined
                        }
                })
                .success(function(response){
                    // Handle uploaded file
                    var photo = {}
                    photo.url = response.secure_url;
                    $scope.photos.push(photo);
                })

                .error(function(err){
                    //something went wrong 
                    console.log(err)
                });
        }
        // Get the news item that needs to be edited
        function getBlog() {
            $http({
                url: api + '/news/' + $routeParams.id,
                method: "GET"
            }).then(function(response) {
                // success
                console.log(response.data)
                $scope.blog = response.data
                $scope.photos.push($scope.blog.thumbnail);
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getBlog()
        // Go back
        $scope.back = function() {
            $location.path('/cpanel/news')
        }
        // Updated the news item
        $scope.update = function(data) {
            data.thumbnail = $scope.photos[$scope.photos.length - 1];
            $http({
                url: api + '/news/update/' + $routeParams.id,
                method: "POST",
                data: data
            }).then(function(response) {
                // console.log(response)
                $scope.success = 1;
            }, function(response) {
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Blogs
    //===========================================================================================
    .controller("adminBlogsCtrl", function($scope, $http, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.blogs = {}
        // get all blog items
        function getBlogs() {
            $http({
                url: api + '/blogs/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.blogs = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getBlogs()
        // Link: Create New Blog Post
        $scope.newBlog = function() {
            $location.path('/cpanel/blogs/new')
        }
        // Delete Blog Post by ID
        $scope.delete = function(id) {
            $http({
                url: api + '/blogs/delete/' + id,
                method: "DELETE"
            }).then(function(response) {
                // success
                getBlogs()
            }, function(response) { // failed
                console.log(response)
            });
        }
    })
    //===========================================================================================
    // ADMIN PAGE CONTROLLER: Blog Authors
    //===========================================================================================
    .controller("adminBlogsNewCtrl", function($scope, $http, $location, $base64, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Admin Panel | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.success = 0;
        $scope.authors = {};
        $scope.photos = [];
        // Editor options.
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false,
            height: '65vh'
        };
        // Called when the editor is completely ready.
        $scope.onReady = function() {
            // ...
        };
        // Get all Authors from Database
        function getAuthors() {
            $http({
                url: api + '/authors/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.authors = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getAuthors();
        // Upload file and get uploaded file's URL
        $scope.uploadFile = function(file) {
                var fd = new FormData();
                fd.append('myfile', file[0]);
                $http.post(api + '/api/fileupload/secure', fd, {
                    // this cancels AngularJS normal serialization of request
                    transformRequest: angular.identity,
                    // this lets browser set `Content-Type: multipart/form-data` 
                    // header and proper data boundary
                        headers: {
                            'Content-Type': undefined
                        }
                })
                .success(function(response){
                    // Handle uploaded file
                    var photo = {}
                    photo.url = response.secure_url;
                    $scope.photos.push(photo);
                })

                .error(function(err){
                    //something went wrong 
                    console.log(err)
                });


            // var fd = new FormData();
            // fd.append('upload_preset', 'hdxqsdac');
            // fd.append('file', file);
            // $http.post('https://api.cloudinary.com/v1_1/tashfeen/image/upload', fd, {
            //     headers: {
            //         'Content-Type': undefined,
            //         'X-Requested-With': 'XMLHttpRequest'
            //     }
            // }).success(function(cloudinaryResponse) {
            //     var photo = {}
            //     photo.url = cloudinaryResponse.secure_url;
            //     $scope.photos.push(photo);
            // }).error(function(response) {
            //     console.log(response)
            // });
        }
        // Go back
        $scope.back = function() {
            $location.path('/cpanel/blogs')
        }
        // Create a new Blog Post
        $scope.create = function(datt) {
            datt.photo = $scope.photos;
            $http({
                url: api + '/blogs/create',
                method: "POST",
                data: datt
            }).then(function(response) {
                // success
                $scope.success = 1
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Landing Page
    //===========================================================================================
    .controller("landingCtrl", function($http, $scope, $localStorage, Notification, $location, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Compare Cryptocurrency Cloud Mining Contracts";
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Handle Compare List undefined state
        if ($localStorage.compareList == undefined) {
            $localStorage.compareList = [];
        }
        // Go to plans and filter plans page based on selection
        $scope.landingLoc = function(data) {
            // console.log(data)
            $localStorage.landingLoc = data;
            $location.path('/plans')
        }
        // select plan and add it to filters
        $scope.answer = function(data) {
            $localStorage.wizard = {}
            $localStorage.wizard.algorithm = data;
            Notification.success('The coin/algorithm ' + data + ' has been added to the plan filters.');
        }
        $scope.contracts = []
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Get all Blog Posts
        function getBlogs() {
            $http({
                url: api + '/blogs/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.blogs = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getBlogs()
        // Check if it's a number
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        var j;
        // Get all contracts
        function getCon() {
            $http({
                url: api + '/contracts/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.dat = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    // response.data[i].priceUSD = roundOff(response.data[i].priceUSD);
                    if (isNumeric(response.data[i].period)) {
                        response.data[i].period = response.data[i].period + " months";
                    }
                    if (response.data[i].featured == true) {
                        $http({
                            url: api + '/companies/' + response.data[i].companies,
                            method: "GET"
                        }).then(function(responsee) {
                            // success
                            // console.log(responsee.data)
                            var j = responsee.data;
                        }, function(response) { // failed
                            console.log(response.data)
                        });
                        $scope.dat[i].companies.data = j;
                        $scope.contracts.push($scope.dat[i])
                        // add earnings values
                        // earnings($scope.dat[i].hashrate, $scope.dat[i].hashrateUnits, $scope.dat[i].priceUSD, $scope.dat[i].coin, $scope.dat[i].algo, $scope.contracts.length - 1);
                    }
                }
                // console.log($scope.contracts)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCon()

        function earnings(hashrate, hashrateUnits, priceUSD, coin, algo, id) {
            // hashrate = 5;
            // hashrateUnits = "MH/s";
            // priceUSD = 30;
            // coin = "Dash";
            // algo = "X11";
            var answer = {}
            // console.log("hashrate",hashrate)
            // Convert units
            if (hashrateUnits == "KH/s") {
                answer.hashrate = hashrate * 1000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "MH/s") {
                answer.hashrate = hashrate * 1000000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "GH/s") {
                answer.hashrate = hashrate * 1000000000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "TH/s") {
                answer.hashrate = hashrate * 1000000000000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "PH/s") {
                answer.hashrate = hashrate * 1000000000000000;
                hashrateUnits = "H/s";
            }
            // console.log(answer.hashrate)
            // Make short form
            var shortForm;
            if (coin == "Bitcoin") {
                shortForm = "btc";
            } else if (coin == "Ethereum" || coin == "Ethereum Classic") {
                shortForm = "eth";
            } else if (coin == "Litecoin") {
                shortForm = "ltc";
            } else if (coin == "Dash") {
                shortForm = "dash";
            } else if (coin == "Zcash") {
                shortForm = "zec";
            } else if (coin == "Monero") {
                shortForm = "xmr";
            }
            if (coin == "Ethereum Classic") {
                coin = "Ethereum";
            }
            // Use CORS Anywhere API to call Cryptocompare and get Difficulty and Reward for the coin
            // https://cors-anywhere.herokuapp.com/
            $http({
                url: 'https://min-api.cryptocompare.com/data/price?fsym=' + shortForm + '&tsyms=USD',
                method: "GET"
            }).then(function(response) {
                answer.coinToDollar = response.data.USD;
                $http({
                    url: api + '/api/coins/' + shortForm,
                    method: "GET"
                }).then(function(response) {
                    console.log(response.data);
                    answer.difficulty = Number(response.data.difficulty);
                    answer.blockReward = Number(response.data.reward);
                    //Modified by Varun - Added answer.constant defintion
                    if (shortForm == "btc") {
                        answer.constant = Math.pow(2, 32);
                    } else if (shortForm == "eth") {
                        answer.constant = 1;
                    } else if (shortForm == "ltc") {
                        answer.constant = Math.pow(2, 32);
                    } else if (shortForm == "xmr") {
                        answer.constant = 2;
                    } else if (shortForm == "dash") {
                        answer.constant = Math.pow(2, 32);
                    } else if (shortForm == "zec") {
                        answer.constant = Math.pow(2, 13);
                    }
                    // Calculate Earnings
                    answer.hashrateUnits = hashrateUnits;
                    answer.hashtime = (answer.difficulty * answer.constant) / answer.hashrate; //Modified by Varun - Added answer.constant
                    answer.blocksMinedPerYear = ((365.25 * 24 * 3600) / ((answer.difficulty * answer.constant) / answer.hashrate));
                    answer.coinsRewardedPerYear = answer.blockReward * answer.blocksMinedPerYear;
                    answer.revenuePerYear = answer.coinsRewardedPerYear * answer.coinToDollar;
                    $scope.contracts[id].earnings = answer.revenuePerYear;
                }, function(response) { // failed
                    console.log(response.data)
                });
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: About Us
    //===========================================================================================
    .controller("aboutCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | About Us | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: News
    //===========================================================================================
    .controller("newsCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | News | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.news = [];
        $scope.allNews = [];
        $scope.loader = 1;
        var pointerStart = 1;
        var pointerEnd = 13; // showing 1 - 13 news stories
        // Load More News Items
        $scope.more = function() {
            pointerStart = pointerStart + 12;
            pointerEnd = pointerEnd + 12;
            for (var i = pointerStart; i < pointerEnd; i++) {
                console.log($scope.allNews[i])
                $scope.news.push($scope.allNews[$scope.allNews.length - i])
            }
        };
        // Get News from Backend
        function getnews() {
            $http({
                url: api + '/news/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.allNews = response.data;
                for (var i = 1; i < 13; i++) {
                    // Push news on clicking Load More
                    $scope.news.push($scope.allNews[$scope.allNews.length - i]);
                }
                $scope.loader = 0;
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getnews()
    })
    //===========================================================================================
    // PAGE CONTROLLER: Blog
    //===========================================================================================
    .controller("blogCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Blog | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.blogs = [];
        // Get Blogs from API
        function getBlogs() {
            $http({
                url: api + '/blogs/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.blogs = response.data; // display all blogs
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getBlogs()
    })
    //===========================================================================================
    // PAGE CONTROLLER: Single Plan
    //===========================================================================================
    .controller("planCtrl", function($http, $scope, $localStorage, $routeParams, $rootScope, Notification, $rootScope, $location) {
        $scope.contract = {};
        $scope.contract.company = {};
        // Initial state of page title. This will be replaced once the API responds with contract details
        $rootScope.pageTitle = "CoinMiningCompare.com | Compare Cryptocurrency Cloud Mining Contracts";
        $scope.compareNo = 0;
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.myString = "";
        // Check if it's a number
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        $scope.review = {}
        $scope.reviews = {}
        $scope.review.text = "";
        // Get Contract information using the URL Slug
        $http({
            url: api + '/contracts/slug/' + $routeParams.id,
            method: "GET"
        }).then(function(response) {
            // success
            $scope.contract = response.data;
            // Update Page title
            $rootScope.pageTitle = "CoinMiningCompare.com | " + $scope.contract.company.name + " " + $scope.contract.name + " | Compare Cryptocurrency Cloud Mining Contracts";
            if (isNumeric(response.data.maintenance)) {
                $scope.contract.maintenance = "$ " + $scope.contract.maintenance;
            }
            // If there is period available, show period otherwise show fallback string
            if (isNumeric(response.data.period)) {
                $scope.contract.period = response.data.period + " months";
                $scope.myString = " for " + $scope.contract.period;
            } else {
                $scope.contract.period = response.data.period;
                $scope.myString = " valid for as long as it remains profitable.";
            }
            getReviews();
            getCompanyContracts();
        }, function(response) { // failed
            console.log(response.data);
            $location.path('/plans'); // on error redirect to plans
        });
        // Add plan to compare list
        $scope.compare = function() {
            // if comparison list isn't available in browser storage, make storage item
            if ($localStorage.compareList == undefined) {
                $localStorage.compareList = []
            } else {
                // Users can only compare upto 5 items.
                if ($localStorage.compareList.length < 5) {
                    $localStorage.compareList.push($scope.contract._id)
                } else {
                    $localStorage.compareList[0] = $localStorage.compareList[1];
                    $localStorage.compareList[1] = $localStorage.compareList[2];
                    $localStorage.compareList[2] = $localStorage.compareList[3];
                    $localStorage.compareList[3] = $localStorage.compareList[4];
                    $localStorage.compareList[4] = $scope.contract._id;
                }
            }
            // Show success notification
            Notification.success('This plan has been added to the comparison chart. Click the Compare button at the top right of the page to compare your selected plans.');
        }
        // Store review before FB signin. It will be posted when user has successfully signed in.
        $scope.post = function() {
            $localStorage.review = $scope.review;
        }
        // Get Reviews for this contract
        function getReviews() {
            $http({
                url: api + '/reviews/contract/' + $scope.contract._id,
                method: "GET"
            }).then(function(response) {
                // success
                $scope.reviews = response.data
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        // Get company contracts - to be displayed in More Contracts section
        function getCompanyContracts() {
            $http({
                url: api + '/contracts/company/' + $scope.contract.companies,
                method: "GET"
            }).then(function(response) {
                // success
                $scope.companyContracts = response.data
                // console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        // Facebook Sign In
        $rootScope.$on('event:social-sign-in-success', function(event, userDetails) {
            // if user has signed in and review exists in local storage, Add review to database.
            if ($scope.review.text != "") {
                var userData = {}
                userData.name = userDetails.name;
                userData.email = userDetails.email;
                userData.fbid = userDetails.uid;
                userData.imageUrl = userDetails.imageUrl;
                $scope.review.user = userData;
                $scope.review.contract = $scope.contract._id;
                // console.log(userData)
                $http({
                    url: api + '/reviews/create',
                    method: "POST",
                    data: $scope.review
                }).then(function(response) {
                    $http({
                        url: api + '/users/create',
                        method: "POST",
                        data: userData
                    }).then(function(response) {
                        getReviews(); // get updated reviews from database
                    }, function(response) { // failed
                        console.log(response.data)
                    });
                }, function(response) { // failed
                    console.log(response.data)
                });
            } else {
                alert('Please write rating and review');
            }
        })
    })
    //===========================================================================================
    // PAGE CONTROLLER: Cloud Mining Plans
    //===========================================================================================
    .controller("plansCtrl", function($http, $scope, $localStorage, Notification, orderByFilter, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Cloud Mining Plans | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.companies = {}
        $scope.dat = {}
        $scope.contracts = {}
        $scope.investment = 1000;
        $scope.sortorder = '-priceUSD';
        // Round Off Prices
        function roundOff(data) {
            return parseFloat(Math.round((data * 100) / 100)).toFixed(2);
        }
        // Get all companies
        function getCompanies() {
            $http({
                url: api + '/companies/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.companies = response.data
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCompanies();
        // Compare Plans
        $scope.compare = function(id) {
            // if comparison list isn't available in browser storage, make storage item
            if ($localStorage.compareList == undefined) {
                $localStorage.compareList = []
            } else {
                // Max 5 items allowed
                if ($localStorage.compareList.length < 5) {
                    $localStorage.compareList.push(id)
                } else {
                    $localStorage.compareList[0] = $localStorage.compareList[1];
                    $localStorage.compareList[1] = $localStorage.compareList[2];
                    $localStorage.compareList[2] = $localStorage.compareList[3];
                    $localStorage.compareList[3] = $localStorage.compareList[4];
                    $localStorage.compareList[4] = id;
                }
            }
            Notification.success('This plan has been added to the comparison chart. Click the Compare button at the top right of the page to compare your selected plans.');
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        var j;
        // Get all contracts, and their company data
        function getCon() {
            $scope.load = true;
            $http({
                url: api + '/contracts/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.dat = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    // If period exists, show period
                    if (isNumeric(response.data[i].period)) {
                        response.data[i].period = response.data[i].period + " months";
                    }
                    // Open Ended Condition
                    if (response.data[i].f1 == "Open-Ended Bitcoin Mining" || response.data[i].f2 == "Open-Ended Bitcoin Mining" || response.data[i].f3 == "Open-Ended Bitcoin Mining" || response.data[i].f4 == "Open-Ended Bitcoin Mining" || response.data[i].period == "Open-Ended") {
                        response.data[i].openEnded = true;
                    }
                    // Custom Plan Condition
                    if (response.data[i].f1 == "Custom plan selection" || response.data[i].f2 == "Custom plan selection" || response.data[i].f3 == "Custom plan selection" || response.data[i].f4 == "Custom plan selection") {
                        response.data[i].customPlan = true;
                    }
                    // Automatic payout Condition
                    if (response.data[i].f1 == "Automatic payout in BTC" || response.data[i].f2 == "Automatic payout in BTC" || response.data[i].f3 == "Automatic payout in BTC" || response.data[i].f4 == "Automatic payout in BTC") {
                        response.data[i].autoPay = true;
                    }
                    $http({
                        url: api + '/companies/' + response.data[i].companies,
                        method: "GET"
                    }).then(function(response) {
                        // success
                        $scope.load = false;
                        var j = response.data;
                    }, function(response) { // failed
                        console.log(response.data)
                    });
                    $scope.dat[i].companies.data = j;
                    $scope.contracts = $scope.dat;
                }
                wizard()
                landingWiz()
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCon()
        // check if we have data from wizard. Apply filters based on wizard data
        function wizard() {
            if ($localStorage.wizard) {
                if ($localStorage.wizard != undefined) {
                    // wizard set
                    $scope.contracts = []
                    for (var i = 0; i < $scope.dat.length; i++) {
                        // console.log($scope.dat[i].algo);
                        // console.log($localStorage.wizard.algorithm);
                        // console.log($scope.dat[i].payout);
                        // console.log($localStorage.wizard.payouts);
                        // console.log($scope.dat[i].priceUSD);
                        // console.log($localStorage.wizard.investment);
                        // console.log($scope.dat[i].location);
                        // console.log($localStorage.wizard.location);
                        // does not matter
                        if ($localStorage.wizard.algorithm == "-" || $localStorage.wizard.payouts == "-" || $localStorage.wizard.location == "-") {
                            //          1                         1                                1 
                            if ($localStorage.wizard.algorithm == "-" && $localStorage.wizard.payouts == "-" && $localStorage.wizard.location == "-") {
                                // Price and Investment Filter
                                if (parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment)) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else if ($localStorage.wizard.algorithm == "-" && $localStorage.wizard.location == "-") {
                                // Payout and Price and Investment Filter
                                if ($scope.dat[i].payout == $localStorage.wizard.payouts && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment)) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else if ($localStorage.wizard.payouts == "-" && $localStorage.wizard.algorithm == "-") {
                                // Location and Price and Investment Filter
                                if (parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment) && $scope.dat[i].location == $localStorage.wizard.location) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else if ($localStorage.wizard.payouts == "-" && $localStorage.wizard.location == "-") {
                                // Algorithm and Price and Investment Filter
                                if ($scope.dat[i].algo == $localStorage.wizard.algorithm && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment)) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else if ($localStorage.wizard.location == "-") {
                                // Algorithm and Payout and Price and Investment Filter
                                if ($scope.dat[i].algo == $localStorage.wizard.algorithm && $scope.dat[i].payout == $localStorage.wizard.payouts && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment)) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else if ($localStorage.wizard.payouts == "-") {
                                // Algorithm and Price and  Location and Investment Filter
                                if ($scope.dat[i].algo == $localStorage.wizard.algorithm && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment) && $scope.dat[i].location == $localStorage.wizard.location) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else if ($localStorage.wizard.algorithm == "-") {
                                // Payout and Price and  Location and Investment Filter
                                if ($scope.dat[i].payout == $localStorage.wizard.payouts && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment) && $scope.dat[i].location == $localStorage.wizard.location) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            } else {
                                // All Wizard filters
                                if ($scope.dat[i].algo == $localStorage.wizard.algorithm && $scope.dat[i].payout == $localStorage.wizard.payouts && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment) && $scope.dat[i].location == $localStorage.wizard.location) {
                                    $scope.contracts.push($scope.dat[i])
                                }
                            }
                        } else {
                            if ($scope.dat[i].algo == $localStorage.wizard.algorithm && $scope.dat[i].payout == $localStorage.wizard.payouts && parseInt($scope.dat[i].priceUSD) < parseInt($localStorage.wizard.investment) && $scope.dat[i].location == $localStorage.wizard.location) {
                                $scope.contracts.push($scope.dat[i])
                            }
                        }
                    }
                    $localStorage.wizard = undefined;
                }
            }
        }
        // Reset all filters
        $scope.resetFilters = function() {
            $scope.contracts = $scope.dat; // $scope.dat contains all original contracts that we got from API
        }
        // Investment Filter
        $scope.investmentFilter = function(data) {
            $scope.contracts = []
            for (var i = 0; i < $scope.dat.length; i++) {
                if ($scope.dat[i].priceUSD < data) {
                    $scope.contracts.push($scope.dat[i]);
                }
            }
        }
        // Company/Provider Filter
        $scope.companyFilter = function(data) {
            $scope.contracts = []
            console.log(data)
            for (var i = 0; i < $scope.dat.length; i++) {
                if ($scope.dat[i].companies == data) {
                    $scope.contracts.push($scope.dat[i]);
                }
            }
        }
        // Filter contracts by feature
        $scope.featureFilter = function(data) {
            $scope.contracts = []
            for (var i = 0; i < $scope.dat.length; i++) {
                if ($scope.dat[i].f1 == data || $scope.dat[i].f2 == data || $scope.dat[i].f3 == data || $scope.dat[i].f4 == data) {
                    $scope.contracts.push($scope.dat[i]);
                }
            }
        }
        // Filter contracts by algorithm
        $scope.algoFilter = function(data) {
            $scope.contracts = []
            for (var i = 0; i < $scope.dat.length; i++) {
                if ($scope.dat[i].algo == data) {
                    $scope.contracts.push($scope.dat[i]);
                }
            }
        }
        // Filter contracts by location
        $scope.locFilter = function(data) {
            $scope.contracts = []
            for (var i = 0; i < $scope.dat.length; i++) {
                if ($scope.dat[i].location == data) {
                    $scope.contracts.push($scope.dat[i]);
                }
            }
        }
        // Filter contracts if company filter is applied.
        // This function handles users coming from landing page who click the company name
        function landingWiz() {
            // if company clicked from landing page
            if ($localStorage.landingLoc) {
                if ($localStorage.landingLoc != undefined) {
                    $scope.companyFilter($localStorage.landingLoc)
                }
                $localStorage.landingLoc = undefined;
            }
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Blog - Single Post
    //===========================================================================================
    .controller("blogPostCtrl", function($http, $scope, $localStorage, $routeParams, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Blog | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.blog = {}
        // Get single blog post
        $http({
            url: api + '/blogs/slug/' + $routeParams.id,
            method: "GET"
        }).then(function(response) {
            // success
            $scope.blog = response.data;
            // get blog author data
            $http({
                url: api + '/authors/' + $scope.blog.author,
                method: "GET"
            }).then(function(response) {
                $scope.blog.authorName = response.data.name;
            }, function(response) { // failed
                console.log(response.data)
            });
        }, function(response) { // failed
            console.log(response.data)
        });
    })
    //===========================================================================================
    // PAGE CONTROLLER: News - Single Post
    //===========================================================================================
    .controller("newsPostCtrl", function($http, $scope, $localStorage, $routeParams, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | News | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.blog = {}
        // Get Single News Post
        $http({
            url: api + '/news/slug/' + $routeParams.id,
            method: "GET"
        }).then(function(response) {
            // success
            $scope.blog = response.data; // Populate News to Frontend
            // console.log(response.data);
        }, function(response) { // failed
            console.log(response.data)
        });
    })
    //===========================================================================================
    // PAGE CONTROLLER: Profitability Calculator
    //===========================================================================================
    .controller("calCtrl", function($http, $scope, $localStorage, Notification, $rootScope, $document) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Profitability Calculator | Compare Cryptocurrency Cloud Mining Contracts";
        // render comparison list number in the top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Control Menu
        $scope.menu = 0;
        $scope.ovh = "";
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        //api key = 4a387f145dc74c768ca4c69efeb5c19a
        // Set initial values
        var j;
        var hru;
        var hr;
        $scope.algorithm = "";
        $scope.algorithm2 = "";
        $scope.hashrate = "";
        $scope.hashrateUnits = "";
        $scope.priceUSD = "";
        $scope.coin = "";
        $scope.algo = "";
        $scope.difficulty = "";
        $scope.blockReward = "";
        $scope.coinToDollar = "";
        $scope.constant = "";
        var method;
        $scope.answer = {}
        // Calculate Profitability
        $scope.calculate = function() {
            // Check if Hash Rate exists
            if (hr) {
                $scope.hashrate = hr;
            }
            // Check if Hash Rate Units exist
            if (hru) {
                $scope.hashrateUnits = hru;
            }
            //Added by Varun - Added $scope.constant definition
            if ($scope.coin == "None") {
                $scope.constant = 1;
            } else if ($scope.coin == "Bitcoin") {
                $scope.constant = Math.pow(2, 32);
            } else if ($scope.coin == "Ethereum") {
                $scope.constant = 1;
            } else if ($scope.coin == "Litecoin") {
                $scope.constant = Math.pow(2, 32);
            } else if ($scope.coin == "Monero") {
                $scope.constant = 2;
            } else if ($scope.coin == "Dash") {
                $scope.constant = Math.pow(2, 32);
            } else if ($scope.coin == "Zcash") {
                $scope.constant = Math.pow(2, 13);
            }
            // Make calculations to get Revenue per Year, Net Profit per Year and Days to Break Even
            $scope.answer.hashtime = ($scope.difficulty * $scope.constant) / $scope.hashrate; //Modified by Varun - Added $scope.constant
            // console.log($scope.answer.hashtime)
            $scope.answer.blocksMinedPerYear = ((365.25 * 24 * 3600) / (($scope.difficulty * $scope.constant) / $scope.hashrate));
            // console.log($scope.answer.blocksMinedPerYear)
            $scope.answer.coinsRewardedPerYear = $scope.blockReward * $scope.answer.blocksMinedPerYear;
            $scope.answer.revenuePerYear = $scope.answer.coinsRewardedPerYear * $scope.coinToDollar;
            $scope.answer.netProfitPerYear = $scope.answer.revenuePerYear - $scope.priceUSD;
            $scope.answer.blocksMinedPerMonth = $scope.answer.blocksMinedPerYear / 12;
            $scope.answer.coinsRewardedPerMonth = $scope.answer.coinsRewardedPerYear / 12;
            $scope.answer.revenuePerMonth = $scope.answer.revenuePerYear / 12;
            $scope.answer.netProfitPerMonth = $scope.answer.netProfitPerYear / 12;
            $scope.answer.blocksMinedPerWeek = $scope.answer.blocksMinedPerYear / 52;
            $scope.answer.coinsRewardedPerWeek = $scope.answer.coinsRewardedPerYear / 52;
            $scope.answer.revenuePerWeek = $scope.answer.revenuePerYear / 52;
            $scope.answer.netProfitPerWeek = $scope.answer.netProfitPerYear / 52;
            $scope.answer.blocksMinedPerDay = $scope.answer.blocksMinedPerYear / 365.25;
            $scope.answer.coinsRewardedPerDay = $scope.answer.coinsRewardedPerYear / 365.25;
            $scope.answer.revenuePerDay = $scope.answer.revenuePerYear / 365.25;
            $scope.answer.netProfitPerDay = $scope.answer.netProfitPerYear / 365.25;
            $scope.answer.blocksMinedPerHour = $scope.answer.blocksMinedPerDay / 24;
            $scope.answer.coinsRewardedPerHour = $scope.answer.coinsRewardedPerDay / 24;
            $scope.answer.revenuePerHour = $scope.answer.revenuePerDay / 24;
            $scope.answer.netProfitPerHour = $scope.answer.netProfitPerDay / 24;
            $scope.answer.DaystoGenerateOneBlockMiningSolo = 1 / $scope.answer.blocksMinedPerDay;
            $scope.answer.DaystoGenerateOneCoin = 1 / $scope.answer.coinsRewardedPerDay;
            $scope.answer.DaystoBreakEven = $scope.priceUSD / $scope.answer.revenuePerDay;
            $scope.success = 1;
        }
        // round off numbers - this is used for prices
        function roundOff(data) {
            return parseFloat(Math.round((data * 100) / 100)).toFixed(5);
        }
        // get difficulty and block reward for the selected plan's coin
        $scope.hash2 = function() {
            $scope.load = true;
            // console.log($scope.algorithm2);
            $scope.hashrateUnits = "H/s"
            if ($scope.algorithm2 == "None") {
                $scope.coin = "Custom";
                $scope.algo = "Custom";
                $scope.constant = 1; //Added by Varun
            } else if ($scope.algorithm2 == "Bitcoin") {
                $scope.coin = "Bitcoin";
                $scope.algo = "SHA-256";
                $scope.constant = Math.pow(2, 32); //Added by Varun
            } else if ($scope.algorithm2 == "Ethereum") {
                $scope.coin = "Ethereum";
                $scope.algo = "ETHASH";
                $scope.constant = 1; //Added by Varun
            } else if ($scope.algorithm2 == "Litecoin") {
                $scope.coin = "Litecoin";
                $scope.algo = "Scrypt";
                $scope.constant = Math.pow(2, 32); //Added by Varun
            } else if ($scope.algorithm2 == "Monero") {
                $scope.coin = "Monero";
                $scope.algo = "CryptoNightv7";
                $scope.constant = 2; //Added by Varun
            } else if ($scope.algorithm2 == "Dash") {
                $scope.coin = "Dash";
                $scope.algo = "X11";
                $scope.constant = Math.pow(2, 32); //Added by Varun
            } else if ($scope.algorithm2 == "Zcash") {
                $scope.coin = "Zcash";
                $scope.algo = "EQUIHASH";

                $scope.constant = Math.pow(2, 13); //Added by Varun
            }
            var shortForm;
            if ($scope.coin == "Bitcoin") {
                shortForm = "btc";
            } else if ($scope.coin == "Ethereum") {
                shortForm = "eth";
            } else if ($scope.coin == "Litecoin") {
                shortForm = "ltc";
            } else if ($scope.coin == "Dash") {
                shortForm = "dash";
            } else if ($scope.coin == "Zcash") {
                shortForm = "zec";
            } else if ($scope.coin == "Monero") {
                shortForm = "xmr";
            }
            // Use CORS Anywhere API to call Cryptocompare and get Difficulty and Reward for the coin
            $http({
                url: 'https://min-api.cryptocompare.com/data/price?fsym=' + shortForm + '&tsyms=USD',
                method: "GET"
            }).then(function(response) {
                $scope.coinToDollar = response.data.USD;
                // console.log(response.data)
                $scope.load = false;
            }, function(response) { // failed
                console.log(response.data)
            });
            $http({
                url: api + '/api/coins/' + shortForm,
                method: "GET"
            }).then(function(response) {
                $scope.difficulty = Number(response.data.difficulty);
                $scope.blockReward = Number(response.data.reward);
                console.log(response.data)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        // Get Difficulty and Reward for the coin
        $scope.hash = function(id) {
            $scope.algorithm = id;
            // console.log($scope.contracts)
            for (var i = 0; i < $scope.contracts.length; i++) {
                if ($scope.algorithm == $scope.contracts[i]._id) {
                    $scope.hashrate = $scope.contracts[i].hashrate;
                    $scope.hashrateUnits = $scope.contracts[i].hashrateUnits;
                    $scope.priceUSD = $scope.contracts[i].priceUSD;
                    $scope.coin = $scope.contracts[i].coin;
                    $scope.algo = $scope.contracts[i].algo;
                    $scope.difficulty = "3007383866429.73";
                    $scope.blockReward = "12.5";
                    // Convert units
                    if ($scope.contracts[i].hashrateUnits == "KH/s") {
                        hr = $scope.contracts[i].hashrate * 1000;
                        hru = "H/s";
                    } else if ($scope.contracts[i].hashrateUnits == "MH/s") {
                        hr = $scope.contracts[i].hashrate * 1000000;
                        hru = "H/s";
                    } else if ($scope.contracts[i].hashrateUnits == "GH/s") {
                        hr = $scope.contracts[i].hashrate * 1000000000;
                        hru = "H/s";
                    } else if ($scope.contracts[i].hashrateUnits == "TH/s") {
                        hr = $scope.contracts[i].hashrate * 1000000000000;
                        hru = "H/s";
                    } else if ($scope.contracts[i].hashrateUnits == "PH/s") {
                        hr = $scope.contracts[i].hashrate * 1000000000000000;
                        hru = "H/s";
                    } else if ($scope.contracts[i].hashrateUnits == "H/s") {
                        hr = $scope.contracts[i].hashrate;
                        hru = "H/s";
                    }
                    $scope.load = true; // show loader
                    // Use CORS Anywhere API to call Cryptocompare and get Difficulty and Reward for the coin
                    
                    var shortForm;
                    if ($scope.contracts[i].coin == "Bitcoin") {
                        shortForm = "btc";
                    } else if ($scope.contracts[i].coin == "Ethereum") {
                        shortForm = "eth";
                    } else if ($scope.contracts[i].coin == "Litecoin") {
                        shortForm = "ltc";
                    } else if ($scope.contracts[i].coin == "Dash") {
                        shortForm = "dash";
                    } else if ($scope.contracts[i].coin == "Zcash") {
                        shortForm = "zec";
                    } else if ($scope.contracts[i].coin == "Monero") {
                        shortForm = "xmr";
                    }

                    $http({
                        url: 'https://min-api.cryptocompare.com/data/price?fsym=' + shortForm + '&tsyms=USD',
                        method: "GET"
                    }).then(function(response) {
                        $scope.coinToDollar = response.data.USD;
                        // console.log(response.data)
                        $scope.load = false;
                    }, function(response) { // failed
                        console.log(response.data)
                    });
                    $http({
                        url: api + '/api/coins/' + shortForm,
                        method: "GET"
                    }).then(function(response) {
                        $scope.difficulty = Number(response.data.difficulty);
                        $scope.blockReward = Number(response.data.reward);
                        console.log(response.data)
                    }, function(response) { // failed
                        console.log(response.data)
                    });
                }
            }
        }

        function getCon() {
            $http({
                url: api + '/contracts/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.contracts = response.data
                for (var i = 0; i < response.data.length; i++) {
                    $http({
                        url: api + '/companies/' + response.data[i].companies,
                        method: "GET"
                    }).then(function(response) {
                        // console.log(response.data)
                        var j = response.data;
                    }, function(response) { // failed
                        console.log(response.data)
                    });
                    $scope.contracts[i].companies.data = j;
                }
                console.log($scope.contracts)
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCon()
    })
    //===========================================================================================
    // PAGE CONTROLLER: Compare Plans
    //===========================================================================================
    .controller("compareCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Compare Plans | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Set initial state
        $scope.compareList = []
        // Clear All Plans
        $scope.clear = function() {
            $scope.compareList = []
            $localStorage.compareList = []
        }
        // Delete Single Plan (using Index of Array Item)
        $scope.delete = function(index) {
            $scope.compareList.splice(index, 1);
            $localStorage.compareList.splice(index, 1);
        }
        // Check if it's a number
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        // Get plans from Database
        for (var i = 0; i < $localStorage.compareList.length; i++) {
            $http({
                url: api + '/contracts/' + $localStorage.compareList[i],
                method: "GET"
            }).then(function(response) {
                if (isNumeric(response.data.period)) {
                    response.data.period = response.data.period + " months";
                }
                if (isNumeric(response.data.maintenance)) {
                    response.data.maintenance = "$ " + response.data.maintenance;
                }
                // Add Plans to be Compared to the Comparison List
                $scope.compareList.push(response.data);
                // Add earnings values to all plans. This is done asynchronously
                earnings(response.data.hashrate, response.data.hashrateUnits, response.data.priceUSD, response.data.coin, response.data.algo, $scope.compareList.length - 1);
            }, function(response) { // failed
                console.log(response.data)
            });
            console.log($scope.compareList)
        }

        function earnings(hashrate, hashrateUnits, priceUSD, coin, algo, id) {
            // Convert units
            if (hashrateUnits == "KH/s") {
                hashrate = hashrate * 1000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "MH/s") {
                hashrate = hashrate * 1000000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "GH/s") {
                hashrate = hashrate * 1000000000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "TH/s") {
                hashrate = hashrate * 1000000000000;
                hashrateUnits = "H/s";
            } else if (hashrateUnits == "PH/s") {
                hashrate = hashrate * 1000000000000000;
                hashrateUnits = "H/s";
            }
            var answer = {};
            var shortForm;
            if (coin == "Bitcoin") {
                shortForm = "btc";
            } else if (coin == "Ethereum" || coin == "Ethereum Classic") {
                shortForm = "eth";
            } else if (coin == "Litecoin") {
                shortForm = "ltc";
            } else if (coin == "Dash") {
                shortForm = "dash";
            } else if (coin == "Zcash") {
                shortForm = "zec";
            } else if (coin == "Monero") {
                shortForm = "xmr";
            }
            if (coin == "Ethereum Classic") {
                coin = "Ethereum";
            }
            // Use CORS Anywhere API to call Cryptocompare and get Difficulty and Reward for the coin
            
            $http({
                url: 'https://min-api.cryptocompare.com/data/price?fsym=' + shortForm + '&tsyms=USD',
                method: "GET"
            }).then(function(response) {
                answer.coinToDollar = response.data.USD;
                // need difficulty and reward
                $http({
                    url: api + '/api/coins/' + shortForm,
                    method: "GET"
                }).then(function(response) {
                    // Record Difficulty and Block Reward
                    answer.difficulty = Number(response.data.difficulty);
                    answer.blockReward = Number(response.data.reward);
                    //Modified by Varun - Added answer.constant defintion
                    if (shortForm == "btc") {
                        answer.constant = Math.pow(2, 32);
                    } else if (shortForm == "eth") {
                        answer.constant = 1;
                    } else if (shortForm == "ltc") {
                        answer.constant = Math.pow(2, 32);
                    } else if (shortForm == "xmr") {
                        answer.constant = 2;
                    } else if (shortForm == "dash") {
                        answer.constant = Math.pow(2, 32);
                    } else if (shortForm == "zec") {
                        answer.constant = Math.pow(2, 13);
                    }
                    // Make calculations to get Revenue per Year, Net Profit per Year and Days to Break Even
                    answer.hashrate = hashrate;
                    answer.hashrateUnits = hashrateUnits;
                    answer.hashtime = (answer.difficulty * answer.constant) / hashrate; //Modified by Varun - Added answer.constant
                    answer.blocksMinedPerYear = ((365.25 * 24 * 3600) / ((answer.difficulty * answer.constant) / hashrate));
                    answer.coinsRewardedPerYear = answer.blockReward * answer.blocksMinedPerYear;
                    answer.revenuePerYear = answer.coinsRewardedPerYear * answer.coinToDollar;
                    answer.netProfitPerYear = answer.revenuePerYear - priceUSD;
                    answer.blocksMinedPerMonth = answer.blocksMinedPerYear / 12;
                    answer.coinsRewardedPerMonth = answer.coinsRewardedPerYear / 12;
                    answer.revenuePerMonth = answer.revenuePerYear / 12;
                    answer.netProfitPerMonth = answer.netProfitPerYear / 12;
                    answer.blocksMinedPerWeek = answer.blocksMinedPerYear / 52;
                    answer.coinsRewardedPerWeek = answer.coinsRewardedPerYear / 52;
                    answer.revenuePerWeek = answer.revenuePerYear / 52;
                    answer.netProfitPerWeek = answer.netProfitPerYear / 52;
                    answer.blocksMinedPerDay = answer.blocksMinedPerYear / 365.25;
                    answer.coinsRewardedPerDay = answer.coinsRewardedPerYear / 365.25;
                    answer.revenuePerDay = answer.revenuePerYear / 365.25;
                    answer.netProfitPerDay = answer.netProfitPerYear / 365.25;
                    answer.blocksMinedPerHour = answer.blocksMinedPerDay / 24;
                    answer.coinsRewardedPerHour = answer.coinsRewardedPerDay / 24;
                    answer.revenuePerHour = answer.revenuePerDay / 24;
                    answer.netProfitPerHour = answer.netProfitPerDay / 24;
                    answer.DaystoGenerateOneBlockMiningSolo = 1 / answer.blocksMinedPerDay;
                    answer.DaystoGenerateOneCoin = 1 / answer.coinsRewardedPerDay;
                    answer.DaystoBreakEven = priceUSD / answer.revenuePerDay;
                    $scope.compareList[id].rev = answer.revenuePerYear;
                    $scope.compareList[id].profit = answer.netProfitPerYear;
                    $scope.compareList[id].break = answer.DaystoBreakEven;
                }, function(response) { // failed
                    console.log(response.data)
                });
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Contact Us
    //===========================================================================================
    .controller("contactCtrl", function($http, $scope, $localStorage, $rootScope, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Contact Us | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Scroll to top on page load
        $rootScope.$on('$locationChangeStart', function() {
            // Append Page title
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        $scope.contact = {}
        // Send email when someone hits contact us
        $scope.send = function(data) {
            $http({
                url: api + '/api/contact',
                method: "POST",
                data: data
            }).then(function(response) {
                // success
                $scope.success = 1
                Notification.success('Your message has been sent. Please expect a reply in 24-48 hours.');
            }, function(response) { // failed
                console.log(response.data)
            });
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Wizard - Step 1 - This is the search wizard to find contracts
    //===========================================================================================
    .controller("wizard1Ctrl", function($http, $scope, $localStorage, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Plan Finder | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Initial value of the switch
        $scope.switchy = false;
        // Save wizard data and show selections in a notification
        $scope.answer = function(data) {
            $localStorage.wizard = {}
            $localStorage.wizard.algorithm = data;
            Notification.success('The coin/algorithm ' + data + ' has been added to the plan filters.');
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Wizard - Step 2
    //===========================================================================================
    .controller("wizard2Ctrl", function($http, $scope, $localStorage, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Plan Finder | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Save wizard data and show selections in a notification
        $scope.answer = function(data) {
            $localStorage.wizard.payouts = data;
            Notification.success('Payout method ' + data + ' has been added to the plan filters.');
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Wizard - Step 3
    //===========================================================================================
    .controller("wizard3Ctrl", function($http, $scope, $localStorage, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Plan Finder | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Initial value of the slider
        $scope.slider = 0;
        // Save wizard data and show selections in a notification
        $scope.answer = function() {
            $localStorage.wizard.investment = $scope.slider;
            Notification.success('Investment of $' + $scope.slider + ' has been added to the plan filters.');
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Wizard - Step 4
    //===========================================================================================
    .controller("wizard4Ctrl", function($http, $scope, $localStorage, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Plan Finder | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Save wizard data and show selections in a notification
        $scope.answer = function(data) {
            $localStorage.wizard.profitable = data;
            Notification.success(data + ' selected.');
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Wizard - Step 5
    //===========================================================================================
    .controller("wizard5Ctrl", function($http, $scope, $localStorage, Notification, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Plan Finder | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        // Final Step – Save wizard data and show selections
        $scope.answer = function(data) {
            $localStorage.wizard.location = data;
            Notification.success(data + ' selected.');
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Terms and Conditions
    //===========================================================================================
    .controller("termsCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Terms and Conditions | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Sitemap Generator
    //===========================================================================================
    .controller("sitemapGenCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Sitemap | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.contracts = [];
        $scope.blogs = [];
        // Get all contracts to polute contract links
        function getCon() {
            $http({
                url: api + '/contracts/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.contracts = response.data;
            }, function(response) { // failed
                console.log(response.data);
            });
        };
        // Get all blogs to polute blog links
        function getBlogs() {
            $http({
                url: api + '/blogs/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.blogs = response.data
                console.log(response.data);
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCon();
        getBlogs();
    })
    //===========================================================================================
    // PAGE CONTROLLER: Sitemap Page
    //===========================================================================================
    .controller("sitemapCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Sitemap | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
        $scope.contracts = [];
        $scope.blogs = [];
        // Get all contracts to polute contract links
        function getCon() {
            $http({
                url: api + '/contracts/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.contracts = response.data;
            }, function(response) { // failed
                console.log(response.data);
            });
        };
        // Get all blogs to polute blog links
        function getBlogs() {
            $http({
                url: api + '/blogs/all',
                method: "GET"
            }).then(function(response) {
                // success
                $scope.blogs = response.data
                console.log(response.data);
            }, function(response) { // failed
                console.log(response.data)
            });
        }
        getCon();
        getBlogs();
    })
    //===========================================================================================
    // PAGE CONTROLLER: Privacy Policy
    //===========================================================================================
    .controller("privacyCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Privacy Policy | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
    })
    //===========================================================================================
    // PAGE CONTROLLER: Website Disclaimer
    //===========================================================================================
    .controller("disclaimerCtrl", function($http, $scope, $localStorage, $rootScope) {
        // Append Page title
        $rootScope.pageTitle = "CoinMiningCompare.com | Website Disclaimer | Compare Cryptocurrency Cloud Mining Contracts";
        // Check if Compare List has Items. If yes, render them in top navigation
        if ($localStorage.compareList) {
            $scope.compareNo = $localStorage.compareList.length;
        } else {
            $scope.compareNo = 0;
        }
        // Toggle for menu
        $scope.menu = 0;
        $scope.menu1 = function() {
            if ($scope.menu == 0) {
                $scope.ovh = "ovh";
                $scope.menu = 1;
            } else {
                $scope.ovh = "";
                $scope.menu = 0;
            }
        }
    });
//===========================================================================================
// GENERATE UNIQUE ID
//===========================================================================================
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}