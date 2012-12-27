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

VideoCommandFocusableItem.prototype = new FocusableItem();

 /**
 * This class handles the focusing of the video control buttons
 *
 * @constructor
 * @augments FocusableItem
 * @param {DOMElement} element Focusable item DOM element
 * @param {String} action The action associated with this focusable item
 */
function VideoCommandFocusableItem(element, actionString) {

    FocusableItem.call(this, element);

    // TODO: This shouldn't be hard-coded
    var classStates = {
        focused: 'video-command-focused'
    };
    var action = actionString;
    var itemClickCallback = null;

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
    * Get the action this button should perform
    */
    this.getAction = function () {
        return action;
    };

    /**
    * Get the class names for each of the focused states
    * @function
    */
    this.getClassStates = function () {
        return classStates;
    };
}

/**
* Method called when the focus state of the object changes
* @function
* @param {Boolean} isFocused
*/
VideoCommandFocusableItem.prototype.onFocusStateChange = function(isFocused) {
    var element = this.getElement();
    if(isFocused) {
        element.addClass(this.getClassStates().focused);
    } else {
        element.removeClass(this.getClassStates().focused);
    }
};

/**
* Method called when the object is clicked
* @function
*/
VideoCommandFocusableItem.prototype.onItemClick = function() {
    if(this.getOnItemClickCallback()) {
        this.getOnItemClickCallback()(this.getAction());
    }
};
