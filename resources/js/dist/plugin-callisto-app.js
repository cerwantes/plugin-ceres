(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Vue.component("add-item-confirm", {

    props: [
        "basketItem",
        "baseUrl",
        "quantity"
    ],

    template: "#vue-add-item-confirm",

    methods: {

        /**
         * TODO
         * @returns {string}
         */
        getImage: function()
        {
            var path = "";

            for (var i = 0; i < this.basketItem.variationImageList.length; i++)
            {
                if (this.basketItem.variationImageList[i].path !== "")
                {
                    path = this.basketItem.variationImageList[i].path;
                }
            }
            return this.baseUrl + "/" + path;
        }

    }
});

},{}],2:[function(require,module,exports){
var ResourceService       = require("services/ResourceService");

Vue.component("basket-preview", {

    template: "#vue-basket-preview",

    data: function()
    {
        return {
            basket: {},
            basketItems: []
        };
    },

    /**
     * bind to basket and bind the basket items
     */
    ready: function()
    {
        ResourceService.bind("basket", this);
        ResourceService.bind("basketItems", this);
    }
});

},{"services/ResourceService":48}],3:[function(require,module,exports){
var ResourceService = require("services/ResourceService");

Vue.component("basket-totals", {

    template: "#vue-basket-totals",

    props: [
        "config"
    ],

    data: function()
    {
        return {
            basket: {}
        };
    },

    /**
     * bind to basket
     */
    ready: function()
    {
        ResourceService.bind("basket", this);
    },

    methods:
    {
        /**
         * TODO
         * @param name
         * @returns {boolean}
         */
        showProperty: function(name)
        {
            return !this.config || this.config.indexOf(name) >= 0 || this.config.indexOf("all") >= 0;
        }
    }
});

},{"services/ResourceService":48}],4:[function(require,module,exports){
Vue.component("coupon", {

    template: "#vue-coupon"

});

},{}],5:[function(require,module,exports){
var ResourceService       = require("services/ResourceService");

Vue.component("basket-list", {

    template: "#vue-basket-list",

    props: [
        "size"
    ],

    data: function()
    {
        return {
            basketItems: []
        };
    },

    /**
     * bind to basket and show the items in a small or large list
     */
    ready: function()
    {
        ResourceService.bind("basketItems", this);
        this.size = this.size || "large";
    }
});

},{"services/ResourceService":48}],6:[function(require,module,exports){
var ResourceService       = require("services/ResourceService");

Vue.component("basket-list-item", {

    template: "#vue-basket-list-item",

    props: [
        "basketItem",
        "size"
    ],

    data: function()
    {
        return {
            waiting: false,
            deleteConfirmed: false,
            deleteConfirmedTimeout: null
        };
    },

    methods: {

        /**
         * remove item from basket
         */
        deleteItem: function()
        {
            var self = this;

            if (!this.deleteConfirmed)
            {
                this.deleteConfirmed = true;
                this.deleteConfirmedTimeout = window.setTimeout(
                    function()
                    {
                        self.resetDelete();
                    },
                    5000
                );
            }
            else
            {
                this.waiting = true;
                ResourceService
                    .getResource("basketItems")
                    .remove(this.basketItem.id)
                    .done(
                        function()
                        {
                            self.resetDelete();
                        });
            }
        },

        /**
         * update item quantity in basket
         * @param quantity
         */
        updateQuantity: function(quantity)
        {
            if (this.basketItem.quantity === quantity)
            {
                return;
            }

            this.basketItem.quantity = quantity;
            this.waiting = true;
            var self = this;

            ResourceService
                .getResource("basketItems")
                .set(this.basketItem.id, this.basketItem)
                .done(
                    function()
                    {
                        self.waiting = false;
                    });
        },

        /**
         * cancel delete
         */
        resetDelete: function()
        {
            this.deleteConfirmed = false;
            if (this.deleteConfirmedTimeout)
            {
                window.clearTimeout(this.deleteConfirmedTimeout);
            }
        }
    }
});

},{"services/ResourceService":48}],7:[function(require,module,exports){
var APIService = require("services/APIService");

Vue.component("payment-provider-select", {

    template: "#vue-payment-provider-select",

    props: ["paymentProviderList"],

    data: function()
    {
        return {
            selectedPaymentProvider: {}
        };
    },

    /**
     * init event listener
     */
    created: function()
    {
        this.addEventListener();
    },

    methods: {
        /**
         * event on payment provider change
         * TODO
         */
        onPaymentProviderChange: function()
        {
            CheckoutService.setMethodOfPaymentId(this.selectedPaymentProvider);
        },

        /**
         * add event listener
         */
        addEventListener: function()
        {
            // listen on APIService events and handle new data
        }
    }
});

},{"services/APIService":40}],8:[function(require,module,exports){
Vue.component("shipping-profile-select", {

    template: "#vue-shipping-profile-select",

    props: ["shippingProfileData"],

    data: function()
    {
        return {
            shippingProfileList    : [],
            selectedShippingProfile: {}
        };
    },

    /**
     * add shipping provider
     * init event listener
     */
    created: function()
    {
        // use when real data is implemented
        // if(this.shippingProfileData)
        // {
        //     this.shippingProfileList = jQuery.parseJSON(this.shippingProfileData);
        // }

        this.shippingProfileList =
        [
                {id: "1", name: "DHL", price: 3.99},
                {id: "2", name: "Hermes", price: 2.99},
                {id: "3", name: "UPS", price: 5}
        ];

        this.addEventListener();
    },

    methods: {
        /**
         * method on shipping profile changed
         */
        onShippingProfileChange: function()
        {
            // TODO remove log
            // console.log(this.shippingProfileList);
            // console.log(this.selectedShippingProfile);
        },

        /**
         * format price
         * @param price
         * @param currency
         * @returns {*}
         */
        formatPrice: function(price, currency)
        {
            return MonetaryFormatService.formatMonetary(price, currency);
        },

        /**
         * add event listener
         */
        addEventListener: function()
        {
            // listen on APIService events and handle new data
        }
    }
});

},{}],9:[function(require,module,exports){
Vue.component("address-input-group", {

    template: "#vue-address-input-group",

    props: [
        "addressData",
        "locale"
    ],

    /**
     * check if address data exist and create an empty one if not
     */
    created: function()
    {
        if (!this.addressData)
        {
            this.addressData = {};
        }

        this.locale = "DE";
    }
});

},{}],10:[function(require,module,exports){
var ModalService = require("services/ModalService");

Vue.component("address-select", {

    template: "#vue-address-select",

    props: [
        "addressList",
        "addressType",
        "selectedAddressId"
    ],

    data: function()
    {
        return {
            selectedAddress: {},
            addressModal   : {},
            modalType      : "",
            headline       : "",
            addressToEdit  : {},
            addressModalId : ""
        };
    },

    /**
     *  check if the address list is not empty and select the address with the matching id
     */
    created: function()
    {
        if (!this.isAddressListEmpty())
        {
            for (var index in this.addressList)
            {
                if (this.addressList[index].id === this.selectedAddressId)
                {
                    this.selectedAddress = this.addressList[index];
                }
            }
        }
        else
        {
            this.addressList = [];
        }

        this.addressModalId = "addressModal" + this._uid;
    },

    /**
     * select the address modal
     */
    ready: function()
    {
        this.addressModal = ModalService.findModal(document.getElementById(this.addressModalId));
    },

    methods: {
        /**
         * update the selected address
         * @param index
         */
        onAddressChanged: function(index)
        {
            this.selectedAddress = this.addressList[index];

            this.$dispatch("address-changed", this.selectedAddress);
        },

        /**
         * check if the address list is empty
         * @returns {boolean}
         */
        isAddressListEmpty: function()
        {
            return !(this.addressList && this.addressList.length > 0);
        },

        /**
         * check if a company name exists and show it bold
         * @returns {boolean}
         */
        showNameStrong: function()
        {
            return !this.selectedAddress.name1 || this.selectedAddress.name1.length === 0;
        },

        /**
         * show the add icon
         */
        showAdd: function()
        {
            this.modalType = "create";
            this.addressToEdit = {};
            this.updateHeadline();

            $(".wrapper-bottom").append($("#" + this.addressModalId));
            this.addressModal.show();
        },

        /**
         * show the edit icon
         * @param address
         */
        showEdit: function(address)
        {
            this.modalType = "update";
            this.addressToEdit = address;
            this.updateHeadline();

            $(".wrapper-bottom").append($("#" + this.addressModalId));
            this.addressModal.show();
        },

        /**
         * close the actual modal
         */
        close: function()
        {
            this.addressModal.hide();
        },

        /**
         * dynamic create the header line in the modal
         */
        updateHeadline: function()
        {
            var headline  = (this.addressType === "2") ? Translations.Callisto.orderShippingAddress : Translations.Callisto.orderInvoiceAddress;

            headline += (this.modalType === "update") ? Translations.Callisto.generalEdit : Translations.Callisto.generalAdd;
            this.headline = headline;
        }

    }
});

},{"services/ModalService":45}],11:[function(require,module,exports){
var AddressService    = require("services/AddressService");
var ValidationService = require("services/ValidationService");

Vue.component("create-update-address", {

    template: "#vue-create-update-address",

    props: [
        "addressData",
        "addressModal",
        "addressList",
        "modalType",
        "addressType"
    ],

    methods: {
        /**
         * validate the address fields
         */
        validate: function()
        {
            var self = this;

            ValidationService.validate($("#my-form"))
                .done(function()
                {
                    self.saveAddress();
                })
                .fail(function(invalidFields)
                {
                    ValidationService.markInvalidFields(invalidFields, "error");
                });

        },

        /**
         * save the new address or update an existing one
         */
        saveAddress: function()
        {
            if (this.modalType === "create")
            {
                this.createAddress();
            }
            else if (this.modalType === "update")
            {
                this.updateAddress();
            }
        },

        /**
         * update an address
         */
        updateAddress: function()
        {
            AddressService
                .updateAddress(this.addressData, this.addressType)
                .done(function()
                {
                    this.addressModal.hide();
                    for (var key in this.addressList)
                    {
                        var address = this.addressList[key];

                        if (address.id === this.addressData.id)
                        {
                            address = this.addressData;
                            break;
                        }
                    }
                }.bind(this));
        },

        /**
         * create a new address
         */
        createAddress: function()
        {
            AddressService
                .createAddress(this.addressData, this.addressType, true)
                .done(function()
                {
                    this.addressModal.hide();
                    this.addressList.push(this.addressData);
                }.bind(this));
        }
    }

});

},{"services/AddressService":41,"services/ValidationService":49}],12:[function(require,module,exports){
var CheckoutService = require("services/CheckoutService");

Vue.component("invoice-address-select", {

    template: "<address-select v-on:address-changed=\"addressChanged\" address-type=\"1\" :address-list=\"addressList\" :selected-address-id=\"selectedAddressId\"></address-select>",

    props: ["addressList", "selectedAddressId"],

    /**
     * init event listener
     */
    created: function()
    {
        this.addEventListener();
        CheckoutService.init();
    },

    methods: {
        /**
         * add event listener
         */
        addEventListener: function()
        {
            // listen on APIService events and handle new data
        },

        /**
         * update the billing address
         * @param selectedAddress
         */
        addressChanged: function(selectedAddress)
        {
            CheckoutService.setBillingAddressId(selectedAddress.id);
        }
    }
});

},{"services/CheckoutService":43}],13:[function(require,module,exports){
var CheckoutService = require("services/CheckoutService");

Vue.component("shipping-address-select", {

    template: "<address-select v-on:address-changed=\"addressChanged\" address-type=\"2\" :address-list=\"addressList\" :selected-address-id=\"selectedAddressId\"></address-select>",

    props: ["addressList", "selectedAddressId"],

    /**
     * init event listener
     */
    created: function()
    {
        this.addEventListener();
    },

    methods: {
        /**
         * add event listener
         */
        addEventListener: function()
        {
            // listen on APIService events and handle new data
        },

        /**
         * update delivery address
         * @param selectedAddress
         */
        addressChanged: function(selectedAddress)
        {
            CheckoutService.setDeliveryAddressId(selectedAddress.id);
        }
    }
});

},{"services/CheckoutService":43}],14:[function(require,module,exports){
var CountryService = require("services/CountryService");

Vue.component("country-select", {

    template: "#vue-country-select",

    props: [
        "countryData",
        "countryNameMap",
        "selectedCountryId",
        "selectedStateId"
    ],

    data: function()
    {
        return {
            countryList: [],
            stateList  : []
        };
    },

    /**
     * get shipping countries
     */
    created: function()
    {
        this.countryList = CountryService.parseShippingCountries(this.countryData, this.selectedCountryId ? this.selectedCountryId : 1);

        CountryService.translateCountryNames(this.countryNameMap, this.countryList);
        CountryService.sortCountries(this.countryList);
    },

    methods: {
        /**
         * method to fire when the country has changed
         */
        countryChanged: function()
        {
            this.selectedStateId = null;
        }
    },

    watch: {
        /**
         * add watcher to handle country changed
         */
        selectedCountryId: function()
        {
            this.countryList = CountryService.parseShippingCountries(this.countryData, this.selectedCountryId);
            this.stateList = CountryService.parseShippingStates(this.countryData, this.selectedCountryId);
        }
    }
});

},{"services/CountryService":44}],15:[function(require,module,exports){
var ApiService          = require("services/ApiService");
var NotificationService = require("services/NotificationService");
var ModalService        = require("services/ModalService");

var ValidationService = require("services/ValidationService");

Vue.component("registration", {

    template: "#vue-registration",

    props: [
        "modalElement",
        "guestMode",
        "isSimpleRegistration"
    ],

    data: function()
    {
        return {
            password      : "",
            passwordRepeat: "",
            username      : "",
            billingAddress: {}
        };
    },

    /**
     * check if the component should be a normal registration or the guest registration
     */
    created: function()
    {
        if (this.guestMode === null || this.guestMode === "")
        {
            this.guestMode = false;
        }
        else
        {
            this.guestMode = true;
        }
    },

    methods: {
        /**
         * validate the registration form
         */
        validateRegistration: function()
        {
            var self = this;

            ValidationService.validate($("#registration" + this._uid))
                .done(function()
                {
                    self.sendRegistration();
                })
                .fail(function(invalidFields)
                {
                    ValidationService.markInvalidFields(invalidFields, "error");
                });
        },

        /**
         * send the registration
         */
        sendRegistration: function()
        {
            var userObject = this.getUserObject();
            var component  = this;

            ApiService.post("/rest/customer", userObject)
                .done(function(response)
                {
                    ApiService.setToken(response);

                    if (document.getElementById(component.modalElement) !== null)
                    {
                        ModalService.findModal(document.getElementById(component.modalElement)).hide();
                    }

                    NotificationService.success(Translations.Callisto.accRegistrationSuccessful).closeAfter(3000);
                });

        },

        /**
         * handle the userobject which is send to the server
         * @returns {{contact: {referrerId: number, typeId: number, options: {typeId: {typeId: number, subTypeId: number, value: *, priority: number}}}}|{contact: {referrerId: number, typeId: number, password: *, options: {typeId: {typeId: number, subTypeId: number, value: *, priority: number}}}}}
         */
        getUserObject: function()
        {
            var userObject =
                {
                    contact: {
                        referrerId: 1,
                        typeId    : 1,
                        options   : {
                            typeId: {
                                typeId   : 2,
                                subTypeId: 4,
                                value    : this.username,
                                priority : 0
                            }
                        }
                    }
                };

            if (!this.guestMode)
            {
                userObject.contact.password = this.password;
            }

            if (!this.isSimpleRegistration)
            {
                userObject.billingAddress = this.billingAddress;
            }

            return userObject;
        }
    }
});

},{"services/ApiService":42,"services/ModalService":45,"services/NotificationService":46,"services/ValidationService":49}],16:[function(require,module,exports){
var ApiService          = require("services/ApiService");
var NotificationService = require("services/NotificationService");
var ModalService        = require("services/ModalService");

Vue.component("login", {

    template: "#vue-login",

    props: [
        "modalElement"
    ],

    data: function()
    {
        return {
            password: "",
            username: ""
        };
    },

    methods: {
        /**
         * open login modal
         */
        showLogin: function()
        {
            ModalService.findModal(document.getElementById(this.modalElement)).show();
        },

        /**
         * send login data
         */
        sendLogin: function()
        {
            var component = this;

            ApiService.post("/rest/customer/login", {email: this.username, password: this.password}, {supressNotifications: true})
                .done(function(response)
                {
                    ApiService.setToken(response);

                    if (document.getElementById(component.modalElement) !== null)
                    {
                        ModalService.findModal(document.getElementById(component.modalElement)).hide();
                    }

                    NotificationService.success(Translations.Callisto.accLoginSuccessful).closeAfter(3000);
                })
                .fail(function(response)
                {
                    switch (response.code)
                    {
                    case 401:
                        NotificationService.error(Translations.Callisto.accLoginFailed).closeAfter(3000);
                        break;
                    default:
                        return;
                    }
                });
        }
    }
});

},{"services/ApiService":42,"services/ModalService":45,"services/NotificationService":46}],17:[function(require,module,exports){
var ApiService = require("services/ApiService");

Vue.component("user-login-handler", {

    template: "#vue-user-login-handler",

    /**
     * add global event listener for login and logout
     */
    ready: function()
    {
        var self = this;

        ApiService.listen("AfterAccountAuthentication",
            function(userData)
            {
                self.setUserLoggedIn(userData);
            });

        ApiService.listen("AfterAccountContactLogout",
            function()
            {
                self.setUserLoggedOut();
            });
    },

    methods: {
        /**
         * set the actual user logged in
         * @param userData
         */
        setUserLoggedIn: function(userData)
        {
            if (userData.accountContact.firstName.length > 0 && userData.accountContact.lastName.length > 0)
            {
                this.$el.innerHTML = this.getUserHTML(userData.accountContact.firstName + " " + userData.accountContact.lastName);
            }
            else
            {
                this.$el.innerHTML = this.getUserHTML(userData.accountContact.options[0].value);
            }

            this.$compile(this.$el);
        },

        /**
         * set the actual user logged out
         */
        setUserLoggedOut: function()
        {
            this.$el.innerHTML = "<a data-toggle=\"modal\" href=\"#login\">Einloggen</a>" +
                "<small>oder</small>" +
                "<a data-toggle=\"modal\" href=\"#signup\">Registieren</a>";
        },

        /**
         * build the new user html for the head dynamic (no page reload required)
         * @param username
         * @returns {string}
         */
        getUserHTML: function(username)
        {
            return "<a href=\"#\" class=\"dropdown-toggle\" id=\"accountMenuList\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">" +
                Translations.Callisto.generalHello + " " + username +
                "</a>" +
                "<div class=\"country-settings account-menu dropdown-menu dropdown-menu-right small\">" +
                "<div class=\"list-group\" aria-labelledby=\"accountMenuList\">" +
                "<a href=\"/my-account\" class=\"list-group-item small\"><i class=\"fa fa-user\"></i> " + Translations.Callisto.accMyAccount + "</a>" +
                "<a href=\"#\" class=\"list-group-item small\" v-logout><i class=\"fa fa-sign-out\"></i> " + Translations.Callisto.accLogout + "</a>" +
                "</div>" +
                "</div>";
        }
    }
});

},{"services/ApiService":42}],18:[function(require,module,exports){
var NotificationService = require("services/NotificationService");

Vue.component("user-login-watcher", {

    props: [
        "userLoggedIn",
        "route",
        "isUserLoggedIn"
    ],

    /**
     * check if user is logged in or if user is logged out
     * route to the new route
     */
    ready: function()
        {
        if (this.route.length > 0)
            {
            if (this.userLoggedIn === this.isUserLoggedIn)
                {
                if (this.userLoggedIn === "false")
                    {
                    NotificationService.error(Translations.Callisto.accPleaseLogin).closeAfter(3000);
                }
                else
                    {
                    NotificationService.error(Translations.Callisto.accAlreadyLoggedIn).closeAfter(3000);
                }

                window.location.pathname = this.route;
            }
        }
    }
});

},{"services/NotificationService":46}],19:[function(require,module,exports){
var ResourceService      = require("services/ResourceService");

Vue.component("add-to-basket", {

    template: "#vue-add-to-basket",

    data: function()
    {
        return {
            quantity: 1
        };
    },

    methods:
    {
        updateQuantity: function(value)
        {
            this.quantity = value;
        },

        addToBasket: function()
        {
            var self = this;

            ResourceService
                .getResource("basketItems")
                .push({
                    variationId: ResourceService.getResource("currentVariation").val().variationBase.id,
                    quantity: this.quantity
                }).done(function()
                {
                    self.quantity = 1;
                });
        }
    }
});

},{"services/ResourceService":48}],20:[function(require,module,exports){
var PaginationService = require("services/PaginationService");

Vue.component("item-list-pagination", {

    template: "#vue-item-list-pagination",

    props: [
        "paginationPosition",
        "position",
        "itemList",
        "maxCount"
    ],

    data: function()
    {
        return {
            currentPaginationEntry: 1,
            currentURL            : "",
            numberOfEntries       : 1
        };
    },

    /**
     * initialize pagination necessary variables
     */
    ready: function()
    {
        this.currentPaginationEntry = this.getQueryStringValue("page");
        var url                     = window.location.href;

        this.currentURL = url.replace("&page=" + this.currentPaginationEntry, "");
        this.currentPaginationEntry = parseInt(this.currentPaginationEntry) || 1;

        this.numberOfEntries = this.calculateMaxPages();

        if (this.currentPaginationEntry < 0)
        {
            this.currentPaginationEntry = 1;
        }
        else if (this.currentPaginationEntry > this.numberOfEntries)
        {
            this.currentPaginationEntry = this.numberOfEntries;
        }
    },

    methods: {
        /**
         * get param from the url
         * @param key
         * @returns {string}
         */
        getQueryStringValue: function(key)
        {
            return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        },

        /**
         * calculate how much pages exist
         * @returns {*}
         */
        calculateMaxPages: function()
        {
            var pages        = (this.maxCount / PaginationService.itemsPerPage);
            var roundedPages = pages.toString().split(".");

            if (roundedPages[1] > 0)
            {
                roundedPages[0] = parseInt(roundedPages[0]) + 1;
            }

            return roundedPages[0];
        },

        /**
         * get the new items and update the category list
         * @param page
         */
        updateItemCategoryList: function(page)
        {
            if (this.currentURL.split("?").length > 0)
            {
                this.currentURL = this.currentURL.split("?")[0];
            }

            var url = this.currentURL + "?page=" + page + "&items_per_page=" + PaginationService.itemsPerPage;

            window.open(url, "_self");
        },

        /**
         * show pagination top, bottom or top-bottom
         * @returns {*}
         */
        showPagination: function()
        {
            return this.paginationPosition.includes(this.position);
        },

        /**
         * show the first pagination entry
         * @returns {boolean}
         */
        showFirstPaginationEntry: function()
        {
            var show = true;

            if (this.currentPaginationEntry <= 2)
            {
                show = false;
            }

            return show;
        },

        /**
         * get the last entry in the pagination
         * @returns {*}
         */
        getLastPaginationEntry: function()
        {
            return this.numberOfEntries;
        },

        /**
         * show the last pagination entry
         * @returns {boolean}
         */
        showLastPaginationEntry: function()
        {
            var show = false;

            if (this.currentPaginationEntry < this.numberOfEntries - 1)
            {
                show = true;
            }

            return show;
        },

        /**
         * get the previous pagination entry
         * @returns {number}
         */
        previousPaginationEntry: function()
        {
            var previousPage = this.currentPaginationEntry - 1;

            if (previousPage <= 1)
            {
                previousPage = 1;
            }

            return previousPage;
        },

        /**
         * get the next pagination entry
         * @returns {*}
         */
        nextPaginationEntry: function()
        {
            var nextPage = this.currentPaginationEntry + 1;

            if (nextPage >= this.numberOfEntries)
            {
                nextPage = this.numberOfEntries;
            }

            return nextPage;
        },

        /**
         * show the dots on the left side
         * @returns {boolean}
         */
        showDotsLeft: function()
        {
            var show = true;

            if (this.currentPaginationEntry <= 3)
            {
                show = false;
            }

            return show;
        },

        /**
         * show the dots on the right side
         * @returns {boolean}
         */
        showDotsRight: function()
        {
            var show = true;

            if (this.currentPaginationEntry >= this.numberOfEntries - 2)
            {
                show = false;
            }

            return show;
        },

        /**
         * show the arrows on the left side
         * @returns {boolean}
         */
        showArrowsLeft: function()
        {
            var show = false;

            if (this.currentPaginationEntry > 1)
            {
                show = true;
            }

            return show;
        },

        /**
         * show the arrows on the right side
         * @returns {boolean}
         */
        showArrowsRight: function()
        {
            var show = true;

            if (this.currentPaginationEntry === this.numberOfEntries)
            {
                show = false;
            }

            return show;
        }
    }
});

},{"services/PaginationService":47}],21:[function(require,module,exports){
Vue.component("quantity-input", {

    template: "#vue-quantity-input",

    props: ["value", "timeout", "min", "max", "vertical"],

    data: function()
    {
        return {
            timeoutHandle: null
        };
    },

    /**
     * TODO
     */
    ready: function()
    {
        this.timeout = this.timeout || 300;
        this.min = this.min || 1;
        this.max = this.max || 999;
        this.vertical = this.vertical || false;

        this.$watch("value", function(newValue)
        {

            if (newValue < this.min)
            {
                this.value = this.min;
            }

            if (newValue > this.max)
            {
                this.value = this.max;
            }

            if (this.timeoutHandle)
            {
                window.clearTimeout(this.timeoutHandle);
            }

            var self = this;

            this.timeoutHandle = window.setTimeout(
                function()
                {
                    self.$dispatch("quantity-change", newValue);
                },
                this.timeout
            );
        });
    }

});

},{}],22:[function(require,module,exports){
(function($)
{

    var OWL_CONFIG = {
        SINGLE : {
            singleItem           : true,
            slideSpeed           : 1000,
            navigation           : true,
            navigationText       : [
                "<i class='fa fa-chevron-left' aria-hidden='true'></i>",
                "<i class='fa fa-chevron-right' aria-hidden='true'></i>"
            ],
            pagination           : false,
            responsiveRefreshRate: 200
        },
        PREVIEW: {
            items                : 8,
            itemsDesktop         : [1199, 8],
            itemsDesktopSmall    : [979, 8],
            itemsTablet          : [768, 6],
            itemsMobile          : [479, 4],
            navigation           : true,
            navigationText       : [
                "<i class='fa fa-chevron-left' aria-hidden='true'></i>",
                "<i class='fa fa-chevron-right' aria-hidden='true'></i>"
            ],
            pagination           : false,
            responsiveRefreshRate: 100
        }
    };

    var ResourceService = require("services/ResourceService");

    Vue.component("variation-image-list", {

        template: "#vue-variation-image-list",

        data: function()
        {
            return {
                currentVariation: {},
                currentItem     : 0
            };
        },

        ready: function()
        {
            // (Re-)initialize carousels on each variation change
            ResourceService.watch("currentVariation", function(newValue)
            {
                this.currentVariation = newValue;

                // (re-)init big image carousel
                this.initCarousel(this.$els.single, OWL_CONFIG.SINGLE);

                // (re-)init preview image carousel
                this.initCarousel(this.$els.preview, OWL_CONFIG.PREVIEW);
            }.bind(this));
        },

        methods: {
            /**
             * Initialize jquery carousel plugin
             * @param {HTMLElement} el      The root element to initialize carousel on
             * @param {*}           config  The carousel configuration (@see http://owlgraphic.com/owlcarousel/index.html#how-to)
             */
            initCarousel: function(el, config)
            {
                var self = this;
                var owl = $(el).data("owlCarousel");

                config.afterAction = function()
                {
                    // 'this' points to owl carousel instance
                    self.currentItem = this.currentItem;
                };

                if (owl)
                {
                    owl.destroy();
                }

                // wait until markup is re-rendered with new data.
                Vue.nextTick(function()
                {
                    $(el).owlCarousel(config);
                });
            },

            /**
             * Navigate to carousel element
             * @param {number} index    The index of the element to go to.
             */
            goTo: function(index)
            {
                var owl = $(this.$els.single).data("owlCarousel");

                if (owl)
                {
                    owl.goTo(index);
                }
            }
        }

    });

})(jQuery);

},{"services/ResourceService":48}],23:[function(require,module,exports){
var ApiService = require("services/ApiService");
var ResourceService = require("services/ResourceService");

// cache loaded variation data for reuse
var VariationData = {};

Vue.component("variation-select", {

    template: "#vue-variation-select",

    props: ["attributes", "variations", "preselect"],

    data: function()
    {
        return {
            // Collection of currently selected variation attributes.
            selectedAttributes: {}
        };
    },

    ready: function()
    {
        // initialize selected attributes to be tracked by change detection
        var attributes = {};

        for (var attributeId in this.attributes)
        {
            attributes[attributeId] = null;
        }
        this.selectedAttributes = attributes;

        // set attributes of preselected variation if exists
        if (this.preselect)
        {
            // find variation by id
            var preselectedVariation = this.variations.filter(function(variation)
            {
                return variation.variationId === this.preselect;
            }.bind(this));

            if (!!preselectedVariation && preselectedVariation.length === 1)
            {
                // set attributes of preselected variation
                this.setAttributes(preselectedVariation[0]);
            }
        }

        // search for matching variation on each change of attribute selection
        this.$watch("selectedAttributes", function()
        {

            // search variations matching current selection
            var possibleVariations = this.filterVariations();

            if (possibleVariations.length === 1)
            {
                // only 1 matching variation remaining:
                // set remaining attributes if not set already. Will trigger this watcher again.
                if (!this.setAttributes(possibleVariations[0]))
                {
                    // all attributes are set => load variation data
                    var variationId = possibleVariations[0].variationId;

                    if (VariationData[variationId])
                    {
                        // reuse cached variation data
                        ResourceService
                            .getResource("currentVariation")
                            .set(VariationData[variationId]);
                    }
                    else
                    {
                        // get variation data from remote
                        ApiService
                            .get("/rest/variations/" + variationId)
                            .done(function(response)
                            {
                                // store received variation data for later reuse
                                VariationData[variationId] = response;
                                ResourceService
                                    .getResource("currentVariation")
                                    .set(response);
                            });
                    }

                }

            }
        }, {
            deep: true
        });

        // watch for changes on selected variation to adjust url
        ResourceService.watch("currentVariation", function(newVariation, oldVariation)
        {

            // replace variation id in url
            var url = window.location.pathname;
            var title = document.getElementsByTagName("title")[0].innerHTML;
            // ItemURLs should match: "/<ITEM_NAME>/<ITEM_ID>/<VARIATION_ID>/"
            var match = url.match(/\/([^\/]*)\/([\d]+)\/?([\d]*)/);

            if (match)
            {
                url = "/" + match[1] + "/" + match[2] + "/" + newVariation.variationBase.id;
            }

            window.history.replaceState({}, title, url);

        });
    },

    methods: {

        /**
         * Finds all variations matching a given set of attributes.
         * @param {{[int]: int}}  attributes   A map containing attributeIds and attributeValueIds. Used to filter variations
         * @returns {array}                    A list of matching variations.
         */
        filterVariations: function(attributes)
        {
            attributes = attributes || this.selectedAttributes;
            return this.variations.filter(function(variation)
            {

                for (var i = 0; i < variation.attributes.length; i++)
                {
                    var id = variation.attributes[i].attributeId;
                    var val = variation.attributes[i].attributeValueId;

                    if (!!attributes[id] && attributes[id] !== val)
                    {
                        return false;
                    }
                }
                return true;

            });
        },

        /**
         * Tests if a given attribute value is not available depending on the current selection.
         * @param {int}     attributeId         The id of the attribute
         * @param {int}     attributeValueId    The valueId of the attribute
         * @returns {boolean}                   True if the value can be combined with the current selection.
         */
        isEnabled: function(attributeId, attributeValueId)
        {
            // clone selectedAttributes to avoid touching objects bound to UI
            var attributes = JSON.parse(JSON.stringify(this.selectedAttributes));

            attributes[attributeId] = attributeValueId;
            return this.filterVariations(attributes).length > 0;
        },

        /**
         * Set selected attributes by a given variation.
         * @param {*}           variation   The variation to set as selected
         * @returns {boolean}               true if at least one attribute has been changed
         */
        setAttributes: function(variation)
        {
            var hasChanges = false;

            for (var i = 0; i < variation.attributes.length; i++)
            {
                var id = variation.attributes[i].attributeId;
                var val = variation.attributes[i].attributeValueId;

                if (this.selectedAttributes[id] !== val)
                {
                    this.selectedAttributes[id] = val;
                    hasChanges = true;
                }
            }

            return hasChanges;
        }

    }

});

},{"services/ApiService":42,"services/ResourceService":48}],24:[function(require,module,exports){
var ModalService        = require("services/ModalService");
var APIService          = require("services/APIService");
var NotificationService = require("services/NotificationService");

Vue.component("account-settings", {

    template: "#vue-account-settings",

    props: [
        "userData"
    ],

    data: function()
    {
        return {
            newPassword         : "",
            confirmPassword     : "",
            accountSettingsClass: ""
        };
    },

    /**
     * initialize the account settings modal
     */
    ready: function()
    {
        this.accountSettingsClass = "accountSettingsModal" + this._uid;
    },

    computed: {
        /**
         * check if the passwords equal
         * @returns {boolean}
         */
        matchPassword: function()
        {
            if (this.confirmPassword !== "")
            {
                return this.newPassword === this.confirmPassword;
            }
            return true;
        }
    },

    methods: {

        /**
         * open the account settingsmodal
         */
        showChangeAccountSettings: function()
        {
            var accountModal = ModalService.findModal($("." + this.accountSettingsClass));

            $(".wrapper-bottom").append($("." + this.accountSettingsClass));

            accountModal.show();
        },

        /**
         * save the new password
         */
        saveAccountSettings: function()
        {
            var self = this;

            if (this.newPassword !== "" && (this.newPassword === this.confirmPassword))
            {
                APIService.post("/rest/customer/password", {password: this.newPassword})
                    .done(function(response)
                    {
                        self.clearFieldsAndClose();
                        NotificationService.success(Translations.Callisto.accChangePasswordSuccessful).closeAfter(3000);
                    }).fail(function(response)
                {
                        self.clearFieldsAndClose();
                        NotificationService.error(Translations.Callisto.accChangePasswordFailed).closeAfter(5000);
                    });
            }
        },

        /**
         * clear the password fields in the modal
         */
        clearFields: function()
        {
            this.newPassword = "";
            this.confirmPassword = "";
        },

        /**
         * clear the fields and close the modal
         */
        clearFieldsAndClose: function()
        {
            ModalService.findModal($("." + this.accountSettingsClass)).hide();
            this.clearFields();
        },

        /**
         * get the current mail of the user
         * @returns {*}
         */
        getEmail: function()
        {
            return this.userData.options[0].value;
        }
    }

});

},{"services/APIService":40,"services/ModalService":45,"services/NotificationService":46}],25:[function(require,module,exports){
var ApiService = require("services/ApiService");

Vue.component("order-history", {

    template: "#vue-order-history",

    props: [
        "contactId",
        "orderMaxCountPagination"
    ],

    data: function()
    {
        return {
            // needed for pagination
            currentPaginationEntry: 1,
            numberOfEntries       : 1,
            showItemsOf           : "1-6",
            itemsPerPage          : 6,
            // orderObjectToRender
            orderList             : []
        };
    },

    /**
     * get the item of page 1
     * get the max pages for the pagination
     */
    ready: function()
    {
        this.updateOrderList(1);

        this.numberOfEntries = this.calculateMaxPages();
    },

    methods: {
        /**
         * get a new page of items
         * extend this method params for filter handling
         * @param page
         */
        updateOrderList: function(page)
        {
            this.currentPaginationEntry = page;

            var self = this;

            ApiService.get("/rest/order?page=" + page + "&items=" + this.itemsPerPage)
                .done(function(response)
                {
                    ApiService.setToken(response);

                    self.orderList = response.entries;

                    // calculate the show X - X items
                    this.showItemsOf = (((this.currentPaginationEntry - 1) * this.itemsPerPage) + 1) + " - " + (((this.currentPaginationEntry - 1) * this.itemsPerPage) + this.itemsPerPage);
                })
                .fail(function(response)
                {
                    // todo
                });
        },

        /**
         * calculate how much pages exist
         * @returns {number}
         */
        calculateMaxPages: function()
        {
            var pages        = this.orderMaxCountPagination / this.itemsPerPage;
            var roundedPages = Math.floor(pages);

            return roundedPages;
        },

        /**
         * show the first pagination entry
         * @returns {boolean}
         */
        showFirstPaginationEntry: function()
        {
            var show = true;

            if (this.currentPaginationEntry <= 2)
            {
                show = false;
            }

            return show;
        },

        /**
         * get the last entry in the pagination
         * @returns {*}
         */
        getLastPaginationEntry: function()
        {
            return this.numberOfEntries;
        },

        /**
         * show the last pagination entry
         * @returns {boolean}
         */
        showLastPaginationEntry: function()
        {
            var show = false;

            if (this.currentPaginationEntry < this.numberOfEntries - 1)
            {
                show = true;
            }

            return show;
        },

        /**
         * get the previous pagination entry
         * @returns {number}
         */
        previousPaginationEntry: function()
        {
            var previousPage = this.currentPaginationEntry - 1;

            if (previousPage <= 1)
            {
                previousPage = 1;
            }

            return previousPage;
        },

        /**
         * get the next pagination entry
         * @returns {*}
         */
        nextPaginationEntry: function()
        {
            var nextPage = this.currentPaginationEntry + 1;

            if (nextPage >= this.numberOfEntries)
            {
                nextPage = this.numberOfEntries;
            }

            return nextPage;
        },

        /**
         * show the dots on the left side
         * @returns {boolean}
         */
        showDotsLeft: function()
        {
            var show = true;

            if (this.currentPaginationEntry <= 3)
            {
                show = false;
            }

            return show;
        },

        /**
         * show the dots on the right side
         * @returns {boolean}
         */
        showDotsRight: function()
        {
            var show = true;

            if (this.currentPaginationEntry >= this.numberOfEntries - 2)
            {
                show = false;
            }

            return show;
        },

        /**
         * show the arrows on the left side
         * @returns {boolean}
         */
        showArrowsLeft: function()
        {
            var show = false;

            if (this.currentPaginationEntry > 1)
            {
                show = true;
            }

            return show;
        },

        /**
         * show the arrows on the right side
         * @returns {boolean}
         */
        showArrowsRight: function()
        {
            var show = true;

            if (this.currentPaginationEntry === this.numberOfEntries)
            {
                show = false;
            }

            return show;
        }
    }
});

},{"services/ApiService":42}],26:[function(require,module,exports){
Vue.component("language-select", {

    template: "#vue-language-select",

    props: [
        "currentLang"
    ],

    /**
     * check the current language and update the flag in the header
     */
    ready: function()
    {
        if (this.currentLang === "de")
        {
            document.getElementById("currentFlagIcon").classList.add("flag-icon-de");
        }
        else
        {
            document.getElementById("currentFlagIcon").classList.add("flag-icon-gb");
        }
    },

    methods: {
        /**
         * change language if the the flag has changed in the header
         * @param lang
         */
        languageChanged: function(lang)
        {
            if (lang === "de")
            {
                window.open(window.location.origin + "/de" + window.location.pathname, "_self");
            }
            else
            {
                window.open(window.location.origin + "/en" + window.location.pathname, "_self");
            }
        }
    }

});

},{}],27:[function(require,module,exports){
var NotificationService = require("services/NotificationService");

Vue.component("notifications", {

    template: "#vue-notifications",

    data: function()
    {
        return {
            notifications: NotificationService.getNotifications().all()
        };
    },

    methods : {
        /**
         * dissmiss the notification
         * @param notification
         */
        dismiss: function(notification)
        {
            NotificationService.getNotifications().remove(notification);
        }
    }
});

},{"services/NotificationService":46}],28:[function(require,module,exports){
var WaitScreenService = require("services/WaitScreenService");

/**
*
* CURRENTLY NOT IN USE
* MAY BE USEFUL LATER
*
*/

Vue.component("wait-screen", {

    template: "#vue-wait-screen",

    data    : function()
    {
        return {
            overlay: WaitScreenService.getOverlay()
        };
    },

    computed: {
        /**
         * show an overlay over the page
         * @returns {boolean}
         */
        visible: function()
        {
            return this.overlay.count > 0;
        }
    }
});

},{"services/WaitScreenService":50}],29:[function(require,module,exports){
var ResourceService     = require("services/ResourceService");

Vue.directive("add-to-basket", function(value)
{
    /**
     * add the item to the basket
     */
    $(this.el).click(
        function(event)
        {
            ResourceService
              .getResource("basketItems")
              .push(value);

            event.preventDefault();

        });

        // TODO let AddItemConfirm open

});

},{"services/ResourceService":48}],30:[function(require,module,exports){
var ApiService = require("services/ApiService");

Vue.directive("place-order", function()
{
    params: ['trigger'],

    /**
     * TODO
     */
    $elem.click(function(event)
    {
        event.preventDefault();

        ApiService.post("/rest/order")
            .done(function(response)
            {
                var target = $elem.attr("href") || $elem.parents("form").attr("action");

                window.location.assign(target);
            });
    });
});

},{"services/ApiService":42}],31:[function(require,module,exports){
var ApiService          = require( 'services/ApiService' );
var NotificationService = require( 'services/NotificationService' );

Vue.directive( 'prepare-payment', {

    params: ['trigger', 'selector-container', 'selector-iframe', 'target-continue'],

    bind: function() {
        var self = this;
        var trigger = this.params['trigger'] || 'click';
        var $elem   = trigger === 'ready' ? $( document ) : $( this.el );

        $elem.on( trigger, function( e )
        {
            e.preventDefault();

            ApiService.post( "/rest/checkout/payment" ).done( function( response )
            {
                var paymentType     = response.type || 'continue';
                var paymentValue    = response.value || '';

                switch ( paymentType )
                {
                    case 'redirectUrl':
                        window.location.assign( paymentValue );
                        break;
                    case 'externalContentUrl':
                        var iframe = self.getParam( 'selectorIframe' );
                        if( iframe )
                        {
                            $( iframe ).attr('src', paymentValue );
                        }
                        break;
                    case 'htmlContent':
                        var container = self.getParam( 'selectorContainer' );
                        if( container )
                        {
                            $( container ).html( paymentValue );
                        }
                        break;
                    case 'continue':
                        var target = self.getParam( 'targetContinue' );
                        if( target )
                        {
                            window.location.assign( target );
                        }
                        break;
                    case 'errorCode':
                        NotificationService.error( "Bei der Zahlungsabwicklung trat ein Fehler auf: " + paymentValue );
                        break;
                    default:
                        NotificationService.error( "Unbekannte Antwort des Zahlungsanbieters: " + paymentType );
                        break;
                }
            });
        });
    },

    getParam: function( key )
    {
        var param = this.params[key];
        if( !param )
        {
            console.error('param "' + key + '" not set.');
            return;
        }

        return param;
    }

});
},{"services/ApiService":42,"services/NotificationService":46}],32:[function(require,module,exports){
var ApiService          = require("services/ApiService");
var NotificationService = require("services/NotificationService");

Vue.directive("logout", function()
{
    /**
     * logout the current user
     */
    $(this.el).click(
        function(event)
        {
            ApiService.get("/rest/customer/logout")
                .done(
                    function(response)
                    {
                        NotificationService.success(Translations.Callisto.accLogoutSuccessful).closeAfter(3000);

                        // remove address ids from session after logout
                        ApiService.post("/rest/customer/address_selection/0/?typeId=-1")
                            .fail(function(error)
                            {
                                //console.warn(error);
                            });
                    }
                );

            event.preventDefault();

        });

});

},{"services/ApiService":42,"services/NotificationService":46}],33:[function(require,module,exports){
var ResourceService = require("services/ResourceService");

Vue.elementDirective("resource", {
    priority: 10000,
    params  : [
        "name",
        "route",
        "data",
        "events"
    ],
    bind    : function()
    {
        var resource = ResourceService.registerResource(
            this.params.name,
            this.params.route,
            this.params.data
        );
        var events = this.params.events || [];

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i].split("!");
            var usePayload;

            if (event.length > 1)
            {
                usePayload = event[1];
            }

            resource.listen(event[0], usePayload);
        }
    }

});

Vue.elementDirective("resource-list", {
    priority: 10000,
    params  : [
        "name",
        "route",
        "data",
        "events"
    ],
    bind    : function()
    {
        var resource = ResourceService.registerResourceList(
            this.params.name,
            this.params.route,
            this.params.data
        );
        var events = this.params.events || [];

        for (var i = 0; i < events.length; i++)
        {
            var event = events[i].split("!");
            var usePayload;

            if (event.length > 1)
            {
                usePayload = event[1];
            }

            resource.listen(event[0], usePayload);
        }
    }
});

},{"services/ResourceService":48}],34:[function(require,module,exports){
var ResourceService = require("services/ResourceService");

Vue.directive("resource-bind", {

    params: [
        "filters"
    ],

    bind: function()
    {
        var self = this;

        ResourceService.watch(this.arg, function(value)
        {

            var paths = self.expression.split(".");

            for (var i = 0; i < paths.length; i++)
            {
                var path = paths[i];

                value = value[path];
            }

            var filters = self.params.filters || [];

            for (var j = 0; j < filters.length; j++)
            {
                var filter = Vue.filter(self.params.filters[j]);

                value = filter.apply(Object, [value]);
            }

            self.el.innerHTML = value;
        });
    }

});

},{"services/ResourceService":48}],35:[function(require,module,exports){
var ResourceService = require("services/ResourceService");

Vue.directive("resource-if", {

    bind: function()
    {
        var self = this;
        var display = window.getComputedStyle(this.el, null).getPropertyValue("display");

        ResourceService.watch(this.arg, function(value)
        {

            var keys = Object.keys(value);
            var values = keys.map(function(key)
            {
                return value[key];
            });

            // eslint-disable-next-line
            var condition = new Function(keys, "return " + self.expression);

            if (condition.apply(null, values))
            {
                self.el.style.display = display;
            }
            else
            {
                self.el.style.display = "none";
            }
        });
    }

});

},{"services/ResourceService":48}],36:[function(require,module,exports){
var ResourceService   = require("services/ResourceService");
var currencySymbolMap = require("currency-symbol-map");
var accounting        = require("accounting");

Vue.filter("currency", function(price, customCurrency)
{
    var basket = ResourceService.getResource("basket").val();

    var currency = customCurrency || basket.currency;

    if (currency)
    {
        var currencySymbol = currencySymbolMap.getSymbolFromCurrency(currency);

        if (currencySymbol)
        {
            currency = currencySymbol;
        }
    }

    // (%v = value, %s = symbol)
    var options = {
        symbol   : currency,
        decimal  : ",",
        thousand : ".",
        precision: 2,
        format   : "%v %s"
    };

    return accounting.formatMoney(price, options);
});

},{"accounting":51,"currency-symbol-map":52,"services/ResourceService":48}],37:[function(require,module,exports){
Vue.filter("itemImage", function(item, baseUrl)
{
    var imageList = item.variationImageList;

    baseUrl = baseUrl || "/";

    if (baseUrl.charAt(baseUrl.length - 1) !== "/")
    {
        baseUrl += "/";
    }

    if (!!imageList && imageList.length > 0)
    {
        for (var i = 0; i < imageList.length; i++)
        {
            var image = imageList[i];

            if (!!image.path && image.path.length > 0)
            {
                return baseUrl + image.path;
            }
        }
    }

    return "";

});

},{}],38:[function(require,module,exports){
Vue.filter("itemName", function(item, selectedName)
{

    if (selectedName === "0" && item.name1 !== "")
    {
        return item.name1;
    }
    else if (selectedName === "1" && item.name2 !== "")
    {
        return item.name2;
    }
    else if (selectedName === "2" && item.name3 !== "")
    {
        return item.name3;
    }

    return item.name1;
});

},{}],39:[function(require,module,exports){
Vue.filter("itemURL", function(item)
{

    var urlContent = item.itemDescription.urlContent.split("/");
    var i          = urlContent.length - 1;

    return "/" + urlContent[i] + "/" + item.itemBase.id + "/" + item.variationBase.id;

});

},{}],40:[function(require,module,exports){
var NotificationService = require("services/NotificationService");
var WaitScreenService   = require("services/WaitScreenService");

module.exports = (function($)
{

    var _eventListeners = {};

    return {
        get     : _get,
        put     : _put,
        post    : _post,
        delete  : _delete,
        send    : _send,
        setToken: _setToken,
        getToken: _getToken,
        listen  : _listen
    };

    function _listen(event, handler)
    {
        _eventListeners[event] = _eventListeners[event] || [];
        _eventListeners[event].push(handler);
    }

    function _triggerEvent(event, payload)
    {
        if (_eventListeners[event])
        {
            for (var i = 0; i < _eventListeners[event].length; i++)
            {
                var listener = _eventListeners[event][i];

                if (typeof listener !== "function")
                {
                    continue;
                }
                listener.call(Object, payload);
            }
        }
    }

    function _get(url, data, config)
    {
        config = config || {};
        config.method = "GET";
        return _send(url, data, config);
    }

    function _put(url, data, config)
    {
        config = config || {};
        config.method = "PUT";
        return _send(url, data, config);
    }

    function _post(url, data, config)
    {
        config = config || {};
        config.method = "POST";
        return _send(url, data, config);
    }

    function _delete(url, data, config)
    {
        config = config || {};
        config.method = "DELETE";
        return _send(url, data, config);
    }

    function _send(url, data, config)
    {
        var deferred = $.Deferred();

        config = config || {};
        config.data = data ? JSON.stringify(data) : null;
        config.dataType = config.dataType || "json";
        config.contentType = config.contentType || "application/json";
        config.doInBackground = config.doInBackground;
        config.supressNotifications = config.supressNotifications;

        if (!config.doInBackground)
        {
            WaitScreenService.showWaitScreen();
        }
        $.ajax(url, config)
            .done(function(response)
            {
                if (!config.supressNotifications)
                {
                    printMessages(response);
                }
                for (var event in response.events)
                {
                    _triggerEvent(event, response.events[event]);
                }
                deferred.resolve(response.data || response);
            })
            .fail(function(jqXHR)
            {
                var response = jqXHR.responseText ? $.parseJSON(jqXHR.responseText) : {};

                if (!config.supressNotifications)
                {
                    printMessages(response);
                }
                deferred.reject(response.error);
            })
            .always(function()
            {
                if (!config.doInBackground)
                {
                    WaitScreenService.hideWaitScreen();
                }
            });

        return deferred;
    }

    function printMessages(response)
    {
        var notification;

        if (response.error && response.error.message.length > 0)
        {
            notification = NotificationService.error(response.error);
        }

        if (response.success && response.success.message.length > 0)
        {
            notification = NotificationService.success(response.success);
        }

        if (response.warning && response.warning.message.length > 0)
        {
            notification = NotificationService.warning(response.warning);
        }

        if (response.info && response.info.message.length > 0)
        {
            notification = NotificationService.info(response.info);
        }

        if (response.debug && response.debug.class.length > 0)
        {
            notification.trace(response.debug.file + "(" + response.debug.line + "): " + response.debug.class);
            for (var i = 0; i < response.debug.trace.length; i++)
            {
                notification.trace(response.debug.trace[i]);
            }
        }
    }

    function _setToken(token)
    {
        this._token = token;
    }

    function _getToken()
    {
        return this._token;
    }

})(jQuery);

},{"services/NotificationService":46,"services/WaitScreenService":50}],41:[function(require,module,exports){
var ApiService      = require("services/ApiService");
var CheckoutService = require("services/CheckoutService");

module.exports = (function($)
{

    return {
        createAddress: createAddress,
        updateAddress: updateAddress,
        deleteAddress: deleteAddress
    };

    /**
     * create a new address
     * @param address
     * @param addressType
     * @param setActive
     * @returns {*}
     */
    function createAddress(address, addressType, setActive)
    {
        return ApiService.post("rest/customer/address?typeId=" + addressType, address).done(function(response)
        {
            if (setActive)
            {
                if (addressType === 1)
                {
                    CheckoutService.setBillingAddressId(response.id);
                }
                else if (addressType === 2)
                {
                    CheckoutService.setDeliveryAddressId(response.id);
                }
            }
        });
    }

    /**
     * update an existing address
     * @param newData
     * @param addressType
     * @returns {*|Entry|undefined}
     */
    function updateAddress(newData, addressType)
    {
        addressType = addressType || newData.pivot.typeId;
        return ApiService.put("rest/customer/address/" + newData.id + "?typeId=" + addressType, newData);
    }

    /**
     * delete an existing address
     * @param addressId
     * @param addressType
     * @returns {*}
     */
    function deleteAddress(addressId, addressType)
    {
        return ApiService.delete("rest/customer/address/" + addressId + "?typeId=" + addressType);
    }
})(jQuery);

},{"services/ApiService":42,"services/CheckoutService":43}],42:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40,"services/NotificationService":46,"services/WaitScreenService":50}],43:[function(require,module,exports){
var ApiService = require("services/ApiService");

module.exports = (function($)
{

    var checkout = {};
    var initPromise;

    return {
        init                : init,
        setCheckout         : setCheckout,
        setDeliveryAddressId: setDeliveryAddressId,
        setBillingAddressId : setBillingAddressId,
        setMethodOfPaymentId: setMethodOfPaymentId,
        setShippingCountryId: setShippingCountryId,
        setShippingProfileId: setShippingProfileId
    };

    function init(checkoutData)
    {
        if (!initPromise)
        {
            if (checkoutData)
            {
                initPromise = $.Deferred();
                checkout = checkoutData;
                initPromise.resolve();
            }
            else
            {
                initPromise = ApiService.get("rest/checkout").done(function(response)
                {
                    checkout = response;
                });
            }
        }
        return initPromise;
    }

    function _set(property, value)
    {
        checkout[property] = value;
        return ApiService.post("rest/checkout/", checkout).done(function(response)
        {
            checkout = response;
        });
    }

    function setCheckout(checkoutData)
    {
        var properties = Object.keys(checkoutData);

        for (var i = 0; i < properties.length; i++)
        {
            checkout[properties[i]] = checkoutData[properties[i]];
        }

        return ApiService.post("rest/checkout/", checkout).done(function(response)
        {
            checkout = response;
        });
    }

    function setDeliveryAddressId(deliveryAddressId)
    {
        return _set("deliveryAddressId", deliveryAddressId);
    }

    function setBillingAddressId(billingAddressId)
    {
        return _set("billingAddressId", billingAddressId);
    }

    function setMethodOfPaymentId(methodOfPaymentId)
    {
        return _set("methodOfPaymentId", methodOfPaymentId);
    }

    function setShippingCountryId(shippingCountryId)
    {
        return _set("shippingCountryId", shippingCountryId);
    }

    function setShippingProfileId(shippingProfileId)
    {
        return _set("shippingProfileId", shippingProfileId);
    }

})(jQuery);

},{"services/ApiService":42}],44:[function(require,module,exports){
module.exports = (function($)
{

    return {
        parseShippingCountries: parseShippingCountries,
        parseShippingStates   : parseShippingStates,
        translateCountryNames : translateCountryNames,
        sortCountries         : sortCountries
    };

    function parseShippingCountries(countryData, id)
    {
        var countryList       = JSON.parse(countryData);
        var deliveryCountries = [];

        if (countryList === null)
        {
            return deliveryCountries;
        }

        for (var key in countryList)
        {
            var country     = countryList[key];
            var option      = {id: country.id, name: country.name, locale: country.isoCode2, selected: false};

            option.selected = (id === country.id);
            deliveryCountries.push(option);
        }

        return deliveryCountries;
    }

    function translateCountryNames(countryNameData, countries)
    {
        var countryNames = JSON.parse(countryNameData);

        if (countryNames === null)
        {
            return;
        }
        for (var id in countryNames)
        {
            var name = countryNames[id];

            for (var i = 0, len = countries.length; i < len; i++)
            {
                var country = countries[i];

                if (country.id === id)
                {
                    country.name = name;
                    break;
                }
            }
        }
    }

    function sortCountries(countries)
    {
        countries.sort(function(first, second)
        {
            if (first.name < second.name)
            {
                return -1;
            }
            if (first.name > second.name)
            {
                return 1;
            }
            return 0;
        });
    }

    function parseShippingStates(countryData, countryID)
    {

        var states      = [];
        var countryList = JSON.parse(countryData);

        for (var key in countryList)
        {
            var country = countryList[key];

            if (country.id === countryID)
            {
                states = country.states;
                break;
            }
        }

        return states;
    }

})(jQuery);

},{}],45:[function(require,module,exports){
module.exports = (function($)
{

    var paused  = false;
    var timeout = -1;
    var interval;
    var timeRemaining;
    var timeStart;

    return {
        findModal: findModal
    };

    function findModal(element)
    {
        return new Modal(element);
    }

    function Modal(element)
    {
        var self = this;
        var $bsModal;

        if ($(element).is(".modal"))
        {
            $bsModal = $(element);
        }
        else
        {
            $bsModal = $(element).find(".modal").first();
        }

        return {
            show             : show,
            hide             : hide,
            setTimeout       : setTimeout,
            startTimeout     : startTimeout,
            pauseTimeout     : pauseTimeout,
            continueTimeout  : continueTimeout,
            stopTimeout      : stopTimeout,
            getModalContainer: getModalContainer
        };

        function show()
        {
            $bsModal.modal("show");

            if ($bsModal.timeout > 0)
            {
                startTimeout();
            }

            return self;
        }

        function hide()
        {
            $bsModal.modal("hide");
            return self;
        }

        function getModalContainer()
        {
            return $bsModal;
        }

        function setTimeout(timeout)
        {
            $bsModal.timeout = timeout;

            $bsModal.find(".modal-content").mouseover(function()
            {
                pauseTimeout();
            });

            $bsModal.find(".modal-content").mouseout(function()
            {
                continueTimeout();
            });

            return this;
        }

        function startTimeout()
        {
            timeRemaining = $bsModal.timeout;
            timeStart = (new Date()).getTime();

            timeout = window.setTimeout(function()
            {
                window.clearInterval(interval);
                hide();
            }, $bsModal.timeout);

            $bsModal.find(".timer").text(timeRemaining / 1000);
            interval = window.setInterval(function()
            {
                if (!paused)
                {
                    var secondsRemaining = timeRemaining - (new Date()).getTime() + timeStart;

                    secondsRemaining = Math.round(secondsRemaining / 1000);
                    $bsModal.find(".timer").text(secondsRemaining);
                }
            }, 1000);
        }

        function pauseTimeout()
        {
            paused = true;
            timeRemaining -= (new Date()).getTime() - timeStart;
            window.clearTimeout(timeout);
        }

        function continueTimeout()
        {
            paused = false;
            timeStart = (new Date()).getTime();
            timeout = window.setTimeout(function()
            {
                hide();
                window.clearInterval(interval);
            }, timeRemaining);
        }

        function stopTimeout()
        {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
        }
    }
})(jQuery);

},{}],46:[function(require,module,exports){
module.exports = (function($)
{

    var notificationCount = 0;
    var notifications     = new NotificationList();

    return {
        log             : _log,
        info            : _info,
        warn            : _warn,
        error           : _error,
        success         : _success,
        getNotifications: getNotifications
    };

    function _log(message, prefix)
    {
        var notification = new Notification(message);

        if (App.config.logMessages)
        {
            console.log((prefix || "") + "[" + notification.code + "] " + notification.message);

            for (var i = 0; i < notification.stackTrace.length; i++)
            {
                _log(notification.stackTrace[i], " + ");
            }
        }

        return notification;
    }

    function _info(message)
    {
        var notification = new Notification(message, "info");

        if (App.config.printInfos)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function _warn(message)
    {
        var notification = new Notification(message, "warning");

        if (App.config.printWarnings)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function _error(message)
    {
        var notification = new Notification(message, "danger");

        if (App.config.printErrors)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function _success(message)
    {
        var notification = new Notification(message, "success");

        if (App.config.printSuccess)
        {
            _printNotification(notification);
        }

        return notification;
    }

    function getNotifications()
    {
        return notifications;
    }

    function _printNotification(notification)
    {
        notifications.add(notification);
        _log(notification);

        return notification;
    }

    function Notification(data, context)
    {
        if (!App.config.printStackTrace)
        {
            data.stackTrace = [];
        }
        var id   = notificationCount++;
        var self = {
            id        : id,
            code      : data.code || 0,
            message   : data.message || data || "",
            context   : context || "info",
            stackTrace: data.stackTrace || [],
            close     : close,
            closeAfter: closeAfter,
            trace     : trace
        };

        return self;

        function close()
        {
            notifications.remove(self);
        }

        function closeAfter(timeout)
        {
            setTimeout(function()
            {
                notifications.remove(self);
            }, timeout);
        }

        function trace(message, code)
        {
            if (App.config.printStackTrace)
            {
                self.stackTrace.push({
                    code   : code || 0,
                    message: message
                });
            }
        }
    }

    function NotificationList()
    {
        var elements = [];

        return {
            all   : all,
            add   : add,
            remove: remove
        };

        function all()
        {
            return elements;
        }

        function add(notification)
        {
            elements.push(notification);
        }

        function remove(notification)
        {
            for (var i = 0; i < elements.length; i++)
            {
                if (elements[i].id === notification.id)
                {
                    elements.splice(i, 1);
                    break;
                }
            }
        }
    }

})(jQuery);

},{}],47:[function(require,module,exports){
module.exports = (function($)
{

    var itemsPerPagePrivate = 0;
    var sortModePrivate     = "";

    return {
        itemsPerPage   : itemsPerPagePrivate,
        sortMode       : sortModePrivate,
        setItemsPerPage: setItemsPerPage,
        setSortMode    : setSortMode
    };

    function setItemsPerPage(itemsPerPage)
    {
        this.itemsPerPagePrivate = itemsPerPage;
    }

    function setSortMode(sortMode)
    {
        this.sortModePrivate = sortMode;
    }

})(jQuery);

},{}],48:[function(require,module,exports){
var ApiService = require("services/ApiService");

module.exports = (function($)
{

    var resources = {};

    return {
        registerResource    : registerResource,
        registerResourceList: registerResourceList,
        getResource         : getResource,
        watch               : watch,
        bind                : bind
    };

    /**
     * Register a new resource
     * @param {string}  name          The name of the resource. Must be a unique identifier
     * @param {string}  route         The route to bind the resource to
     * @param {*}       initialValue  The initial value to assign to the resource
     *
     * @returns {Resource} The created resource.
     */
    function registerResource(name, route, initialValue)
    {
        if (!name)
        {
            throw new Error("Cannot register resource. Name is required.");
        }

        if (!route && !initialValue)
        {
            throw new Error("Cannot register resource. Route or initial value is required.");
        }

        if (resources[name])
        {
            throw new Error("Resource '" + name + "' already exists.");
        }

        var data;

        try
        {
            data = $.parseJSON(initialValue);
        }
        catch (err)
        {
            data = initialValue;
        }

        name = name.toLowerCase();
        resources[name] = new Resource(route, data);

        return resources[name];
    }

    /**
     * Register a new list resource
     * @param {string}  name          The name of the resource. Must be a unique identifier
     * @param {string}  route         The route to bind the resource to
     * @param {*}       initialValue  The initial value to assign to the resource
     *
     * @returns {Resource}            The created resource.
     */
    function registerResourceList(name, route, initialValue)
    {
        if (!name)
        {
            throw new Error("Cannot register resource. Name is required.");
        }

        if (!route && !initialValue)
        {
            throw new Error("Cannot register resource. Route or initial value is required.");
        }

        if (resources[name])
        {
            throw new Error("Resource '" + name + "' already exists.");
        }

        var data;

        try
        {
            data = $.parseJSON(initialValue);
        }
        catch (err)
        {
            data = initialValue;
        }

        name = name.toLowerCase();
        resources[name] = new ResourceList(route, data);

        return resources[name];
    }

    /**
     * Receive a registered resource by its name
     * @param {string}  name    The name of the resource to receive
     *
     * @returns {Resource}      The resource
     */
    function getResource(name)
    {
        name = name.toLowerCase();

        if (!resources[name])
        {
            throw new Error("Unkown resource: " + name);
        }

        return resources[name];
    }

    /**
     * Track changes of a given resource.
     * @param {string}      name        The name of the resource to watch
     * @param {function}    callback    The handler to call on each change
     */
    function watch(name, callback)
    {
        getResource(name).watch(callback);
    }

    /**
     * Bind a resource to a property of a vue instance.
     * @param {string}  name        The name of the resource to bind
     * @param {Vue}     vue         The vue instance
     * @param {string}  property    The property of the vue instance. Optional if the property name is equal to the resource name.
     */
    function bind(name, vue, property)
    {
        property = property || name;
        getResource(name).bind(vue, property);
    }

    /**
     * @class Observable
     * Automatically notifies all attached listeners on any changes.
     */
    function Observable()
    {
        var _value;
        var _watchers = [];

        return {
            get value()
            {
                return _value;
            },
            set value(newValue)
            {
                for (var i = 0; i < _watchers.length; i++)
                {
                    var watcher = _watchers[i];

                    watcher.apply({}, [newValue, _value]);
                }
                _value = newValue;
            },
            watch: function(cb)
            {
                _watchers.push(cb);
            }
        };
    }

    /**
     * @class Resource
     * @param {string}  url             The url to bind the resource to
     * @param {string}  initialValue    The initial value to assign to the resource
     */
    function Resource(url, initialValue)
    {
        var data = new Observable();
        var ready = false;

        // initialize resource
        if (initialValue)
        {
            // initial value was given by constructor
            data.value = initialValue;
            ready = true;
        }
        else if (url)
        {
            // no initial value given
            // => get value from url
            ApiService
                .get(url)
                .done(function(response)
                {
                    data.value = response;
                    ready = true;
                });
        }
        else
        {
            throw new Error("Cannot initialize resource.");
        }

        return {
            watch: watch,
            bind: bind,
            val: val,
            set: set,
            update: update,
            listen: listen
        };

        /**
         * Update this resource on a given event triggered by ApiService.
         * @param {string} event        The event to listen on
         * @param {string} usePayload   A property of the payload to assign to this resource.
         *                              The resource will be updated by GET request if not set.
         */
        function listen(event, usePayload)
        {
            ApiService.listen(event, function(payload)
            {
                if (usePayload)
                {
                    update(payload[usePayload]);
                }
                else
                {
                    update();
                }
            });
        }

        /**
         * Add handler to track changes on this resource
         * @param {function} cb     The callback to call on each change
         */
        function watch(cb)
        {
            if (typeof cb !== "function")
            {
                throw new Error("Callback expected but got '" + (typeof cb) + "'.");
            }
            data.watch(cb);
            if (ready)
            {
                cb.apply({}, [data.value, null]);
            }
        }

        /**
         * Bind a property of a vue instance to this resource
         * @param {Vue}     vue         The vue instance
         * @param {string}   property    The property of the vue instance
         */
        function bind(vue, property)
        {
            if (!vue)
            {
                throw new Error("Vue instance not set.");
            }

            if (!property)
            {
                throw new Error("Cannot bind undefined property.");
            }

            watch(function(newValue)
            {
                vue.$set(property, newValue);
            });
        }

        /**
         * Receive the current value of this resource
         * @returns {*}
         */
        function val()
        {
            return data.value;
        }

        /**
         * Set the value of the resource.
         * @param {*}   value   The value to set.
         * @returns {Deferred}  The PUT request to the url of the resource
         */
        function set(value)
        {
            if (url)
            {
                return ApiService
                    .put(url, value)
                    .done(function(response)
                    {
                        data.value = response;
                    });
            }

            var deferred = $.Deferred();

            data.value = value;
            deferred.resolve();
            return deferred;
        }

        /**
         * Update the value of the resource.
         * @param {*}           value   The new value to assign to this resource. Will receive current value from url if not set
         * @returns {Deferred}          The GET request to the url of the resource
         */
        function update(value)
        {
            if (value)
            {
                var deferred = $.Deferred();

                data.value = value;
                deferred.resolve();
                return deferred;
            }
            else if (url)
            {
                return ApiService
                    .get(url)
                    .done(function(response)
                    {
                        data.value = response;
                    });
            }

            throw new Error("Cannot update resource. Neither an URL nor a value is prodivded.");
        }
    }

    /**
     * @class ResourceList
     * @param {string}  url             The url to bind the resource to
     * @param {string}  initialValue    The initial value to assign to the resource
     */
    function ResourceList(url, initialValue)
    {
        var data = new Observable();
        var ready = false;

        if (url.charAt(url.length - 1) !== "/")
        {
            url += "/";
        }

        if (initialValue)
        {
            data.value = initialValue;
            ready = true;
        }
        else if (url)
        {
            ApiService
                .get(url)
                .done(function(response)
                {
                    data.value = response;
                    ready = true;
                });
        }
        else
        {
            throw new Error("Cannot initialize resource.");
        }

        return {
            watch: watch,
            bind: bind,
            val: val,
            set: set,
            push: push,
            remove: remove,
            update: update,
            listen: listen
        };

        /**
         * Update this resource on a given event triggered by ApiService.
         * @param {string} event        The event to listen on
         * @param {string} usePayload   A property of the payload to assign to this resource.
         *                              The resource will be updated by GET request if not set.
         */
        function listen(event, usePayload)
        {
            ApiService.listen(event, function(payload)
            {
                if (usePayload)
                {
                    update(payload[usePayload]);
                }
                else
                {
                    update();
                }
            });
        }

        /**
         * Add handler to track changes on this resource
         * @param {function} cb     The callback to call on each change
         */
        function watch(cb)
        {
            if (typeof cb !== "function")
            {
                throw new Error("Callback expected but got '" + (typeof cb) + "'.");
            }
            data.watch(cb);

            if (ready)
            {
                cb.apply({}, [data.value, null]);
            }
        }

        /**
         * Bind a property of a vue instance to this resource
         * @param {Vue}     vue         The vue instance
         * @param {sting}   property    The property of the vue instance
         */
        function bind(vue, property)
        {
            if (!vue)
            {
                throw new Error("Vue instance not set.");
            }

            if (!property)
            {
                throw new Error("Cannot bind undefined property.");
            }

            watch(function(newValue)
            {
                vue.$set(property, newValue);
            });
        }

        /**
         * Receive the current value of this resource
         * @returns {*}
         */
        function val()
        {
            return data.value;
        }

        /**
         * Set the value of a single element of this resource.
         * @param {string|number}   key     The key of the element
         * @param {*}               value   The value to set.
         * @returns {Deferred}      The PUT request to the url of the resource
         */
        function set(key, value)
        {
            if (url)
            {
                return ApiService
                    .put(url + key, value)
                    .done(function(response)
                    {
                        data.value = response;
                    });
            }
            var deferred = $.Deferred();

            data.value = value;
            deferred.resolve();
            return deferred;
        }

        /**
         * Add a new element to this resource
         * @param {*}   value   The element to add
         * @returns {Deferred}  The POST request to the url of the resource
         */
        function push(value)
        {

            if (url)
            {
                return ApiService
                    .post(url, value)
                    .done(function(response)
                    {
                        data.value = response;
                    });
            }

            var deferred = $.Deferred();
            var list = data.value;

            list.push(value);
            data.value = list;

            deferred.resolve();
            return deferred;
        }

        /**
         * Remove an element from this resource
         * @param {string|number}   key     The key of the element
         * @returns {Deferred}              The DELETE request to the url of the resource
         */
        function remove(key)
        {
            if (url)
            {
                return ApiService
                    .delete(url + key)
                    .done(function(response)
                    {
                        data.value = response;
                    });
            }

            var deferred = $.Deferred();
            var list = data.value;

            list.splice(key, 1);
            data.value = list;

            deferred.resolve();
            return deferred;
        }

        /**
         * Update the value of the resource.
         * @param {*}           value   The new value to assign to this resource. Will receive current value from url if not set
         * @returns {Deferred}          The GET request to the url of the resource
         */
        function update(value)
        {
            if (value)
            {
                var deferred = $.Deferred();

                data.value = value;
                deferred.resolve();
                return deferred;
            }

            return ApiService
                .get(url)
                .done(function(response)
                {
                    data.value = response;
                });
        }
    }

})(jQuery);

},{"services/ApiService":42}],49:[function(require,module,exports){
module.exports = (function($)
{

    var $form;

    return {
        validate         : _validate,
        getInvalidFields : _getInvalidFields,
        markInvalidFields: _markInvalidFields
    };

    function _validate(form)
    {
        var deferred      = $.Deferred();
        var invalidFields = _getInvalidFields(form);

        if (invalidFields.length > 0)
        {
            deferred.rejectWith(form, [invalidFields]);
        }
        else
        {
            deferred.resolveWith(form);
        }

        return deferred;
    }

    function _getInvalidFields(form)
    {
        $form = $(form);
        var invalidFormControls = [];

        $form.find("[data-validate]").each(function(i, elem)
        {

            if (!_validateElement($(elem)))
            {
                invalidFormControls.push(elem);
            }
        });

        return invalidFormControls;
    }

    function _markInvalidFields(fields, errorClass)
    {
        errorClass = errorClass || "has-error";

        $(fields).each(function(i, elem)
        {
            var $elem = $(elem);

            $elem.addClass(errorClass);
            _findFormControls($elem).on("click.removeErrorClass keyup.removeErrorClass change.removeErrorClass", function()
            {
                if (_validateElement($elem))
                {
                    $elem.removeClass(errorClass);
                    if ($elem.is("[type=\"radio\"], [type=\"checkbox\"]"))
                    {
                        var groupName = $elem.attr("name");

                        $("." + errorClass + "[name=\"" + groupName + "\"]").removeClass(errorClass);
                    }
                    _findFormControls($elem).off("click.removeErrorClass keyup.removeErrorClass change.removeErrorClass");
                }
            });
        });
    }

    function _validateElement(elem)
    {
        var $elem          = $(elem);
        var validationKeys = $elem.attr("data-validate").split("|").map(function(i)
            {
            return i.trim();
        }) || ["text"];
        var hasError       = false;

        _findFormControls($elem).each(function(i, formControl)
        {
            var $formControl  = $(formControl);
            var validationKey = validationKeys[i] || validationKeys[0];

            if (!_isActive($formControl))
            {
                // continue loop
                return true;
            }

            if ($formControl.is("[type=\"checkbox\"], [type=\"radio\"]"))
            {

                if (!_validateGroup($formControl, validationKey))
                {
                    hasError = true;
                }
                return true;
            }

            if ($formControl.is("select"))
            {
                if (!_validateSelect($formControl, validationKey))
                {
                    hasError = true;
                }
                return true;
            }

            if (!_validateInput($formControl, validationKey))
            {
                hasError = true;
            }

            return false;
        });

        return !hasError;
    }

    function _validateGroup($formControl, validationKey)
    {
        var groupName = $formControl.attr("name");
        var $group    = $form.find("[name=\"" + groupName + "\"]");
        var range     = _eval(validationKey) || {min: 1, max: 1};
        var checked   = $group.filter(":checked").length;

        return checked >= range.min && checked <= range.max;

    }

    function _validateSelect($formControl, validationKey)
    {
        return $.trim($formControl.val()) !== validationKey;
    }

    function _validateInput($formControl, validationKey)
    {
        switch (validationKey)
        {
        case "text":
            return _hasValue($formControl);
        case "mail":
            var mailRegExp = /[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

            return _hasValue($formControl) && mailRegExp.test($formControl.val());
        case "number":
            return _hasValue($formControl) && $.isNumeric($.trim($formControl.val()));
        case "ref":
            return _compareRef($.trim($formControl.val()), $.trim($formControl.attr("data-validate-ref")));
        case "regex":
            var ref   = $formControl.attr("data-validate-ref");
            var regex = ref.startsWith("/") ? _eval(ref) : new RegExp(ref);

            return _hasValue($formControl) && regex.test($.trim($formControl.val()));
        default:
            console.error("Form validation error: unknown validation property: \"" + validationKey + "\"");
            return true;
        }
    }

    function _hasValue($formControl)
    {
        return $.trim($formControl.val()).length > 0;
    }

    function _compareRef(value, ref)
    {
        if ($(ref).length > 0)
        {
            ref = $.trim($(ref).val());
        }

        return value === ref;
    }

    function _findFormControls($elem)
    {
        if ($elem.is("input, select, textarea"))
        {
            return $elem;
        }

        return $elem.find("input, select, textarea");
    }

    function _isActive($elem)
    {
        return $elem.is(":visible") && $elem.is(":enabled");
    }

    function _eval(input)
    {
        // eslint-disable-next-line
        return (new Function("return " + input))();
    }

})(jQuery);

},{}],50:[function(require,module,exports){
module.exports = (function($)
{

    var overlay = {
        count    : 0,
        isVisible: false
    };

    return {
        getOverlay    : getOverlay,
        showWaitScreen: showWaitScreen,
        hideWaitScreen: hideWaitScreen
    };

    function getOverlay()
    {
        return overlay;
    }

    function showWaitScreen()
    {
        overlay.count = overlay.count || 0;
        overlay.count++;
        overlay.isVisible = true;
    }

    function hideWaitScreen(force)
    {
        overlay.count = overlay.count || 0;
        if (overlay.count > 0)
        {
            overlay.count--;
        }

        if (force)
        {
            overlay.count = 0;
        }

        if (overlay.count <= 0)
        {
            overlay.count = 0;
            overlay.visible = false;
        }

    }

})(jQuery);

},{}],51:[function(require,module,exports){
/*!
 * accounting.js v0.4.1
 * Copyright 2014 Open Exchange Rates
 *
 * Freely distributable under the MIT license.
 * Portions of accounting.js are inspired or borrowed from underscore.js
 *
 * Full details and documentation:
 * http://openexchangerates.github.io/accounting.js/
 */

(function(root, undefined) {

	/* --- Setup --- */

	// Create the local library object, to be exported or referenced globally later
	var lib = {};

	// Current version
	lib.version = '0.4.1';


	/* --- Exposed settings --- */

	// The library's settings configuration object. Contains default parameters for
	// currency and number formatting
	lib.settings = {
		currency: {
			symbol : "$",		// default currency symbol is '$'
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
			decimal : ".",		// decimal point separator
			thousand : ",",		// thousands separator
			precision : 2,		// decimal places
			grouping : 3		// digit grouping (not implemented yet)
		},
		number: {
			precision : 0,		// default precision on numbers is 0
			grouping : 3,		// digit grouping (not implemented yet)
			thousand : ",",
			decimal : "."
		}
	};


	/* --- Internal Helper Methods --- */

	// Store reference to possibly-available ECMAScript 5 methods for later
	var nativeMap = Array.prototype.map,
		nativeIsArray = Array.isArray,
		toString = Object.prototype.toString;

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js
	 */
	function isString(obj) {
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
	}

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js, delegates to ECMA5's native Array.isArray
	 */
	function isArray(obj) {
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
	}

	/**
	 * Tests whether supplied parameter is a true object
	 */
	function isObject(obj) {
		return obj && toString.call(obj) === '[object Object]';
	}

	/**
	 * Extends an object with a defaults object, similar to underscore's _.defaults
	 *
	 * Used for abstracting parameter handling from API methods
	 */
	function defaults(object, defs) {
		var key;
		object = object || {};
		defs = defs || {};
		// Iterate over object non-prototype properties:
		for (key in defs) {
			if (defs.hasOwnProperty(key)) {
				// Replace values with defaults only if undefined (allow empty/zero values):
				if (object[key] == null) object[key] = defs[key];
			}
		}
		return object;
	}

	/**
	 * Implementation of `Array.map()` for iteration loops
	 *
	 * Returns a new Array as a result of calling `iterator` on each array value.
	 * Defers to native Array.map if available
	 */
	function map(obj, iterator, context) {
		var results = [], i, j;

		if (!obj) return results;

		// Use native .map method if it exists:
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);

		// Fallback for native .map:
		for (i = 0, j = obj.length; i < j; i++ ) {
			results[i] = iterator.call(context, obj[i], i, obj);
		}
		return results;
	}

	/**
	 * Check and normalise the value of precision (must be positive integer)
	 */
	function checkPrecision(val, base) {
		val = Math.round(Math.abs(val));
		return isNaN(val)? base : val;
	}


	/**
	 * Parses a format string or object and returns format obj for use in rendering
	 *
	 * `format` is either a string with the default (positive) format, or object
	 * containing `pos` (required), `neg` and `zero` values (or a function returning
	 * either a string or object)
	 *
	 * Either string or format.pos must contain "%v" (value) to be valid
	 */
	function checkCurrencyFormat(format) {
		var defaults = lib.settings.currency.format;

		// Allow function as format parameter (should return string or object):
		if ( typeof format === "function" ) format = format();

		// Format can be a string, in which case `value` ("%v") must be present:
		if ( isString( format ) && format.match("%v") ) {

			// Create and return positive, negative and zero formats:
			return {
				pos : format,
				neg : format.replace("-", "").replace("%v", "-%v"),
				zero : format
			};

		// If no format, or object is missing valid positive value, use defaults:
		} else if ( !format || !format.pos || !format.pos.match("%v") ) {

			// If defaults is a string, casts it to an object for faster checking next time:
			return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {
				pos : defaults,
				neg : defaults.replace("%v", "-%v"),
				zero : defaults
			};

		}
		// Otherwise, assume format was fine:
		return format;
	}


	/* --- API Methods --- */

	/**
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
	 * Alias: `accounting.parse(string)`
	 *
	 * Decimal must be included in the regular expression to match floats (defaults to
	 * accounting.settings.number.decimal), so if the number uses a non-standard decimal 
	 * separator, provide it as the second argument.
	 *
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
	 *
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
	 */
	var unformat = lib.unformat = lib.parse = function(value, decimal) {
		// Recursively unformat arrays:
		if (isArray(value)) {
			return map(value, function(val) {
				return unformat(val, decimal);
			});
		}

		// Fails silently (need decent errors):
		value = value || 0;

		// Return the value as-is if it's already a number:
		if (typeof value === "number") return value;

		// Default decimal point comes from settings, but could be set to eg. "," in opts:
		decimal = decimal || lib.settings.number.decimal;

		 // Build regex to strip out everything except digits, decimal point and minus sign:
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
			unformatted = parseFloat(
				("" + value)
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
				.replace(regex, '')         // strip out any cruft
				.replace(decimal, '.')      // make sure decimal point is standard
			);

		// This will fail silently which may cause trouble, let's wait and see:
		return !isNaN(unformatted) ? unformatted : 0;
	};


	/**
	 * Implementation of toFixed() that treats floats more like decimals
	 *
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
	 * problems for accounting- and finance-related software.
	 */
	var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);
		var power = Math.pow(10, precision);

		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
	};


	/**
	 * Format a number, with comma-separated thousands and custom precision/decimal places
	 * Alias: `accounting.format()`
	 *
	 * Localise by overriding the precision and thousand / decimal separators
	 * 2nd parameter `precision` can be an object matching `settings.number`
	 */
	var formatNumber = lib.formatNumber = lib.format = function(number, precision, thousand, decimal) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val) {
				return formatNumber(val, precision, thousand, decimal);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(precision) ? precision : {
					precision : precision,
					thousand : thousand,
					decimal : decimal
				}),
				lib.settings.number
			),

			// Clean up precision
			usePrecision = checkPrecision(opts.precision),

			// Do some calc:
			negative = number < 0 ? "-" : "",
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
			mod = base.length > 3 ? base.length % 3 : 0;

		// Format the number:
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};


	/**
	 * Format a number into currency
	 *
	 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
	 * defaults: (0, "$", 2, ",", ".", "%s%v")
	 *
	 * Localise by overriding the symbol, precision, thousand / decimal separators and format
	 * Second param can be an object matching `settings.currency` which is the easiest way.
	 *
	 * To do: tidy up the parameters
	 */
	var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val){
				return formatMoney(val, symbol, precision, thousand, decimal, format);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero):
			formats = checkCurrencyFormat(opts.format),

			// Choose which format to use for this value:
			useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;

		// Return with currency symbol added:
		return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	};


	/**
	 * Format a list of numbers into an accounting column, padding with whitespace
	 * to line up currency symbols, thousand separators and decimals places
	 *
	 * List should be an array of numbers
	 * Second parameter can be an object containing keys that match the params
	 *
	 * Returns array of accouting-formatted number strings of same length
	 *
	 * NB: `white-space:pre` CSS rule is required on the list container to prevent
	 * browsers from collapsing the whitespace in the output strings.
	 */
	lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
		if (!list) return [];

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero), only need pos for now:
			formats = checkCurrencyFormat(opts.format),

			// Whether to pad at start of string or after currency symbol:
			padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,

			// Store value for the length of the longest string in the column:
			maxLength = 0,

			// Format the list according to options, store the length of the longest string:
			formatted = map(list, function(val, i) {
				if (isArray(val)) {
					// Recursively format columns if list is a multi-dimensional array:
					return lib.formatColumn(val, opts);
				} else {
					// Clean up the value
					val = unformat(val);

					// Choose which format to use for this value (pos, neg or zero):
					var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,

						// Format this value, push into formatted list and save the length:
						fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));

					if (fVal.length > maxLength) maxLength = fVal.length;
					return fVal;
				}
			});

		// Pad each number in the list and send back the column of numbers:
		return map(formatted, function(val, i) {
			// Only if this is a string (not a nested array, which would have already been padded):
			if (isString(val) && val.length < maxLength) {
				// Depending on symbol position, pad after symbol or at index 0:
				return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
			}
			return val;
		});
	};


	/* --- Module Definition --- */

	// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
	// Otherwise, just add `accounting` to the global object
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = lib;
		}
		exports.accounting = lib;
	} else if (typeof define === 'function' && define.amd) {
		// Return the library as an AMD module:
		define([], function() {
			return lib;
		});
	} else {
		// Use accounting.noConflict to restore `accounting` back to its original value.
		// Returns a reference to the library's `accounting` object;
		// e.g. `var numbers = accounting.noConflict();`
		lib.noConflict = (function(oldAccounting) {
			return function() {
				// Reset the value of the root's `accounting` variable:
				root.accounting = oldAccounting;
				// Delete the noConflict method:
				lib.noConflict = undefined;
				// Return reference to the library to re-assign it:
				return lib;
			};
		})(root.accounting);

		// Declare `fx` on the root (global/window) object:
		root['accounting'] = lib;
	}

	// Root will be `window` in browser or `global` on the server:
}(this));

},{}],52:[function(require,module,exports){
var currencySymbolMap = require('./map');

var symbolCurrencyMap = {};
for (var key in currencySymbolMap) {
  if (currencySymbolMap.hasOwnProperty(key)) {
    var currency = key;
    var symbol = currencySymbolMap[currency];
    symbolCurrencyMap[symbol] = currency;
  }
}

function getSymbolFromCurrency(currencyCode) {
  if (currencySymbolMap.hasOwnProperty(currencyCode)) {
    return currencySymbolMap[currencyCode];
  } else {
    return undefined;
  }
}

function getCurrencyFromSymbol(symbol) {
  if (symbolCurrencyMap.hasOwnProperty(symbol)) {
    return symbolCurrencyMap[symbol];
  } else {
    return undefined;
  }
}

function getSymbol(currencyCode) {
  //Deprecated
  var symbol = getSymbolFromCurrency(currencyCode);
  return symbol !== undefined ? symbol : '?';
}

module.exports = getSymbol; //Backward compatibility
module.exports.getSymbolFromCurrency = getSymbolFromCurrency;
module.exports.getCurrencyFromSymbol = getCurrencyFromSymbol;
module.exports.symbolCurrencyMap = symbolCurrencyMap;
module.exports.currencySymbolMap = currencySymbolMap;

},{"./map":53}],53:[function(require,module,exports){
module.exports =
{ "ALL": "L"
, "AFN": "؋"
, "ARS": "$"
, "AWG": "ƒ"
, "AUD": "$"
, "AZN": "₼"
, "BSD": "$"
, "BBD": "$"
, "BYR": "p."
, "BZD": "BZ$"
, "BMD": "$"
, "BOB": "Bs."
, "BAM": "KM"
, "BWP": "P"
, "BGN": "лв"
, "BRL": "R$"
, "BND": "$"
, "KHR": "៛"
, "CAD": "$"
, "KYD": "$"
, "CLP": "$"
, "CNY": "¥"
, "COP": "$"
, "CRC": "₡"
, "HRK": "kn"
, "CUP": "₱"
, "CZK": "Kč"
, "DKK": "kr"
, "DOP": "RD$"
, "XCD": "$"
, "EGP": "£"
, "SVC": "$"
, "EEK": "kr"
, "EUR": "€"
, "FKP": "£"
, "FJD": "$"
, "GHC": "₵"
, "GIP": "£"
, "GTQ": "Q"
, "GGP": "£"
, "GYD": "$"
, "HNL": "L"
, "HKD": "$"
, "HUF": "Ft"
, "ISK": "kr"
, "INR": "₹"
, "IDR": "Rp"
, "IRR": "﷼"
, "IMP": "£"
, "ILS": "₪"
, "JMD": "J$"
, "JPY": "¥"
, "JEP": "£"
, "KES": "KSh"
, "KZT": "лв"
, "KPW": "₩"
, "KRW": "₩"
, "KGS": "лв"
, "LAK": "₭"
, "LVL": "Ls"
, "LBP": "£"
, "LRD": "$"
, "LTL": "Lt"
, "MKD": "ден"
, "MYR": "RM"
, "MUR": "₨"
, "MXN": "$"
, "MNT": "₮"
, "MZN": "MT"
, "NAD": "$"
, "NPR": "₨"
, "ANG": "ƒ"
, "NZD": "$"
, "NIO": "C$"
, "NGN": "₦"
, "NOK": "kr"
, "OMR": "﷼"
, "PKR": "₨"
, "PAB": "B/."
, "PYG": "Gs"
, "PEN": "S/."
, "PHP": "₱"
, "PLN": "zł"
, "QAR": "﷼"
, "RON": "lei"
, "RUB": "₽"
, "SHP": "£"
, "SAR": "﷼"
, "RSD": "Дин."
, "SCR": "₨"
, "SGD": "$"
, "SBD": "$"
, "SOS": "S"
, "ZAR": "R"
, "LKR": "₨"
, "SEK": "kr"
, "CHF": "CHF"
, "SRD": "$"
, "SYP": "£"
, "TZS": "TSh"
, "TWD": "NT$"
, "THB": "฿"
, "TTD": "TT$"
, "TRY": ""
, "TRL": "₤"
, "TVD": "$"
, "UGX": "USh"
, "UAH": "₴"
, "GBP": "£"
, "USD": "$"
, "UYU": "$U"
, "UZS": "лв"
, "VEF": "Bs"
, "VND": "₫"
, "YER": "﷼"
, "ZWD": "Z$"
}

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,15,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39])


vueApp = new Vue({
    el: "body"
});

// Frontend end scripts

(function($, window, document)
{

    function CallistoMain()
    {

        // Sticky sidebar single item
        if (window.matchMedia("(min-width: 768px)").matches)
        {
            var $singleRightside = $(".single-rightside");

            $singleRightside.stick_in_parent({});

            $singleRightside.on("sticky_kit:bottom", function()
            {
                $(this).parent().css("position", "static");
            })
                .on("sticky_kit:unbottom", function()
                {
                    $(this).parent().css("position", "relative");
                });
        }
        var $toggleListView      = $(".toggle-list-view");
        var $toggleBasketPreview = $("#toggleBasketPreview, #closeBasketPreview");
        var $mainNavbarCollapse  = $("#mainNavbarCollapse");

        $toggleBasketPreview.on("click", function(evt)
        {
            evt.preventDefault();
            $("body").toggleClass("open-right");
        });

        $toggleListView.on("click", function(evt)
        {
            evt.preventDefault();

            // toggle it's own state
            $toggleListView.toggleClass("grid");

            // toggle internal style of thumbs
            $(".product-list, .cmp-product-thumb").toggleClass("grid");
        });

        $mainNavbarCollapse.collapse("hide");

        // Add click listener outside the navigation to close it
        $mainNavbarCollapse.on("show.bs.collapse", function()
        {
            $(".main").one("click", closeNav);
        });

        $mainNavbarCollapse.on("hide.bs.collapse", function()
        {
            $(".main").off("click", closeNav);
        });

        function closeNav()
        {
            $("#mainNavbarCollapse").collapse("hide");
        }

    }

    window.CallistoMain = new CallistoMain();

})(jQuery, window, document);

//# sourceMappingURL=plugin-callisto-app.js.map
