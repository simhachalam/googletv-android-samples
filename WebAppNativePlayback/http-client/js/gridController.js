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
 * This class creates the grid of items in the UI and handles the relevant
 * changes as the user selects videos / changes categories
 *
 * @constructor
 * @param {String} containerId The id of the div to place the grid within
 * @param {FocusController} focusController The FocusController for the UI
 */
function GridController(containerId, fController) {
    var gridContainerId = containerId;
    var focusController = fController;
    var focusableItems = [];
    var itemSelectedCallback = null;

    this.GRID_WRAPPER_CLASS = 'grid-item-wrapper';
    this.GRID_ITEM_ID_PREFIX = 'grid-item-';

    var gridItemStyles = {
        item: 'grid-item',
        focused: 'grid-item-focused'
    };

    /**
    * Set the container Id of the grid
    * @param {String} navContainerId Set the container Id of the div
    */
    this.setGridContainerId = function (navContainerId) {
        gridContainerId = navContainerId;
    };

    /**
    * Get the container Id for the grid
    */
    this.getGridContainerId = function () {
        return gridContainerId;
    };

    /**
    * Set the styles to be applied to the grid during focus state
    * @param {JSObject} styles Set 'item' and 'focused' properties
    */
    this.setGridItemStyles = function (styles) {
        gridItemStyles = styles;
    };

    /**
    * Get the styles for the items
    */
    this.getGridItemStyles = function () {
        return gridItemStyles;
    };

    /**
    * Set the FocusController for the grid
    * @param {FocusController} controller
    */
    this.setFocusController = function (controller) {
        focusController = controller;
    };

    /**
    * Add an item to be focused on the FocusController
    * @param {FocusableItem} focusableItem
    */
    this.addFocusableItem = function (focusableItem) {
        if(typeof focusController === 'undefined') {
            return;
        }

        focusableItems.push(focusableItem);
        focusController.addFocusableItem(focusableItem);
    };

    /**
    * Removable all the focusable items from the focus controller
    */
    this.removeFocusableItems = function () {
        for(var i = 0; i < focusableItems.length; i++) {
            focusController.removeFocusableItem(focusableItems[i]);
        }
    };

    /**
    * Set a callback for item selection
    * @param {function} callback
    */
    this.setItemSelectedCallback = function (callback) {
        this.itemSelectedCallback = callback;
    };

    /**
    * Get the item selected callback
    */
    this.getItemSelectedCallback = function () {
        return this.itemSelectedCallback;
    };

    /**
    * Get an item callback function
    * @param {int} index The index of the selected item
    * @param {String} data Data relevant to the callback
    */
    this.getItemCallbackFunction = function (index, data) {
        return function(e) {
            if(this.getItemSelectedCallback()) {
                this.getItemSelectedCallback()(index, data);
            }
        }.bind(this);
    };
}

/**
* Set the data needed to populate the grid
* @param {Array<JSObj>} gridData The objects contain 'image' & 'title'
* properties
*/
GridController.prototype.setGridData = function (gridData) {
    var gridContainer = $('#'+this.getGridContainerId());
    this.removeFocusableItems();
    gridContainer.empty();

    var menuStyles = this.getGridItemStyles();
    var menuItem;
    for(var i = 0; i < gridData.length; i++) {
        menuItem = $('<div></div>').addClass(this.GRID_WRAPPER_CLASS);
        menuItem.attr('id', this.GRID_ITEM_ID_PREFIX+i);
        menuItem.data('index', i);

        menuItem.append(this.getGridItemHTML(gridData[i]));

        gridContainer.append(menuItem);
    }

    gridContainer.append($('<div></div>').addClass('clear'));

    var gridElements = $('#' + this.getGridContainerId() + ' .' + this.getGridItemStyles().item);
    var focusableItem;
    for(i = 0; i < gridElements.length; i++) {
        focusableItem = new GridFocusableItem($(gridElements[i]), this.getGridContainerId());
        focusableItem.setOnItemClickCallback(this.getItemCallbackFunction(i, gridData[i]));
        this.addFocusableItem(focusableItem);
    }
};

/**
* Get the html generated for a grid item
* @param {JSObj} videoData The object contains a 'image' & 'title' property
*/
GridController.prototype.getGridItemHTML = function (videoData) {
    var gridItem = $('<div></div>').addClass(this.getGridItemStyles().item);

    gridItem.append('<img class="thumb" src="'+videoData.image+'" />');
    gridItem.append('<div class="title">'+videoData.title+'</div>');

    return gridItem;
};
