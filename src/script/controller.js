angular.module('TenRead.Controllers', [])

    .controller('PopupCtrl', function ($scope, $http, $timeout) {

        $('body').on('click', '.news-list a', function (e) {
            e.preventDefault();
        });

        $scope.popup = {};
        var popup = $scope.popup;

        popup.scrollTop = localStorage.getItem("scrollTop") || 0;

        $timeout(function () {
            $(".tabs").scrollTop(popup.scrollTop);
        }, 10);

        popup.initSites = [
            {
                "name"   : "知乎",
                "icon"    : "http://static.zhihu.com/static/favicon.ico",                
                "url"     : "http://www.zhihu.com/",
                "selector": ".content>h2>a",
                "isShow"  : true
            },
            {
                "name"    : "startup news",
                "url"     : "http://news.dbanotes.net/",
                "icon"    : "http://news.dbanotes.net/logo.png",
                "selector": ".title>a",
                "isShow"  : true
            },
            {
                "name"    : "segmentfault",
                "url"     : "http://segmentfault.com/blogs",
                "icon"    : "http://static.segmentfault.com/global/img/touch-icon.c78b1075.png",
                "selector": ".title>a",
                "isShow"  : true
            },
            {
                "name"    : "简书",
                "url"     : "http://www.jianshu.com/trending/now",
                "icon"    : "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
                "selector": "h4>a",
                "isShow"  : true
            },
            {
                "name"   : "solidot",
                "icon"    : "http://www.solidot.org/favicon.ico",
                "url"     : "http://www.solidot.org/",
                "selector": ".bg_htit>h2>a",
                "isShow"  : true
            },
            {
                "isShow"  : true,
                "icon"    : "https://news.ycombinator.com/favicon.ico",
                "name"    : "hacker news",
                "url"     : "https://news.ycombinator.com/",
                "selector": ".title>a"
            },
            {
                "name"    : "v2ex",
                "icon"    : "http://www.v2ex.com/static/img/icon_rayps_64.png",
                "url"     : "http://www.v2ex.com/?tab=hot",
                "selector": "span.item_title > a",
                "isShow"  : true,
            },            
            {
                "name"   : "湾区日报",
                "icon"    : "http://wanqu.co/static/images/favicons/favicon-32x32.png",
                "url"     : "http://wanqu.co/issues/",
                "selector": "li.list-group-item>a",
                "isShow"  : true
            },
            {
                "name"   : "最新美剧",
                "icon"    : "http://cili003.com/favicon.ico",                
                "url"     : "http://cili003.com/",
                "selector": ".w > .list-item > dd > .b > a",
                "isShow"  : true
            }, 
            {
                "name"    : "Linux - Reddit",
                "icon"    : "http://ww3.sinaimg.cn/large/4e5d3ea7gw1ety7g00n3nj204g056wef.jpg",                
                "url"     : "http://www.reddit.com/r/linux",
                "selector": "#siteTable .title.may-blank",
                "isShow"  : true
            }, 
            {
                "name"    : "Linux - Reddit",
                "icon"    : "http://ww3.sinaimg.cn/large/4e5d3ea7gw1ety7eqg2rqj204g04ggli.jpg",                
                "url"     : "http://www.reddit.com/r/javascript",
                "selector": "#siteTable .title.may-blank",
                "isShow"  : true
            }, 
            {                
                "name"    : "前端开发 - 微信",
                "icon"    : "http://res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/common/favicon22c41b.ico",
                "url"     : "http://weixin.sogou.com/weixin?query=%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91&fr=sgsearch&type=2&w=01015002&oq=%E5%89%8D%E7%AB%AF&ri=0&sourceid=sugg&stj=0%3B4%3B0%3B0&stj2=0&stj0=0&stj1=4&hp=40&hp1=&sut=7597&sst0=1436421786079&lkt=0%2C0%2C0",
                "selector": ".txt-box > h4 >a",
                "isShow"  : true,
            }, 
            {
                "name"    : "国际纵览 - 纽约时报中文网",
                "icon"    : "http://d2qpqq35l60wq5.cloudfront.net/favicon.ico",                
                "url"     : "http://d2qpqq35l60wq5.cloudfront.net/",
                "selector": ".nytcn_headline a",
                "isShow"  : true
            }, 
            {
                "name"    : "精选 - 传送门",
                "icon"    : "http://chuansong.me/favicon.ico",                
                "url"     : "http://chuansong.me/select",
                "selector": "a.question_link",
                "isShow"  : true
            }, 
        ];

        popup.sites = JSON.parse(localStorage.getItem("sites")) || [];
        if (popup.sites.length == 0) {
            popup.sites = popup.initSites;
            localStorage.setItem("sites", JSON.stringify(popup.sites));
        }

        popup.index = localStorage.getItem("index") || 0;
        popup.sites[popup.index].status = "active";

        popup.show = function (index) {
            if (index != localStorage.getItem("index")) {
                popup.scrollTop = $(".tabs").scrollTop();
                localStorage.setItem("scrollTop", popup.scrollTop);
            }
            popup.error = false;
            localStorage.setItem("index", index);
            popup.index = index;
            popup.loading = true;

            var site = popup.sites[index];

            angular.forEach(popup.sites, function (site) {
                site.status = "";
            });
            site.status = "active";

            popup.parsedData = JSON.parse(localStorage.getItem("site" + index)) || [];
            $.ajax({
                type   : 'get',
                url    : site.url,
                timeout: 10000,
                success: function (data) {
                    $scope.$apply(function () {
                        var parsedData = $(data).find(site.selector);
                        $scope.popup.parsedData = [];
                        for (var i = 0, max = 13; i < max; i++) {
                            var article = {
                                title: $.trim($(parsedData[i]).text()),
                                href : $(parsedData[i]).attr("href")
                            };
                            if (article.href.indexOf("http") == -1) {
                                var baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1);
                                if (article.href[0] != "/") {
                                    baseUrl += "/"
                                }
                                article.href = baseUrl + article.href;
                            }
                            $scope.popup.parsedData.push(article);
                            localStorage.setItem("site" + index, JSON.stringify(popup.parsedData));
                            $scope.popup.loading = false;
                        }
                    })
                },
                error  : function (xhr, type) {
                    $(".news-list").html(data);
                    popup.loading = false;
                    popup.error = true;
                    alert("error");
                }
            });
        };

        popup.show(popup.index);

        popup.sync = function (article) {
            chrome.tabs.create({url: article.href, active: false}, function () {
                $.post('', article, function (d) {
                    console.log(JSON.parse(d).visited)
                })
            });
        }


    })
    .controller('OptionCtrl', function ($scope) {
        $scope.state = 'option.list';
        $scope.$on('$stateChangeSuccess', function (evt, toState) {
            $scope.state = toState.name;
        })
    })
    .controller('OptionListCtrl', function ($scope, $http) {
        $scope.optionList = {};
        var optionList = $scope.optionList;

        optionList.domain = 'http://tenread.wtser.com/data/';

        optionList.sites = JSON.parse(localStorage.getItem("sites")) || [];

        optionList.show = function (slug) {
            optionList.slug = slug;
            $http.get(optionList.domain + slug + '.json').success(function (d) {
                optionList.currentSites = d;
            });
        };

        optionList.subscribe = function (site) {
            var hasSubscribe = optionList.sites.filter(function (s) {
                return s.name == site.name;
            });
            if (hasSubscribe.length > 0) {
                alert("该项已订阅")
            } else {
                optionList.sites.push(site);
                localStorage.setItem("sites", JSON.stringify(optionList.sites));
                alert("订阅成功")
            }
        };

        $http.get(optionList.domain + 'catalog.json').success(function (d) {
            optionList.catalogs = d;
            optionList.slug = d[0].slug;
            optionList.show(optionList.slug)
        });


    })
    .controller('OptionMyListCtrl', function ($scope, $rootScope) {
        $scope.myList = {};
        var myList = $scope.myList;
        $rootScope.myList = myList;
        myList.form = {
            icon    : '',
            url     : '',
            name    : '',
            selector: ''

        };
        myList.form.show = false;

        myList.data = JSON.parse(localStorage.getItem('sites'));
        myList.add = function () {
            myList.form = {
                icon    : '',
                url     : '',
                name    : '',
                selector: ''

            };
            myList.form.show = true;
            myList.form.index = -1;
        };
        myList.cancel = function () {
            myList.form.show = false;
        };
        myList.edit = function (index) {
            myList.form = myList.data[index];
            myList.form.show = true;
            myList.form.index = index;
        };
        myList.del = function (index) {
            if (confirm("确认删除？")) {
                myList.data.splice(index, 1);
                localStorage.setItem("sites", JSON.stringify(myList.data));
            }
        };
        myList.submit = function () {
            if (myList.form.index == -1) {
                myList.data.push(myList.form);

            } else {

                myList.data[myList.form.index] = myList.form;

            }
            localStorage.setItem("sites", JSON.stringify(myList.data));
            myList.form.show = false;
        }
    })
    .controller('OptionExchangeCtrl', function ($scope) {

    })
    .controller('OptionAboutCtrl', function ($scope) {

    });