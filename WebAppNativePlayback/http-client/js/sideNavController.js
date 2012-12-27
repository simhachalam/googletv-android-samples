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
 * The SideNavController sets up the menu on the left hand side of the screen
 *
 * @constructor
 * @param {String} navContainerId The id to give to the SideNavContainer
 * @param {FocusController} focusController
 * @param {String} sidenavParentId The id to place the side nav bar
 */
function SideNavController(navContainerId, fController, sidenavParentId) {
	var sideNavContainerId = navContainerId;
	var sideNavParentContainerId = sidenavParentId;
	var focusController = fController;
	var focusableItems = [];
	var selectedMenuItemIndex = -1;
	var menuItemSelectedCallback = null;

	var menuStyles = {
		item: 'menu-option',
		focused: 'menu-option-focused',
		selected: 'menu-option-selected'
	};

	/**
	* Class name for the rows container
	*/
	this.SIDE_NAV_ROWS_CLASS = 'sidenav-rows';
	/**
	* Class name for each individual row
	*/
	this.SIDE_NAV_ROW_CLASS = 'sidenav-item';
	/**
	* The class name prefix for row states
	*/
	this.SIDE_NAV_ITEM_CLASS_PREFIX = 'sidenav-item-';

	/**
	* Set the container Id of the side nav bar when it's created
	* @param {String} containerId
	*/
	this.setSideNavContainerId = function (containerId) {
		sideNavContainerId = containerId;
	};

	/**
	* Get the id of the side nav bar container
	*/
	this.getSideNavContainerId = function () {
		return sideNavContainerId;
	};

	/**
	* Get the Id of the parent of the side nav bar to place the side nav bar
	*/
	this.getSideNavParentContainerId = function () {
		return sideNavParentContainerId;
	};

	/**
	* Set the menu styles to be applied to the row items
	*
	* @param {JSObj} styles A javascript object with 'item', 'focused' &
	* 'selected' properties set
	*/
	this.setMenuStyles = function (styles) {
		menuStyles = styles;
	};

	/**
	* Get the menu styles of the rows
	*/
	this.getMenuStyles = function () {
		return menuStyles;
	};

	/**
	* Set the selected menu item
	* @param {int} index
	*/
	this.setSelectedMenuItemIndex = function (index) {
		selectedMenuItemIndex = index;
	};

	/**
	* Get the selected menu item
	*/
	this.getSelectedMenuItemIndex = function () {
		return selectedMenuItemIndex;
	};

	/**
	* Set a menu item selection callback
	* @param {function} callback
	*/
	this.setMenuItemSelectedCallback = function (callback) {
		menuItemSelectedCallback = callback;
	};

	/**
	* Get the menu selection callback
	*/
	this.getMenuItemSelectedCallback = function () {
		return menuItemSelectedCallback;
	};

	/**
	* Set a Focus Controller for the view
	* @param {FocusController} controller
	*/
	this.setFocusController = function (controller) {
		focusController = controller;
	};

	/**
	* Add a focusable item to the FocusController
	* @param {FocusableItem} item
	*/
	this.addFocusableItem = function (item) {
		if(typeof focusController === 'undefined') {
			return;
		}

        focusableItems.push(item);
        focusController.addFocusableItem(item);
    };

	/**
    * Remove all the focusable items
    */
	this.removeFocusableItems = function () {
        for(var i = 0; i < focusableItems.length; i++) {
            focusController.removeFocusableItem(focusableItems[i]);
        }
    };

	/**
    * A method to get a callback function
    * @param {int} index
    */
	this.createClickCallbackFunction = function (index) {
		// We need to bind the method to scope of this object
		return function(e) {
			if(this.getMenuItemSelectedCallback()) {
				this.getMenuItemSelectedCallback()(index);
			}
		}.bind(this);
	};
}

/**
* Set the titles for the menu
* @function
* @param {String[]} menuTitles
*/
SideNavController.prototype.setMenuTitles = function (menuTitles) {
	var rows = $('<div></div>').addClass(this.SIDE_NAV_ROWS_CLASS);

	var menuStyles = this.getMenuStyles();
	var menuItem;
	for(var i = 0; i < menuTitles.length; i++) {
		menuItem = $('<div></div>').addClass(this.SIDE_NAV_ROW_CLASS + ' ' + menuStyles.item);
		menuItem.attr('id', this.SIDE_NAV_ITEM_CLASS_PREFIX+i);
		menuItem.data('index', i);
		menuItem.append(menuTitles[i]);
		rows.append(menuItem);
	}

	this.removeFocusableItems();

	var sideNavContainer = $('#'+this.getSideNavContainerId());
	sideNavContainer.empty();
	sideNavContainer.append(rows);

	var menuElements = $('#' + this.getSideNavContainerId() + ' .' + menuStyles.item);
	var focusableItem;
	for(i = 0; i < menuElements.length; i++) {
		focusableItem = new SideMenuFocusableItem($(menuElements[i]), menuStyles, this.getSideNavParentContainerId());
		focusableItem.setOnItemClickCallback(this.createClickCallbackFunction(i));
		this.addFocusableItem(focusableItem);
	}
};

/**
* Select a menu item
* @function
* @param {int} index
*/
SideNavController.prototype.selectMenuItem = function (itemIndex) {
	var menuStyles = this.getMenuStyles();

	// Check if we need to deselect current menu item
	var currentSelectedItem = this.getSelectedMenuItemIndex();
	if(currentSelectedItem >= 0) {
		$('#'+this.SIDE_NAV_ITEM_CLASS_PREFIX+currentSelectedItem).removeClass(menuStyles.selected);
	}

	this.setSelectedMenuItemIndex(itemIndex);
	$('#'+this.SIDE_NAV_ITEM_CLASS_PREFIX+itemIndex).addClass(menuStyles.selected);
};

/**
* Set a callback method for a menu item click
* @function
* @param {function} callback
*/
SideNavController.prototype.setMenuItemClickCallback = function (callback) {
	this.setMenuItemSelectedCallback(callback);
};
