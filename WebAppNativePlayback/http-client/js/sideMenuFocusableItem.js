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

SideMenuFocusableItem.prototype = new FocusableItem();

/**
 * This class handles the changing of focus states of the side menu items
 *
 * @constructor
 * @augments FocusableItem
 * @param {DOMElement} element DOM Element of focusable item
 * @param {JSObj} style Javascript object with class names to be applied for
 * for each focus state
 * @param {String} parentContainerID The parent container ID to scroll
 */
function SideMenuFocusableItem(element, styles, parentCont) {
    FocusableItem.call(this, element);

    var classStates = styles;
    var itemClickCallback = null;
    var parentContainer = parentCont;

    /**
    * Set the item click callback
    * @function
    * @param {function} callback
    */
    this.setOnItemClickCallback = function (callback) {
        itemClickCallback = callback;
    };

    /**
    * Get the item click callback
    * @function
    */
    this.getOnItemClickCallback = function () {
        return itemClickCallback;
    };

    /**
    * Get the class names for each of the focused states
    * @function
    */
    this.getClassStates = function () {
        return classStates;
    };

    /**
    * Get the parent container
    * @function
    */
    this.getParentContainer = function () {
        return parentContainer;
    };
}

/**
* Method called when the focus state of the object changes
* @function
* @param {Boolean} isFocused
*/
SideMenuFocusableItem.prototype.onFocusStateChange = function(isFocused) {
    var element = this.getElement();
    if(isFocused) {
        element.addClass(this.getClassStates().focused);

        // Scroll into view
        var itemRootParent = $('.'+this.getParentContainer());

        var offsetAmount = element.position().top +
        element.outerHeight(true) -
        itemRootParent.outerHeight(true);

        var newScrollTop;
        var shouldScroll = false;

        if(offsetAmount > 0) {
            shouldScroll = true;
            newScrollTop = itemRootParent.scrollTop() + offsetAmount;
        } else if(element.position().top < 0) {
            shouldScroll = true;
            newScrollTop = itemRootParent.scrollTop() + menuContainer.position().top;
        } else {
            // We want the acme logo to be displayed
            // as much as possible, can we scroll up?
            var bottomSpace = itemRootParent.outerHeight(true) - element.position().top - element.outerHeight(true);
            if(bottomSpace > 0) {
                shouldScroll = true;
            }

            newScrollTop = itemRootParent.scrollTop() - bottomSpace;

            if(newScrollTop <= 0) {
                newScrollTop = 0;
            }
        }

        if(shouldScroll) {
            itemRootParent.stop();
            itemRootParent.animate({
                scrollTop: newScrollTop
            }, 500);
        }
    } else {
        element.removeClass(this.getClassStates().focused);
    }
};

/**
* Method called when the object is clicked
* @function
*/
SideMenuFocusableItem.prototype.onItemClick = function() {
    console.log("SideNavFocusableItem: onItemClick");
    if(this.getOnItemClickCallback()) {
        this.getOnItemClickCallback()();
    }
};
