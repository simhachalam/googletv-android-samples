// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
* The constructor for the index page, sets up the side bar and grid
*
* @constructor
* @param {VideoDataController} videoDataController
* @param {FocusController} focusController
*/
function IndexPage(vidDataController, fController) {
    var videoDataController = vidDataController;
    var sideNavController = null;
    var gridController = null;
    var selectedCategoryIndex = 0;
    var focusController = fController;
    var embedded = false;

    /**
     * Set the VideoDataController
     *
     * @param {VideoDataController} controller
     */
    this.setVideoDataController = function (controller) {
        videoDataController = controller;
    };

    /**
     * Get the VideoDataController
     */
    this.getVideoDataController = function () {
        return videoDataController;
    };

    /**
     * Set the SideNavController for the left hand side navigation
     *
     * @param {SideNavController} controller
     */
    this.setSideNavController = function (controller) {
        sideNavController = controller;
        sideNavController.setFocusController(this.getFocusController());
    };

    /**
     * Get the SideNavController
     */
    this.getSideNavController = function () {
        return sideNavController;
    };

    /**
     * Set the GridController
     *
     * @param {GridController} controller
     */
    this.setGridController = function (controller) {
        gridController = controller;
        gridController.setFocusController(this.getFocusController());
    };

    /**
     * Get the GridController
     */
    this.getGridController = function () {
        return gridController;
    };

    /**
     * Set the selected category index (i.e. the category on the left hand side)
     *
     * @param {int} index
     */
    this.setSelectedCategoryIndex = function (index) {
        selectedCategoryIndex = index;
    };

    /**
     * Get the selected category
     */
    this.getSelectedCategoryIndex = function () {
        return selectedCategoryIndex;
    };

    /**
     * Set the FocusController to be used in the page
     *
     * @param {FocusController} controller
     */
    this.setFocusController = function (controller) {
        focusController = controller;
    };

    /**
     * Get the FocusController for the page
     */
    this.getFocusController = function () {
        return focusController;
    };

    /**
     * Returns a callback function  to handle category selection
     */
    this.getSideNavItemSelectedCallback = function () {
        return function(selectedItem) {
            this.onMenuItemSelected(selectedItem);
        }.bind(this);
    };

    /**
     * Returns a callback function to handle a grid item selection
     */
    this.getGridItemSelectedCallback = function () {
        return function(index, data) {
            this.onGridItemSelected(index, data);
        }.bind(this);
    };

    /**
     * Set whether the page is embedded within a native app or not
     *
     * @param {boolean} isEmbedded
     */
    this.setEmbedded = function (isEmbedded) {
        embedded = isEmbedded;
    };

    /**
     * Check is the page is embedded within a native app
     */
    this.isEmbedded = function () {
        return embedded;
    };
}

/**
* Set up the initial state of the page
* @function
*/
IndexPage.prototype.setUpPageState = function () {
    var queryString = location.search;
    if (queryString.length < 1) {
        return;
    }

    var params = queryString.substring(1).split('&');
    // We must have 2 or 3 parameters
    if (params.length < 1) {
        return;
    }

    var paramSplit;
    var embedded = false;

    var paramString;
    for(var  i = 0; i < params.length; i++) {
        paramString = params[i];
        paramSplit = paramString.split("=");
        if(paramSplit.length != 2) {
            continue;
        }

        if(paramSplit[0].toLowerCase() == 'embedded') {
            embedded = paramSplit[1].toLowerCase() == 'true';
        }
    }

    this.setEmbedded(embedded);
};

/**
* Make the side navigation bar and add it to the view
* @function
*/
IndexPage.prototype.makeSideNav = function () {
    if(!this.getSideNavController()) {
        console.log('No Side Nav Controller');
        return;
    }

    if (!this.getVideoDataController()) {
        console.log('No Video Controller');
        return;
    }

    var navItems = [];
    var videoCategories = this.getVideoDataController().getVideoCategories();
    for (var i=0; i < videoCategories.length; i++) {
        navItems.push(videoCategories[i].title);
    }

    var sideNavController = this.getSideNavController();
    sideNavController.setMenuTitles(navItems);
    sideNavController.setMenuItemClickCallback(this.getSideNavItemSelectedCallback());
};

/**
* Callback when a menu item is selected
* @function
* @param {int}  selectedItem    The index of the selected item
*/
IndexPage.prototype.onMenuItemSelected = function (selectedItem) {
    this.changeCategory(selectedItem);
};

/**
* Callback when a grid item is selected
* @function
* @param {int}  index   The index of the selected item
*/
IndexPage.prototype.onGridItemSelected = function (index) {
    location.assign('./pages/fullscreen.html?category=' + this.getSelectedCategoryIndex() + '&item=' + index);
};

/**
* Method to change the category
* @private
* @function
* @param {int}  categoryIndex   The selected category index
*/
IndexPage.prototype.changeCategory = function (categoryIndex) {
    this.setSelectedCategoryIndex(categoryIndex);

    var sideNavController = this.getSideNavController();
    sideNavController.selectMenuItem(this.getSelectedCategoryIndex());

    var videoData = this.getVideoDataController().getVideoData(this.getSelectedCategoryIndex());

    var gridController = this.getGridController();
    gridController.setGridData(videoData);
};

/**
* Make the grid and add it to the view
* @function
*/
IndexPage.prototype.makeGrid = function () {
    if(!this.getGridController()) {
        console.log("No Grid Controller");
        return;
    }

    if (!this.getVideoDataController()) {
        console.log("No Video Controller");
        return;
    }

    var gridController = this.getGridController();
    callback = this.getGridItemSelectedCallback();
    gridController.setItemSelectedCallback(callback);
};

/**
* Select the appropriate view to receive the initial focus
* @function
*/
IndexPage.prototype.initialiseFocus = function () {
    var focusController = this.getFocusController();
    if(typeof focusController === "undefined") {
        return;
    }

    focusController.handleFocusChangeToItem(0);
};

/**
* This method will set up any additional key handling (i.e. Android key handling)
* @function
*/
IndexPage.prototype.setUpKeyHandling = function () {
    if(this.isEmbedded()) {
        // We want the native app to access this
        window.androidKeyHandler = new AndroidKeyHandler(this.getFocusController());
    }
};

var indexPage;

$(document).ready(function() {
    if(indexPage !== undefined) {
        return;
    }

    indexPage = new IndexPage(new VideoDataController(), new FocusController());
    indexPage.setUpPageState();

    indexPage.setSideNavController(new SideNavController('side-menu-container'), null, 'left-panel');
    indexPage.makeSideNav();

    indexPage.setGridController(new GridController('video-grid'));
    indexPage.makeGrid();

    indexPage.setUpKeyHandling();

    // Set Up Listeners after initialisation
    indexPage.getSideNavController().setMenuItemSelectedCallback(indexPage.getSideNavItemSelectedCallback());
    indexPage.changeCategory(0);
    indexPage.initialiseFocus();

    $(document.body).css('visibility', 'visible');
});
